"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

interface User {
    id: string
    username: string
    email: string
    fullName: string
    role: "super_admin" | "admin" | "viewer"
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (userData: User, token: string) => void
    logout: () => void
    isLoading: boolean
}

const AuthContext = React.createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = React.useState<User | null>(null)
    const [token, setToken] = React.useState<string | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)
    const router = useRouter()

    React.useEffect(() => {
        try {
            const storedToken = localStorage.getItem("authToken")
            const storedUserString = localStorage.getItem("user")
            if (storedToken && storedUserString) {
                setToken(storedToken)
                setUser(JSON.parse(storedUserString))
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error)
            localStorage.removeItem("authToken")
            localStorage.removeItem("user")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const login = (userData: User, token: string) => {
        localStorage.setItem("authToken", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setToken(token)
        setUser(userData)
        router.push("/dashboard")
    }

    const logout = () => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        setToken(null)
        setUser(null)
        router.push("/login")
    }

    const value = { user, token, login, logout, isLoading }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}