import React from 'react'

export default function NotFound() {
  return (
    <div style={{
      maxWidth: 680,
      margin: '80px auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Page not found</h1>
      <p style={{ color: '#555' }}>The page you are looking for doesn’t exist.</p>
      <div style={{ marginTop: 16 }}>
        <a href="/" style={{ color: '#0b5' }}>Return home</a>
      </div>
    </div>
  )
}
