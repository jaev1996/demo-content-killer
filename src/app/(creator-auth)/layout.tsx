import { CreatorAuthProvider } from "@/contexts/creator-auth-context"
import React from "react"

export default function CreatorAuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <CreatorAuthProvider>{children}</CreatorAuthProvider>
}
