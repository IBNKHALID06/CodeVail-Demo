"use client"

interface LoginCredentials {
  email: string
  password: string
  role: "candidate" | "interviewer"
}

interface User {
  id: string
  name: string
  email: string
  role: "candidate" | "interviewer"
  avatar?: string
  token: string
}

interface AuthResponse {
  success: boolean
  user?: User
  message?: string
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.codevail.com"

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock authentication - in production, this would be a real API call
      try {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })

        if (response.ok) {
          const data = await response.json()
          return data
        }
      } catch (error) {
        // API not available, use mock authentication
        console.log("API not available, using mock authentication")
      }

      // For demo purposes, accept any email/password combination
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: this.generateNameFromEmail(credentials.email),
          email: credentials.email,
          role: credentials.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
          token: this.generateMockToken(),
        }

        return {
          success: true,
          user: mockUser,
        }
      }

      return {
        success: false,
        message: "Invalid credentials",
      }
    } catch (error) {
      console.error("Login error:", error)

      // Fallback for demo - accept any credentials
      if (credentials.email && credentials.password) {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: this.generateNameFromEmail(credentials.email),
          email: credentials.email,
          role: credentials.role,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.email}`,
          token: this.generateMockToken(),
        }

        return {
          success: true,
          user: mockUser,
        }
      }

      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  async register(userData: LoginCredentials & { name: string }): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        return {
          success: false,
          message: "Registration failed",
        }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: "Network error. Please try again.",
      }
    }
  }

  async logout(): Promise<void> {
    try {
      const token = this.getStoredToken()
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      this.clearStoredAuth()
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    try {
      const token = this.getStoredToken()
      if (!token) {
        return { success: false, message: "No token found" }
      }

      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { success: false, message: "Token refresh failed" }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Token refresh error:", error)
      return { success: false, message: "Network error" }
    }
  }

  async validateToken(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/validate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return { success: false, message: "Invalid token" }
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("Token validation error:", error)
      return { success: false, message: "Network error" }
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

  private generateMockToken(): string {
    return btoa(
      JSON.stringify({
        iat: Date.now(),
        exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        sub: Math.random().toString(36).substr(2, 9),
      }),
    )
  }

  private getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  private clearStoredAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
    }
  }

  storeAuth(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem("auth_token", user.token)
      localStorage.setItem("user", JSON.stringify(user))
    }
  }

  getStoredUser(): User | null {
    try {
      if (typeof window !== 'undefined') {
        const userStr = localStorage.getItem("user")
        return userStr ? JSON.parse(userStr) : null
      }
      return null
    } catch (error) {
      console.error("Error parsing stored user:", error)
      return null
    }
  }
}

export const authService = new AuthService()
export type { LoginCredentials, User, AuthResponse }
