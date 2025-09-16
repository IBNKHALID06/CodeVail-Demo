'use client'

import React from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('[App Error Boundary]', error)
  }, [error])

  return (
    <div style={{
      maxWidth: 680,
      margin: '80px auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
    }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Something went wrong</h1>
      {error?.message && (
        <p style={{ color: '#555', marginBottom: 12 }}>{error.message}</p>
      )}
      {error?.['digest'] && (
        <code style={{ display: 'block', color: '#666', background: '#f5f5f5', padding: 8, borderRadius: 6 }}>
          digest: {error['digest']}
        </code>
      )}
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
        <button
          onClick={() => (window.location.href = '/')}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
          }}
        >
          Go home
        </button>
      </div>
    </div>
  )
}
