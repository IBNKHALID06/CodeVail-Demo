// Real API Service to connect with Python Flask backend
export interface User {
  id: string
  name: string
  email: string
  role: "candidate" | "interviewer" | "admin"
  avatar?: string
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
  role: "candidate" | "interviewer"
}

export interface AuthResponse {
  success?: boolean  // For fallback compatibility
  token?: string     // Actual backend response format
  user?: User
  message?: string
}

class ApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log("API Service - Login attempt:", credentials)
    
    try {
      const payload = {
        username: credentials.email,
        password: credentials.password,
        role: this.capitalizeRole(credentials.role)
      }
      
      console.log("API Service - Sending payload:", payload)
      console.log("API Service - URL:", `${this.baseUrl}/api/auth/login`)
      
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      console.log("API Service - Response status:", response.status)
      const data = await response.json()
      console.log("API Service - Response data:", data)

      if (response.ok) {
        console.log("API Service - Response OK, checking data structure...")
        console.log("API Service - data.success:", data.success)
        console.log("API Service - data.token:", data.token)
        console.log("API Service - data.user:", data.user)
        
        // Backend might not return 'success' field, check for token instead
        if (data.token && data.user) {
          console.log("API Service - Token and user found, creating user object...")
          const user: User = {
            id: data.user.id || Date.now().toString(),
            name: data.user.username || data.user.name || this.generateNameFromEmail(credentials.email),
            email: credentials.email,
            role: credentials.role,
            avatar: data.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
            token: data.token || data.user.token,
          }

          console.log("API Service - Created user object:", user)
          return {
            success: true,
            user,
          }
        }
      }

      return {
        success: false,
        message: data.error || data.message || "Login failed",
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: "Network error. Please check if the backend server is running.",
      }
    }
  }

  async register(userData: LoginCredentials & { name: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userData.email,
          password: userData.password,
          role: this.capitalizeRole(userData.role)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        return {
          success: true,
          message: data.message || "Registration successful",
        }
      }

      return {
        success: false,
        message: data.error || "Registration failed",
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  async validateToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/validate`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user,
        }
      }

      return {
        success: false,
        message: data.error || "Invalid token",
      }
    } catch (error) {
      console.error("Token validation error:", error)
      return {
        success: false,
        message: "Network error",
      }
    }
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok && data.success) {
        return {
          success: true,
          user: data.user,
        }
      }

      return {
        success: false,
        message: data.error || "Token refresh failed",
      }
    } catch (error) {
      console.error("Token refresh error:", error)
      return {
        success: false,
        message: "Network error",
      }
    }
  }

  private generateNameFromEmail(email: string): string {
    const username = email.split("@")[0]
    
    // Provide better default names for common demo emails
    const demoNames: { [key: string]: string } = {
      'interviewer': 'Sarah Miller',
      'candidate': 'Alex Johnson',
      'admin': 'Michael Admin',
      'test': 'Test User',
      'demo': 'Demo User'
    }
    
    if (demoNames[username.toLowerCase()]) {
      return demoNames[username.toLowerCase()]
    }
    
    // For other emails, format nicely
    return username.charAt(0).toUpperCase() + username.slice(1).replace(/[._-]/g, " ")
  }

  private capitalizeRole(role: string): string {
    return role.charAt(0).toUpperCase() + role.slice(1)
  }
}

export const apiService = new ApiService()
export default apiService
