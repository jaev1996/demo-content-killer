'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useCreatorAuth } from '@/contexts/creator-auth-context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconCheck, IconAlertCircle, IconArrowRight } from "@tabler/icons-react";

const STRIPE_PRICE_IDS = {
    PRO: 'price_1SWoyB2zbUB6qmZWA16KQSE0',
    BASIC: 'price_1SVhGO2zbUB6qmZWnfYx4ZiH'
};

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const { updateCreatorProfile } = useCreatorAuth();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verificando tu pago...');
    const [subscriptionDetails, setSubscriptionDetails] = useState<{
        plan: string;
        periodEnd: string;
        status: string;
    } | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setStatus('error');
            setMessage('No se encontró ID de sesión.');
            return;
        }

        // Lógica de MOCK para previsualización
        if (sessionId === 'mock') {
            // Simular retardo para ver el estado de carga
            setTimeout(() => {
                setSubscriptionDetails({
                    plan: 'Plan Pro (Vista Previa)',
                    periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
                    status: 'Activo'
                });
                setStatus('success');
            }, 1000);
            return;
        }

        if (sessionId === 'mock_error') {
            setTimeout(() => {
                setStatus('error');
                setMessage('Error simulado para fines de prueba y diseño.');
            }, 1000);
            return;
        }

        const verifyPayment = async () => {
            try {
                const response = await apiFetch('/api/stripe/verify-payment', {
                    method: 'POST',
                    body: JSON.stringify({ sessionId }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Suscripción verificada', data);

                    // Actualizar el contexto del usuario
                    updateCreatorProfile(data);

                    // Determinar el nombre del plan
                    let planName = 'Desconocido';
                    if (data.stripePriceId === STRIPE_PRICE_IDS.PRO) planName = 'Plan Pro';
                    else if (data.stripePriceId === STRIPE_PRICE_IDS.BASIC) planName = 'Plan Basic';

                    setSubscriptionDetails({
                        plan: planName,
                        periodEnd: new Date(data.stripeCurrentPeriodEnd).toLocaleDateString(),
                        status: 'Activo' // Asumimos activo si la verificación fue exitosa
                    });
                    setStatus('success');
                } else {
                    setStatus('error');
                    setMessage('Error al verificar la suscripción. Por favor contacta a soporte.');
                }
            } catch (error) {
                console.error(error);
                setStatus('error');
                setMessage('Ocurrió un error al procesar la verificación.');
            }
        };

        verifyPayment();
    }, [sessionId, updateCreatorProfile]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-lg border-muted">
                {status === 'loading' && (
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-lg font-medium text-foreground">Procesando tu pago...</p>
                        <p className="text-sm text-muted-foreground mt-2">{message}</p>
                    </CardContent>
                )}

                {status === 'success' && (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-green-100 dark:bg-green-900/20 p-3 rounded-full w-fit mb-4">
                                <IconCheck className="w-8 h-8 text-green-600 dark:text-green-500" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">¡Suscripción Exitosa!</CardTitle>
                            <CardDescription className="text-muted-foreground mt-2">
                                Tu pago ha sido procesado correctamente y tu cuenta ha sido actualizada.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-6">
                            {subscriptionDetails && (
                                <div className="bg-muted/50 p-4 rounded-lg border border-border space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Plan:</span>
                                        <span className="font-semibold text-foreground">{subscriptionDetails.plan}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Estado:</span>
                                        <span className="font-medium text-green-600 dark:text-green-500 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full text-xs">
                                            {subscriptionDetails.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-muted-foreground">Próxima facturación:</span>
                                        <span className="font-medium text-foreground">{subscriptionDetails.periodEnd}</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link href="/creator/dashboard" className="w-full">
                                <Button className="w-full" size="lg">
                                    Ir al Dashboard
                                    <IconArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </CardFooter>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-fit mb-4">
                                <IconAlertCircle className="w-8 h-8 text-red-600 dark:text-red-500" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-foreground">Algo salió mal</CardTitle>
                            <CardDescription className="text-red-500 mt-2 font-medium">
                                {message}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pb-6">
                            <p className="text-sm text-muted-foreground">
                                Si el problema persiste, por favor contacta a nuestro equipo de soporte.
                            </p>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <Link href="/creator/dashboard" className="w-full">
                                <Button variant="secondary" className="w-full">
                                    Volver al Dashboard
                                </Button>
                            </Link>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function PaymentSuccess() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
