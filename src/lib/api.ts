"use client"

/**
 * Wrapper para la API fetch que añade automáticamente el token de autenticación
 * y maneja errores comunes como la desautorización (401).
 *
 * @param url      La URL del endpoint de la API.
 * @param options  Las opciones de la petición fetch.
 * @param tokenType
 *   - 'auto'    (default) — prioriza creator_token; si no existe usa authToken.
 *                           Correcto para rutas de creador y rutas compartidas.
 *   - 'admin'  — fuerza el uso de authToken, ignorando creator_token.
 *                           Úsalo en TODAS las llamadas a /api/admin/*.
 *   - 'creator' — fuerza el uso de creator_token únicamente.
 */
export const apiFetch = async (
    url: string,
    options: RequestInit = {},
    tokenType: 'auto' | 'admin' | 'creator' = 'auto'
): Promise<Response> => {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

    const fullUrl = `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;

    const creatorToken = typeof window !== "undefined" ? localStorage.getItem("creator_token") : null;
    const adminToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    let token: string | null;
    if (tokenType === 'admin') {
        // Rutas /api/admin/* — siempre usar el token de administrador.
        // Esto evita que un creator_token residual en localStorage provoque un 401.
        token = adminToken;
    } else if (tokenType === 'creator') {
        token = creatorToken;
    } else {
        // 'auto': compatibilidad con el código anterior.
        token = creatorToken || adminToken;
    }

    const headers = new Headers(options.headers || {})

    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(fullUrl, { ...options, headers, credentials: 'include' })

    if (response.status === 401) {
        throw new Error("No autorizado o sesión expirada.");
    }

    return response
}
