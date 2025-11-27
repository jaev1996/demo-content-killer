'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useCreatorAuth } from '@/contexts/creator-auth-context';

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
        <div style={{ textAlign: 'center', padding: '50px' }}>
            {status === 'loading' && (
                <div>
                    <h1 className="text-2xl font-bold mb-4">Procesando... ⏳</h1>
                    <p>{message}</p>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <h1 className="text-2xl font-bold mb-4 text-green-600">¡Suscripción Exitosa! 🎉</h1>
                    <p className="mb-4">Tu pago ha sido verificado correctamente.</p>

                    {subscriptionDetails && (
                        <div className="bg-gray-100 p-6 rounded-lg max-w-md mx-auto mb-8 text-left">
                            <h3 className="font-bold text-lg mb-4 border-b pb-2">Detalles de la Suscripción</h3>
                            <div className="space-y-2">
                                <p><span className="font-semibold">Plan:</span> {subscriptionDetails.plan}</p>
                                <p><span className="font-semibold">Estado:</span> <span className="text-green-600 font-medium">{subscriptionDetails.status}</span></p>
                                <p><span className="font-semibold">Próxima facturación:</span> {subscriptionDetails.periodEnd}</p>
                            </div>
                        </div>
                    )}

                    <p className="mb-8">Tu cuenta ha sido actualizada con las nuevas funciones.</p>
                    <Link href="/creator/dashboard">
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">Ir al Dashboard</button>
                    </Link>
                </div>
            )}

            {status === 'error' && (
                <div>
                    <h1 className="text-2xl font-bold mb-4 text-red-600">Algo salió mal 😕</h1>
                    <p className="mb-8 text-red-500">{message}</p>
                    <Link href="/creator/dashboard">
                        <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">Volver al Dashboard</button>
                    </Link>
                </div>
            )}
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
