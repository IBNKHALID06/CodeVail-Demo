export class WebRTCService {
  private peerConnections: Map<string, RTCPeerConnection> = new Map()
  private localStream: MediaStream | null = null
  private websocket: WebSocket | null = null
  private roomId: string
  private user: any
  private eventListeners: { [key: string]: Function[] } = {}
  private clientId: string | null = null
  private isOfferer: boolean | null = null

  constructor(roomId: string, user: any) {
    this.roomId = roomId
    this.user = user
    this.initializePeerConnection()
  }

  private initializePeerConnection() {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
    }

      this.peerConnections.set("default", new RTCPeerConnection(configuration));
      const defaultPeer = this.peerConnections.get("default");
      if (defaultPeer) {
        defaultPeer.onicecandidate = (event) => {
          if (event.candidate) {
            this.sendSignalingMessage({
              type: "ice-candidate",
              candidate: event.candidate,
            });
          }
        };

        defaultPeer.ontrack = (event) => {
          const [remoteStream] = event.streams;
          this.emit("streamReceived", "remote-user", remoteStream);
        };

        defaultPeer.onconnectionstatechange = () => {
          this.emit("connectionStateChanged", defaultPeer.connectionState);
        };
      }
  }

  async joinCall(stream: MediaStream) {
    this.localStream = stream

    // Add local stream to peer connection
    stream.getTracks().forEach((track) => {
      this.peerConnections.get("default")?.addTrack(track, stream)
    })
  // Emit local stream for UI if needed
  this.emit("streamReceived", "local-user", stream)

    // Initialize WebSocket connection
    this.initializeWebSocket()

    return true
  }

  private initializeWebSocket() {
    const explicit = (typeof window !== 'undefined' && (window as any).__SIGNALING_URL__) as string | undefined
    const candidatePorts = Array.from({ length: 10 }, (_, i) => 3001 + i)
    const urls = explicit ? [explicit] : candidatePorts.map((p) => `ws://localhost:${p}`)

    const tryConnect = (list: string[], idx = 0) => {
      if (idx >= list.length) {
        console.error('[webrtc] no signaling server reachable')
        return
      }
      const url = list[idx]
      let ws: WebSocket
      try {
        ws = new WebSocket(url)
      } catch (e) {
        console.warn('[webrtc] websocket ctor failed, trying next', e)
        return tryConnect(list, idx + 1)
      }
      let settled = false
      ws.onopen = () => {
        settled = true
        this.websocket = ws
        // Join room
        this.websocket?.send(
          JSON.stringify({ type: 'join', roomId: this.roomId, user: this.user })
        )
        // Do not create offer yet; wait for welcome/peer-joined to avoid glare
        this.emit('connectionStateChanged', 'connecting')
      }
      ws.onerror = () => {
        if (!settled) {
          try { ws.close() } catch {}
          tryConnect(list, idx + 1)
        } else {
          this.emit('connectionStateChanged', 'disconnected')
        }
      }
      ws.onclose = () => {
        if (this.websocket === ws) {
          this.emit('connectionStateChanged', 'disconnected')
        } else if (!settled) {
          tryConnect(list, idx + 1)
        }
      }

      // Bind message handler once connected (below we reassign after success)
      ws.onmessage = async (event) => {
        if (this.websocket !== ws) return
        let msg: any
        try {
          msg = JSON.parse(event.data)
        } catch (e) {
          return
        }
        switch (msg.type) {
          case 'welcome': {
            this.clientId = msg.clientId
            // If 0 peers in room, we're the first (offerer). Otherwise, wait for offer.
            if (typeof msg.peers === 'number') {
              this.isOfferer = msg.peers === 0
            }
            break
          }
          case 'peer-joined': {
            // a peer joined; only the designated offerer should create the offer
            if (this.isOfferer) {
              await this.createAndSendOffer()
            }
            break
          }
          case 'offer': {
            await this.handleRemoteOffer(msg)
            break
          }
          case 'answer': {
            await this.handleRemoteAnswer(msg)
            break
          }
          case 'ice-candidate': {
            try {
              const pc = this.peerConnections.get('default')
              if (pc && msg.candidate) {
                await pc.addIceCandidate(new RTCIceCandidate(msg.candidate))
              }
            } catch (e) {
              console.warn('[webrtc] addIceCandidate failed', e)
            }
            break
          }
          case 'media-state-update': {
            // Forward to app (e.g., update UI about remote mute)
            this.emit('remoteMediaState', msg.state)
            break
          }
          case 'chat': {
            this.emit('chat', msg)
            break
          }
          case 'peer-left': {
            this.emit('peerLeft', msg.clientId)
            break
          }
          default:
            break
        }
      }
    }

    tryConnect(urls)

  // Note: onclose/onerror handled per-socket inside tryConnect
  }

  private async createAndSendOffer() {
    const pc = this.peerConnections.get('default')
    if (!pc) return
    try {
  // Ensure transceivers exist for sendrecv so remote can add tracks
  const kinds = pc.getTransceivers().map(t => t.receiver.track?.kind)
  if (!kinds.includes('audio')) pc.addTransceiver('audio', { direction: 'sendrecv' })
  if (!kinds.includes('video')) pc.addTransceiver('video', { direction: 'sendrecv' })
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      this.sendSignalingMessage({ type: 'offer', sdp: offer })
    } catch (e) {
      console.error('[webrtc] failed to create/send offer', e)
    }
  }

  private async handleRemoteOffer(msg: any) {
    const pc = this.peerConnections.get('default')
    if (!pc) return
    try {
      if (pc.signalingState === 'have-local-offer') {
        // rollback to handle glare
        await pc.setLocalDescription({ type: 'rollback' } as any)
      }
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      this.sendSignalingMessage({ type: 'answer', sdp: answer })
    } catch (e) {
      console.error('[webrtc] handleRemoteOffer failed', e)
    }
  }

  private async handleRemoteAnswer(msg: any) {
    const pc = this.peerConnections.get('default')
    if (!pc) return
    try {
      if (pc.signalingState === 'stable') {
        // already stable; ignore stray answer
        return
      }
      await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
      this.emit('connectionStateChanged', 'connected')
    } catch (e) {
      console.error('[webrtc] handleRemoteAnswer failed', e)
    }
  }

  async updateMediaState(state: { video: boolean; audio: boolean; screenSharing: boolean }) {
    // Update local tracks
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0]
      const audioTrack = this.localStream.getAudioTracks()[0]

      if (videoTrack) videoTrack.enabled = state.video
      if (audioTrack) audioTrack.enabled = state.audio
    }

    // Send state update to other participants
    this.sendSignalingMessage({
      type: "media-state-update",
      state,
    })
  }

  async startScreenShare(screenStream: MediaStream) {
    if (!this.peerConnections.get("default")) return

    // Replace video track with screen share
    const videoTrack = screenStream.getVideoTracks()[0]
    const sender = this.peerConnections
      .get("default")
      ?.getSenders()
      .find((s) => s.track && s.track.kind === "video")

    if (sender) {
      await sender.replaceTrack(videoTrack)
    }
  }

  async stopScreenShare() {
    if (!this.peerConnections.get("default") || !this.localStream) return

    // Replace screen share with camera
    const videoTrack = this.localStream.getVideoTracks()[0]
    const sender = this.peerConnections
      .get("default")
      ?.getSenders()
      .find((s) => s.track && s.track.kind === "video")

    if (sender && videoTrack) {
      await sender.replaceTrack(videoTrack)
    }
  }

  private sendSignalingMessage(message: any) {
  if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      const payload = { roomId: this.roomId, ...message }
      this.websocket.send(JSON.stringify(payload))
    } else {
      console.warn('[webrtc] websocket not ready, dropping message', message?.type)
    }
  }

  sendChat(message: string) {
    this.sendSignalingMessage({ type: 'chat', message, user: this.user })
  }

  on(event: string, callback: Function) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = []
    }
    this.eventListeners[event].push(callback)
  }

  private emit(event: string, ...args: any[]) {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach((callback) => callback(...args))
    }
  }

  disconnect() {
    this.peerConnections.get("default")?.close()
    this.websocket?.close()
    this.localStream?.getTracks().forEach((track) => track.stop())
  }
}
