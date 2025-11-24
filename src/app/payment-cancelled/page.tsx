'use client';

import Link from 'next/link';

export default function PaymentCancelled() {
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 className="text-2xl font-bold mb-4">Pago Cancelado</h1>
            <p className="mb-8">Has cancelado el proceso de suscripción.</p>
            <Link href="/creator/dashboard/subscription">
                <button className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 rounded-md">Volver a Suscripciones</button>
            </Link>
        </div>
    );
}
