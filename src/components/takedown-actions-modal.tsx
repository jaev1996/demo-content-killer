"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { IconLoader, IconMail, IconBrandGoogle, IconAlertTriangle } from "@tabler/icons-react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

interface TakedownAction {
    id: string;
    type: 'EMAIL' | 'GOOGLE_FORM';
    content: Record<string, unknown>;
    createdAt: string;
}

interface TakedownActionsModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    takedownId: string | null;
}

export function TakedownActionsModal({ isOpen, onOpenChange, takedownId }: TakedownActionsModalProps) {
    const [actions, setActions] = React.useState<TakedownAction[]>([]);
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isOpen && takedownId) {
            const fetchActions = async () => {
                setLoading(true);
                setActions([]); // Limpiar acciones anteriores
                try { // Usar la URL relativa, apiFetch se encargará de la base
                    const response = await apiFetch(`/api/takedowns/${takedownId}/actions`);
                    const result = await response.json();
                    if (!response.ok) {
                        throw new Error(result.message || "Error al cargar las acciones.");
                    }
                    setActions(result.data || []);
                } catch (err) {
                    toast.error(err instanceof Error ? err.message : "Error desconocido.");
                } finally {
                    setLoading(false);
                }
            };
            fetchActions();
        }
    }, [isOpen, takedownId]);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Historial de Acciones del Reclamo</DialogTitle>
                    <DialogDescription>
                        Detalles de las acciones ejecutadas para este reclamo.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1 pr-4 space-y-4">
                    {loading && <div className="flex justify-center p-8"><IconLoader className="animate-spin" /></div>}
                    {!loading && actions.length === 0 && (
                        <div className="text-center text-muted-foreground p-8">
                            <IconAlertTriangle className="mx-auto mb-2" />
                            No se encontraron acciones registradas para este reclamo.
                        </div>
                    )}
                    {!loading && actions.map(action => (
                        <Card key={action.id}>
                            <CardHeader className="flex-row items-center justify-between pb-2">
                                <CardTitle className="text-base font-medium flex items-center">
                                    {action.type === 'EMAIL' ? <IconMail className="mr-2" /> : <IconBrandGoogle className="mr-2" />}
                                    Acción: {action.type === 'GOOGLE_FORM' ? 'Google Form' : action.type}
                                </CardTitle>
                                <Badge variant="outline">{new Date(action.createdAt).toLocaleString()}</Badge>
                            </CardHeader>
                            <CardContent>
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3 text-sm">
                                    {Object.entries(action.content).map(([key, value]) => (
                                        <React.Fragment key={key}>
                                            <dt className="font-medium text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}:</dt>
                                            <dd className="sm:col-span-2 break-words whitespace-pre-wrap">{String(value)}</dd>
                                        </React.Fragment>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
