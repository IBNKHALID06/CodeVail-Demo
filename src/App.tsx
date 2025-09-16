"use client"

import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider, useAuth } from "./contexts/AuthContext"

// Pages
import LoginPage from "./pages/LoginPage"
import CandidateDashboard from "./pages/CandidateDashboard"
import InterviewerDashboard from "./pages/InterviewerDashboard"
// NEW LEGAL PAGES - ADDED
import UserAgreement from "./pages/UserAgreement"
import TermsOfService from "./pages/TermsOfService"
import PrivacyPolicy from "./pages/PrivacyPolicy"
// END NEW LEGAL PAGES
import Footer from "./components/Footer"
import TopBar from "./components/TopBar"

const AGREEMENT_KEY = 'userAgreementAccepted';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

function DashboardRouter() {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return user.role === "candidate" ? <CandidateDashboard /> : <InterviewerDashboard />
}

// Gate component to enforce agreement acceptance before other routes (public safe list excluded)
function AgreementGate({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const publicPaths = ['/agreement', '/privacy', '/terms', '/', '/login'];
  const accepted = typeof window !== 'undefined' && localStorage.getItem(AGREEMENT_KEY) === 'true';
  if (!accepted && !publicPaths.includes(location.pathname)) {
    return <Navigate to="/agreement" replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AgreementGate>
            <div className="min-h-screen flex flex-col">
              <TopBar />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  {/* NEW LEGAL ROUTES - ADDED */}
                  <Route path="/agreement" element={<UserAgreement />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  {/* END NEW LEGAL ROUTES */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardRouter />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </AgreementGate>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
