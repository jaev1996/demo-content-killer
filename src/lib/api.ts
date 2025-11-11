"use client"

/**
 * Wrapper para la API fetch que añade automáticamente el token de autenticación
 * y maneja errores comunes como la desautorización (401).
 * @param url La URL del endpoint de la API.
 * @param options Las opciones de la petición fetch.
 * @returns Una promesa que se resuelve con la respuesta de la API.
 */
export const apiFetch = async (
    url: string,
    options: RequestInit = {}
): Promise<Response> => {

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

    const fullUrl = `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`; // Asegurarse de que la URL tenga una barra inicial si no la tiene

    // Priorizamos el token del creador, si no, usamos el del admin.
    // Esto permite que ambos sistemas de autenticación coexistan.
    const creatorToken = typeof window !== "undefined" ? localStorage.getItem("creator_token") : null;
    const adminToken = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    const token = creatorToken || adminToken;

    // Clona las cabeceras existentes o crea unas nuevas
    const headers = new Headers(options.headers || {})

    // Añade el token de autorización si existe
    if (token) {
        headers.append("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(fullUrl, { ...options, headers })

    if (response.status === 401) {
        // Si el token es inválido, el contexto correspondiente se encargará de la redirección.
        // Aquí solo lanzamos el error para que el contexto lo capture.
        // No eliminamos tokens ni redirigimos desde aquí para evitar conflictos.
        throw new Error("No autorizado o sesión expirada.");
    }

    return response
}
