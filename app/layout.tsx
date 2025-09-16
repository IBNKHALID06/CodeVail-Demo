import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '../src/contexts/ThemeContext'
import { AuthProvider } from '../src/contexts/AuthContext'
import { NotificationProvider } from '../src/contexts/NotificationContext'
import { LoadingProvider } from '../src/contexts/LoadingContext'
import { ViolationWarning } from '../components/violation-warning'
import AntiCheatAutostart from '../components/anti-cheat-autostart'
import RouteBridge from '../components/route-bridge'
import AppFooter from '../components/app-footer'

export const metadata: Metadata = {
  title: 'CodeVail Platform',
  description: 'Secure technical interviewing & assessment environment',
  applicationName: 'CodeVail',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head></head>
      <body>
        <LoadingProvider>
          <ThemeProvider>
            <AuthProvider>
              <NotificationProvider>
                {/* Inject a signaling URL override for the browser to avoid port-probing edge cases */}
                <script
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(){
                      try {
                        var saved = (window.localStorage && window.localStorage.getItem('SIGNALING_PORT')) || '';
                        var start = 3001;
                        var port = Number(saved) || start;
                        function setSig(p){
                          (window).__SIGNALING_URL__ = 'ws://localhost:' + p;
                          try { window.localStorage && window.localStorage.setItem('SIGNALING_PORT', String(p)); } catch(e) {}
                          console.log('[boot] signaling url set to', (window).__SIGNALING_URL__);
                        }
                        setSig(port);
                        // async verify and discover if needed
                        (async function(){
                          async function isUp(p){
                            try {
                              const controller = new AbortController();
                              const t = setTimeout(() => controller.abort(), 600);
                              const res = await fetch('http://localhost:'+p+'/health', {cache:'no-store', signal: controller.signal});
                              clearTimeout(t);
                              return res && res.ok;
                            } catch(_) { return false; }
                          }
                          if (await isUp(port)) return;
                          for (var i=0;i<10;i++){
                            var candidate = start + i;
                            if (candidate === port) continue;
                            if (await isUp(candidate)) { setSig(candidate); return; }
                          }
                        })();
                      } catch(e) {}
                    })();
                  `,
                }}
              />
                <div id="top" className="min-h-screen flex flex-col">
                  <div className="flex-1">{children}</div>
                  <AppFooter />
                </div>
                {/* RouteBridge informs Electron main of SPA navigations for controlled monitoring lifecycle */}
                <RouteBridge />
                <ViolationWarning />
                {/* In Electron, auto-start an anti-cheat session so detection/termination works without manual flow */}
                <AntiCheatAutostart />
                <Analytics />
              </NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </LoadingProvider>
      </body>
    </html>
  )
}
