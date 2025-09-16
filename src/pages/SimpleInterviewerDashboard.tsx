"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSimpleAuth } from "../contexts/SimpleAuthContext"

export default function SimpleInterviewerDashboard() {
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
  if (user.role !== "interviewer") {
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
        <p>This dashboard is for interviewers only.</p>
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
          <h1 style={{ margin: 0, color: "#333" }}>Interviewer Dashboard</h1>
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
        {/* Create & Manage */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>🛠️ Create & Manage</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button style={{
              padding: "15px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "16px"
            }}>
              ➕ Create New Test
            </button>
            <button style={{
              padding: "15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "16px"
            }}>
              📋 Assign Test to Candidate
            </button>
            <button style={{
              padding: "15px",
              backgroundColor: "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "16px"
            }}>
              📹 Start Interview Session
            </button>
          </div>
        </div>

        {/* Active Tests */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>📝 Active Tests</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <strong>JavaScript Assessment</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                8 candidates assigned • 3 completed
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{
                  padding: "5px 10px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  View Results
                </button>
                <button style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffc107",
                  color: "black",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  Edit Test
                </button>
              </div>
            </div>
            <div style={{ padding: "15px", backgroundColor: "#f8f9fa", borderRadius: "5px" }}>
              <strong>React Development</strong>
              <p style={{ margin: "5px 0", color: "#666" }}>
                5 candidates assigned • 1 completed
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <button style={{
                  padding: "5px 10px",
                  backgroundColor: "#6c757d",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  View Results
                </button>
                <button style={{
                  padding: "5px 10px",
                  backgroundColor: "#ffc107",
                  color: "black",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                  fontSize: "12px"
                }}>
                  Edit Test
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ marginTop: 0, color: "#333" }}>📈 Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "10px", backgroundColor: "#e7f3ff", borderRadius: "5px", borderLeft: "4px solid #007bff" }}>
              <strong>John Doe</strong> completed JavaScript Assessment
              <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                Score: 92% • 2 hours ago
              </div>
            </div>
            <div style={{ padding: "10px", backgroundColor: "#fff3cd", borderRadius: "5px", borderLeft: "4px solid #ffc107" }}>
              <strong>Jane Smith</strong> started React Development test
              <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                In progress • 30 minutes ago
              </div>
            </div>
            <div style={{ padding: "10px", backgroundColor: "#d1ecf1", borderRadius: "5px", borderLeft: "4px solid #17a2b8" }}>
              <strong>Mike Johnson</strong> joined interview session
              <div style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
                Duration: 45 minutes • 1 day ago
              </div>
            </div>
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
        <h3 style={{ marginTop: 0, color: "#333" }}>📊 Overview Stats</h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#007bff" }}>24</div>
            <div style={{ color: "#666" }}>Total Candidates</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#28a745" }}>8</div>
            <div style={{ color: "#666" }}>Active Tests</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ffc107" }}>156</div>
            <div style={{ color: "#666" }}>Completed Tests</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#17a2b8" }}>78%</div>
            <div style={{ color: "#666" }}>Average Score</div>
          </div>
        </div>
      </div>
    </div>
  )
}
