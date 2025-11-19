// src/contexts/creator-auth-context.tsx
"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { apiFetch } from '@/lib/api';


// Recuerdame luego colocar esto en un archivo de tipos, por ejemplo: src/types/index.ts

export interface UserProfile {
    id: string;
    creatorName: string;
    email: string;
    whitelist: string[];

    // Información de DMCA (puede ser null si el usuario no la ha completado)
    dmcaFullName: string | null;
    dmcaContactEmail: string | null;
    dmcaCountry: string | null;
    dmcaWorkDescription: string | null;
    dmcaSignature: string | null;

    // Configuración del perfil
    autoFilter: boolean;
    strictMode: boolean;

    // Campos de suscripción de Stripe (pueden ser null si no está suscrito)
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
    stripePriceId: string | null;
    stripeCurrentPeriodEnd: string | null; // El backend envía esto como un string en formato ISO 8601

    // Timestamps
    createdAt: string; // También es un string en formato ISO 8601
    updatedAt: string; // También es un string en formato ISO 8601
}


interface CreatorAuthContextType {
    creator: UserProfile | null;
    token: string | null;
    login: (creatorData: UserProfile, token: string) => void;
    logout: () => void;
    updateCreatorProfile: (updatedProfile: Partial<UserProfile>) => void;
    isLoading: boolean;
}

const CreatorAuthContext = createContext<CreatorAuthContextType | undefined>(undefined);

export const CreatorAuthProvider = ({ children }: { children: ReactNode }) => {
    const [creator, setCreator] = useState<UserProfile | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        setCreator(null);
        setToken(null);
        localStorage.removeItem('creator_token');
        // Usamos replace para que el usuario no pueda volver atrás con el botón del navegador
        window.location.replace('/creators/login');
    }, []);

    useEffect(() => {
        const validateToken = async () => {
            const storedToken = localStorage.getItem('creator_token');
            if (storedToken) {
                try {
                    // Hacemos una llamada a un endpoint protegido para obtener los datos del creador
                    // 1. Corregimos la URL al endpoint correcto.
                    // 2. Eliminamos la cabecera 'Authorization' manual, ya que apiFetch la añade automáticamente.
                    const response = await apiFetch('/api/auth/me');

                    if (!response.ok) throw new Error("Token inválido");

                    // El endpoint /me probablemente también devuelve el perfil dentro de un objeto 'data'
                    const data = await response.json();
                    setCreator(data.data);
                    setToken(storedToken);
                } catch (error) {
                    // Si el token es inválido o hay un error, limpiamos todo
                    console.error('Failed to validate creator token:', error);
                    // ¡CAMBIO TEMPORAL PARA DEPURAR!
                    // Comentamos la siguiente línea para evitar la redirección automática
                    // y poder ver el error en la consola.
                    logout();
                }
            }
            setIsLoading(false);
        };
        validateToken();
    }, [logout]);

    const login = (creatorData: UserProfile, token: string) => {
        setCreator(creatorData);
        setToken(token);
        localStorage.setItem('creator_token', token);
    };

    const updateCreatorProfile = (updatedProfile: Partial<UserProfile>) => {
        setCreator(prevCreator => {
            if (!prevCreator) return null;
            return { ...prevCreator, ...updatedProfile };
        });
    };

    return (
        <CreatorAuthContext.Provider value={{ creator, token, login, logout, updateCreatorProfile, isLoading }}>
            {children}
        </CreatorAuthContext.Provider>
    );
};

export const useCreatorAuth = () => {
    const context = useContext(CreatorAuthContext);
    if (context === undefined) {
        throw new Error('useCreatorAuth must be used within a CreatorAuthProvider');
    }
    return context;
};
