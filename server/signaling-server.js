// Simple WebSocket signaling server for 1:1 calls
// Usage: node server/signaling-server.js
// Broadcasts SDP offers/answers and ICE candidates between two peers in a room

const http = require('http')
const WebSocket = require('ws')

const BASE_PORT = Number(process.env.SIGNALING_PORT) || 3001
let currentPort = BASE_PORT

// roomId -> Set of clients (ws)
const rooms = new Map()

// ws -> { roomId, clientId }
const clients = new Map()

function makeId() {
  return Math.random().toString(36).slice(2, 10)
}

function getRoomPeers(roomId) {
  const set = rooms.get(roomId)
  return set ? Array.from(set) : []
}

function broadcastToRoom(roomId, senderWs, payload) {
  const peers = getRoomPeers(roomId)
  for (const ws of peers) {
    if (ws !== senderWs && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload))
    }
  }
}

// Create an HTTP server so normal HTTP GETs don't return 426 Upgrade Required
const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '/health')) {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', service: 'signaling', port: Number(currentPort) }))
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})

const wss = new WebSocket.Server({ server })
wss.on('error', (err) => {
  // This can fire when the underlying HTTP server fails to bind
  if (err && err.code === 'EADDRINUSE') {
    // ignore; HTTP server error handler will trigger retry
    return
  }
  console.error('[signaling] wss error:', err)
})

function startServer(port, attemptsLeft = 10) {
  currentPort = port
  // Attach error handler before listen to catch immediate EADDRINUSE
  const onError = (err) => {
    if (err && err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      server.removeListener('error', onError)
      try {
        server.close()
      } catch {}
      const nextPort = currentPort + 1
      console.log(`[signaling] Port ${currentPort} in use, retrying on ${nextPort}...`)
      // Recreate HTTP server handlers and rebind wss to the same server instance is not needed;
      // we can reuse the same server object to listen on next port.
      startServer(nextPort, attemptsLeft - 1)
    } else {
      console.error('[signaling] Failed to start server:', err)
    }
  }
  server.on('error', onError)
  server.listen(currentPort, () => {
    console.log(`[signaling] WebSocket server listening on ws://localhost:${currentPort}`)
  })
}

startServer(BASE_PORT)

wss.on('connection', (ws) => {
  const clientId = makeId()
  clients.set(ws, { clientId, roomId: null })

  ws.on('message', (data) => {
    let msg
    try {
      msg = JSON.parse(data.toString())
    } catch (e) {
      console.warn('[signaling] invalid JSON:', data.toString())
      return
    }

    const meta = clients.get(ws)

    switch (msg.type) {
      case 'join': {
        const { roomId, user } = msg
        meta.roomId = roomId

        if (!rooms.has(roomId)) rooms.set(roomId, new Set())
        const set = rooms.get(roomId)
        set.add(ws)

        // Notify the new client
        ws.send(
          JSON.stringify({
            type: 'welcome',
            clientId,
            peers: set.size - 1,
          })
        )

        // Notify existing peers someone joined
        broadcastToRoom(roomId, ws, { type: 'peer-joined', clientId })
        break
      }
      case 'offer':
      case 'answer':
      case 'ice-candidate':
      case 'media-state-update':
      case 'chat': {
        // Forward to other peers in the room
        if (!meta.roomId) return
        const payload = { ...msg, from: clientId }
        broadcastToRoom(meta.roomId, ws, payload)
        break
      }
      default:
        break
    }
  })

  ws.on('close', () => {
    const meta = clients.get(ws)
    if (!meta) return
    const { roomId } = meta
    clients.delete(ws)
    if (roomId && rooms.has(roomId)) {
      const set = rooms.get(roomId)
      set.delete(ws)
      if (set.size === 0) rooms.delete(roomId)
      else {
        // notify others that a peer left
        for (const peer of set) {
          if (peer.readyState === WebSocket.OPEN) {
            peer.send(JSON.stringify({ type: 'peer-left', clientId: meta.clientId }))
          }
        }
      }
    }
  })
})

process.on('SIGINT', () => {
  console.log('\n[signaling] shutting down...')
  wss.close(() => server.close(() => process.exit(0)))
})
