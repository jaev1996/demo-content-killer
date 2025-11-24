'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 className="text-2xl font-bold mb-4">¡Suscripción Exitosa! 🎉</h1>
            <p className="mb-4">Tu ID de sesión es: {sessionId}</p>
            <p className="mb-8">Tu cuenta se actualizará en breve.</p>
            <Link href="/creator/dashboard">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">Ir al Dashboard</button>
            </Link>
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
