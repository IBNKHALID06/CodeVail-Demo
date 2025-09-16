import { NextResponse } from 'next/server'

// Update this URL when you publish a new release
const latest = {
  version: '0.1.0',
  url: 'https://github.com/youruser/CodeVail-Demo/releases/download/v0.1.0/CodeVail-0.1.0-win-x64.exe'
}

export function GET() {
  return NextResponse.redirect(latest.url, 302)
}
