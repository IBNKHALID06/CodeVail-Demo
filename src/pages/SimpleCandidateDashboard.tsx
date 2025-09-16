"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSimpleAuth } from "../contexts/SimpleAuthContext"

export default function SimpleCandidateDashboard() {
  const { user, loading, logout } = useSimpleAuth()
  const router = useRouter()

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      console.log("No user found, redirecting to login")
  router.push("/login")
    }
  }, [user, loading, router])

  // Show loading
  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontSize: "18px"
      }}>
        Loading...
      </div>
    )
  }

  // Show login redirect if no user
  if (!user) {
    return null
  }

  // Check role
  if (user.role !== "candidate") {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px"
      }}>
        <h2>Access Denied</h2>
        <p>This dashboard is for candidates only.</p>
        <button 
          onClick={() => router.push("/login")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#f5f5f5",
      padding: "20px"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div>
          <h1 style={{ margin: 0, color: "#333" }}>Candidate Dashboard</h1>
          <p style={{ margin: "5px 0 0 0", color: "#666" }}>
            Welcome back, {user.name}! ({user.email})
          </p>
        </div>
        <button
          onClick={logout}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px"
      }}>
        {/* Available Tests */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>📝 Available Tests</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <strong>JavaScript Assessment</strong>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Duration: 60 minutes • Difficulty: Medium
              </p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer"
              }}>
                Start Test
              </button>
            </div>
            <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <strong>React Development</strong>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Duration: 90 minutes • Difficulty: Advanced
              </p>
              <button style={{
                marginTop: "10px",
                padding: "8px 16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer"
              }}>
                Start Test
              </button>
            </div>
          </div>
        </div>

        {/* Recent Results */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>📊 Recent Results</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <strong>Python Basics</strong>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Score: 85% • Completed: 2 days ago
              </p>
            </div>
            <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <strong>Algorithm Challenge</strong>
              <p style={{ margin: "5px 0 0 0", color: "#666" }}>
                Score: 92% • Completed: 1 week ago
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>⚡ Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={{
              padding: "15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "left"
            }}>
              📹 Join Interview Call
            </button>
            <button style={{
              padding: "15px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "left"
            }}>
              📈 View All Results
            </button>
            <button style={{
              padding: "15px",
              backgroundColor: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "left"
            }}>
              ⚙️ Profile Settings
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        marginTop: "20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <h3 style={{ marginTop: 0, color: "#333" }}>📈 Your Stats</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745" }}>12</div>
            <div style={{ color: "#666" }}>Tests Completed</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#007bff" }}>87%</div>
            <div style={{ color: "#666" }}>Average Score</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#17a2b8" }}>24h</div>
            <div style={{ color: "#666" }}>Total Time</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ffc107" }}>3</div>
            <div style={{ color: "#666" }}>Pending Tests</div>
          </div>
        </div>
      </div>
    </div>
  )
}
