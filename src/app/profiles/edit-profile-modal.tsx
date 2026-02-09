"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { IconLoader, IconDeviceFloppy, IconHelpCircle } from "@tabler/icons-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

interface Profile {
    id: string;
    creatorName: string;
    socialMediaUser: string;
    whitelist: string[];
    status: "active" | "inactive";
    autoFilter?: boolean;
    strictMode?: boolean;
    dmcaFullName?: string;
    dmcaContactEmail?: string;
    dmcaCountry?: string;
    dmcaWorkDescription?: string;
    dmcaSignature?: string;
}

interface EditProfileModalProps {
    profile: Profile | null;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onProfileUpdate: () => void;
}

export function EditProfileModal({ profile, isOpen, onOpenChange, onProfileUpdate }: EditProfileModalProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [formData, setFormData] = React.useState<Partial<Profile>>({});

    console.log("1. [EditProfileModal] Profile prop recibido:", profile);

    React.useEffect(() => {
        if (isOpen && profile) {
            // Copia el perfil directamente para mantener la estructura. Los valores se manejarán en el JSX.
            setFormData(profile);
            console.log("2. [EditProfileModal] formData inicializado con:", profile);
        }
    }, [isOpen, profile]); // Dependencia de isOpen para re-inicializar al abrir

    const handleChange = (field: string, value: string) => {
        setFormData(prev => {
            // Como la estructura es plana, la actualización es más simple.
            return { ...prev, [field]: value };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setIsSubmitting(true);
        try {
            const response = await apiFetch(`/api/profiles/${profile.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.error || 'Error al actualizar el perfil.');
            }

            toast.success("Perfil actualizado exitosamente.");
            onProfileUpdate();
            onOpenChange(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Error desconocido");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!profile) return null;

    console.log("3. [EditProfileModal] formData actual antes de renderizar:", formData);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Editar Perfil de {profile.creatorName}</DialogTitle>
                    <DialogDescription>Modifica los detalles del perfil y la configuración de DMCA.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-creatorName" className="flex items-center gap-1">
                                Nombre de Artista / Nickname
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <IconHelpCircle className="size-4 text-muted-foreground cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>El nombre público o nickname por el cual es conocida la creadora en redes sociales.</p>
                                    </TooltipContent>
                                </Tooltip>
                            </Label>
                            <Input id="edit-creatorName" value={formData.creatorName || ''} onChange={e => handleChange('creatorName', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-dmcaFullName">Nombre Completo (DMCA)</Label>
                            <Input id="edit-dmcaFullName" value={formData.dmcaFullName || ''} onChange={e => handleChange('dmcaFullName', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-dmcaContactEmail">Email de Contacto (DMCA)</Label>
                            <Input id="edit-dmcaContactEmail" type="email" value={formData.dmcaContactEmail || ''} onChange={e => handleChange('dmcaContactEmail', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-dmcaCountry">País (DMCA)</Label>
                            <Select value={formData.dmcaCountry || 'US'} onValueChange={value => handleChange('dmcaCountry', value)}>
                                <SelectTrigger id="edit-dmcaCountry"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="US">Estados Unidos</SelectItem>
                                    <SelectItem value="ES">España</SelectItem>
                                    <SelectItem value="MX">México</SelectItem>
                                    <SelectItem value="CO">Colombia</SelectItem>
                                    <SelectItem value="AR">Argentina</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2 md:col-span-2">
                            <Label htmlFor="edit-dmcaWorkDescription">Descripción de la Obra (DMCA)</Label>
                            <Textarea id="edit-dmcaWorkDescription" value={formData.dmcaWorkDescription || ''} onChange={e => handleChange('dmcaWorkDescription', e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-dmcaSignature">Firma (DMCA)</Label>
                            <Input id="edit-dmcaSignature" value={formData.dmcaSignature || ''} onChange={e => handleChange('dmcaSignature', e.target.value)} />
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? <IconLoader className="mr-2 size-4 animate-spin" /> : <IconDeviceFloppy className="mr-2 size-4" />}
                        Guardar Cambios
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}