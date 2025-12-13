'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { IconX, IconArrowLeft } from "@tabler/icons-react";

export default function PaymentCancelled() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-lg border-muted">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto bg-red-100 dark:bg-red-900/20 p-3 rounded-full w-fit mb-4">
                        <IconX className="w-8 h-8 text-red-600 dark:text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground">Pago Cancelado</CardTitle>
                    <CardDescription className="text-muted-foreground mt-2">
                        El proceso de suscripción no se ha completado. No se ha realizado ningún cargo a tu cuenta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center pb-6">
                    <p className="text-sm text-muted-foreground">
                        Si tuviste algún problema durante el pago o cambiaste de opinión, puedes intentarlo de nuevo cuando quieras.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <Link href="/creator/dashboard/subscription" className="w-full sm:w-auto">
                        <Button variant="default" className="w-full">
                            Intentar nuevamente
                        </Button>
                    </Link>
                    <Link href="/creator/dashboard" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full">
                            <IconArrowLeft className="w-4 h-4 mr-2" />
                            Volver al Dashboard
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
