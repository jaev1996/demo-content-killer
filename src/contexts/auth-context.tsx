"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { IconSkull } from "@tabler/icons-react"

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
    updateUser: (newUserData: Partial<User>) => void
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
            const storedUser = localStorage.getItem("user")
            if (storedToken && storedUser) {
                setToken(storedToken)
                setUser(JSON.parse(storedUser))
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
        router.replace("/login") // Usar replace para una mejor experiencia de logout
    }

    const updateUser = (newUserData: Partial<User>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, ...newUserData };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    const value = { user, token, login, logout, updateUser, isLoading }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = React.useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
