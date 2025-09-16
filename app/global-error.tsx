'use client'

import React from 'react'

// Global error boundary for errors that bubble to the root (outside nested layouts)
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('[Global Error Boundary]', error)
  }, [error])

  return (
    <html>
      <body>
        <div style={{
          maxWidth: 680,
          margin: '80px auto',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>App crashed</h1>
          {error?.message && (
            <p style={{ color: '#555', marginBottom: 12 }}>{error.message}</p>
          )}
          <div style={{ marginTop: 16 }}>
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
              Reload
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
