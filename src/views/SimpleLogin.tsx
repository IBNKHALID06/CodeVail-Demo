"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SimpleLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleLogin = () => {
    console.log("Simple login attempt:", { email, password, role })

    // Clear any previous messages
    setMessage("")

    if (!role) {
      setMessage("Please select a role")
      return
    }

    if (!email || !password) {
      setMessage("Please enter email and password")
      return
    }

    // Simple authentication check
    const isValidCandidate = role === "candidate" && 
                            email === "candidate@codevail.com" && 
                            password === "password123"

    const isValidInterviewer = role === "interviewer" && 
                              email === "admin@codevail.com" && 
                              password === "Admin123"

    if (isValidCandidate || isValidInterviewer) {
      // Save to localStorage for persistence
      const user = {
        id: role === "candidate" ? "1" : "2",
        email: email,
        role: role,
        name: role === "candidate" ? "Test Candidate" : "Test Interviewer"
      }
      
      localStorage.setItem("simpleAuth", JSON.stringify(user))
      console.log("Login successful, saved user:", user)
      setMessage("Login successful! Redirecting...")

      // Redirect to appropriate dashboard
      setTimeout(() => {
        if (role === "candidate") {
          router.push("/candidate-dashboard")
        } else {
          router.push("/interviewer-dashboard")
        }
      }, 1000)

    } else {
      setMessage("Invalid credentials. Try: candidate@codevail.com / password123 or admin@codevail.com / Admin123")
    }
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>
          CodeVail Login
        </h1>

        {/* Role Selection */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Select Role:
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => setRole("candidate")}
              style={{
                padding: "10px 20px",
                border: "2px solid",
                borderColor: role === "candidate" ? "#007bff" : "#ddd",
                backgroundColor: role === "candidate" ? "#007bff" : "white",
                color: role === "candidate" ? "white" : "#333",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1
              }}
            >
              Candidate
            </button>
            <button
              onClick={() => setRole("interviewer")}
              style={{
                padding: "10px 20px",
                border: "2px solid",
                borderColor: role === "interviewer" ? "#28a745" : "#ddd",
                backgroundColor: role === "interviewer" ? "#28a745" : "white",
                color: role === "interviewer" ? "white" : "#333",
                borderRadius: "5px",
                cursor: "pointer",
                flex: 1
              }}
            >
              Interviewer
            </button>
          </div>
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              fontSize: "16px",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "18px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "20px"
          }}
        >
          LOGIN
        </button>

        {/* Demo Credentials */}
        <div style={{ 
          backgroundColor: "#f8f9fa", 
          padding: "15px", 
          borderRadius: "5px",
          marginBottom: "20px",
          fontSize: "14px"
        }}>
          <strong>Demo Credentials:</strong><br/>
          <strong>Candidate:</strong> candidate@codevail.com / password123<br/>
          <strong>Interviewer:</strong> admin@codevail.com / Admin123
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: message.includes("successful") ? "#d4edda" : "#f8d7da",
            color: message.includes("successful") ? "#155724" : "#721c24",
            border: "1px solid",
            borderColor: message.includes("successful") ? "#c3e6cb" : "#f5c6cb",
            textAlign: "center"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
