"use client"

import { apiFetch } from "@/lib/api"
import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster, toast } from "sonner"
import { IconLoader, IconSkull } from "@tabler/icons-react"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    // Si ya hay un token, redirigir directamente al panel.
    // Esto evita que un usuario logueado vea la página de login de nuevo.
    const token = localStorage.getItem("authToken")
    if (token) {
      router.replace("/dashboard")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Credenciales inválidas.")
      }

      const data = await response.json()
      console.log("Respuesta del servidor (login):", data) // Mostramos la respuesta completa

      const userData = data.user
      const token = userData.token // El token está DENTRO del objeto user

      // Guardamos el token en localStorage para persistir la sesión.
      localStorage.setItem("authToken", token)
      toast.success(`Bienvenido, ${userData.fullName}!`)

      // Redirigir al dashboard después de un breve retraso
      setTimeout(() => {
        router.push("/dashboard")
      }, 1000)

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ocurrió un error.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Toaster richColors />
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <IconSkull className="size-10" />
          </div>
          <CardTitle className="text-2xl">Demo Content Killer</CardTitle>
          <CardDescription>Ingresa tus credenciales para acceder al panel.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="User" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading && <IconLoader className="mr-2 size-4 animate-spin" />}
              {loading ? "Ingresando..." : "Iniciar Sesión"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
