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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { IconLoader, IconMail, IconBrandGoogle, IconSearch, IconCopy, IconClipboardCheck, IconExternalLink } from "@tabler/icons-react"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

interface TakedownRequest {
    id: string
    infringingUrl: string
    userProfileId: string
    sourceQuery: string
    // Nuevos campos para rastrear el estado de las acciones
    emailSentAt?: string | null;
    googleSubmittedAt?: string | null;
}

interface Profile {
    id: string;
    creatorName: string;
    dmcaInfo?: {
        fullName: string;
        contactEmail: string;
        country: string;
        workDescription: string;
        signature: string;
    }
}

interface GoogleFormData {
    firstName: string;
    lastName: string;
    companyName: string;
    contactEmail: string;
    country: string;
    infringingUrls: string;
    workDescription: string;
    authorizedExampleUrls: string;
    infringementDescription: string;
    signature: string;
}

interface GoogleFormResponse {
    formFields: GoogleFormData;
    manualSteps: string[];
}

interface TakedownApprovalModalProps {
    isOpen: boolean
    onOpenChange: (isOpen: boolean) => void
    request: TakedownRequest | null
    profile: Profile | null
    onSuccess: (requestId: string) => void
}

export function TakedownApprovalModal({
    isOpen,
    onOpenChange,
    request,
    profile,
    onSuccess,
}: TakedownApprovalModalProps) {
    const [activeTab, setActiveTab] = React.useState("email")
    const [scrapedEmail, setScrapedEmail] = React.useState("")
    const [emailBody, setEmailBody] = React.useState("")
    const [emailSubject, setEmailSubject] = React.useState("")
    const [isProcessing, setIsProcessing] = React.useState(false)
    const [isLoadingTabData, setIsLoadingTabData] = React.useState(false)
    const [isFindingEmail, setIsFindingEmail] = React.useState(false)
    const [googleFormData, setGoogleFormData] = React.useState<GoogleFormData | null>(null)
    const [googleManualSteps, setGoogleManualSteps] = React.useState<string[]>([])

    // Simula la obtención de datos cuando se abre el modal o cambia la pestaña
    React.useEffect(() => { // Resetear estados al abrir para evitar mostrar datos viejos
        if (isOpen && request) {
            const fetchDataForTab = async () => {
                setIsLoadingTabData(true)
                if (activeTab === "email") {
                    // Simulación de scraping de email
                    try { // Llamada a la nueva API para previsualizar el email
                        const response = await apiFetch(`/api/takedowns/${request.id}/preview-email`);
                        const result = await response.json();

                        if (!response.ok) {
                            throw new Error(result.message || "Error al generar la vista previa del email.");
                        }

                        const { to, subject, body, signature } = result.data;
                        setScrapedEmail(to || "No se pudo encontrar un email.");
                        setEmailSubject(subject || "");
                        setEmailBody(`${body}\n\n${signature}`);

                    } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Error al cargar datos del email.");
                        setScrapedEmail("Error al cargar.")
                    }
                } else if (activeTab === "google") {
                    try {
                        // Llamada a la API para previsualizar los datos del formulario de Google
                        const response = await apiFetch(`/api/takedowns/${request.id}/preview-google-form`);
                        const result = await response.json();
                        if (!response.ok) {
                            throw new Error(result.message || "Error al generar datos para Google.");
                        }
                        const { formFields, manualSteps } = result.data as GoogleFormResponse;
                        setGoogleFormData(formFields);
                        setGoogleManualSteps(manualSteps);
                    } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Error al cargar datos para Google.");
                    }
                }
                setIsLoadingTabData(false)
            }
            fetchDataForTab()
        }
        // Limpiar datos cuando el modal se cierra
        if (!isOpen) {
            setGoogleFormData(null);
        }
    }, [isOpen, request, activeTab, profile])

    const handleFindEmail = async () => {
        if (!request) return;

        setIsFindingEmail(true);
        toast.info("Buscando correo de contacto en la página...");
        try {
            const response = await apiFetch(`/api/takedowns/${request.id}/find-email`, {
                method: 'POST',
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "No se pudo encontrar un correo.");
            }

            setScrapedEmail(result.request.infringingSiteContact);
            toast.success(result.message);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error al buscar el correo.");
        } finally {
            setIsFindingEmail(false);
        }
    };

    const handleAction = async (actionType: 'email' | 'google') => {
        if (!request) return;

        setIsProcessing(true);
        try {
            if (actionType === 'email') {
                const [body, ...signatureParts] = emailBody.split(/\n\nAtentamente,\n/);
                const signature = signatureParts.join('\n\nAtentamente,\n');

                const response = await apiFetch(`/api/takedowns/${request.id}/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: scrapedEmail,
                        subject: emailSubject,
                        body,
                        signature,
                    }),
                });

                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message || "Fallo al enviar el correo.");
                }
                toast.success(result.message);
                onSuccess(request.id); // Notifica a la página para que recargue los datos

            } else if (actionType === 'google') {
                const response = await apiFetch(`/api/takedowns/${request.id}/submit-google-form`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ formFields: googleFormData }),
                });
                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        throw new Error(errorData.message || "Fallo al iniciar el proceso para Google.");
                    } catch (jsonError) {
                        throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
                    }
                }
                const result = await response.json();
                toast.success(result.message || `Proceso de retiro para Google iniciado.`);
                onSuccess(request.id); // Notifica a la página para que recargue los datos
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsProcessing(false);
        }
    };

    // Componente auxiliar para los campos con botón de copiar
    const CopyableField = ({ label, value, isTextarea = false }: { label: string, value: string, isTextarea?: boolean }) => {
        const [copied, setCopied] = React.useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success(`"${label}" copiado al portapapeles.`);
            setTimeout(() => setCopied(false), 2000);
        };

        const InputComponent = isTextarea ? Textarea : Input;

        return (
            <div className="grid grid-cols-4 items-start gap-2">
                <Label className="text-right text-muted-foreground pt-2">{label}</Label>
                <div className="col-span-3 flex items-start gap-2">
                    <InputComponent readOnly value={value} className="flex-1" rows={isTextarea ? 4 : undefined} />
                    <Button variant="outline" size="icon" onClick={handleCopy}>{copied ? <IconClipboardCheck className="size-4 text-green-500" /> : <IconCopy className="size-4" />}</Button>
                </div>
            </div>
        );
    };

    if (!request || !profile) return null

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Aprobar Solicitud de Retiro</DialogTitle>
                    <DialogDescription>
                        Selecciona el método para procesar el reclamo para <span className="font-semibold">{profile.creatorName}</span>.
                    </DialogDescription>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email">
                            <IconMail className="mr-2 size-4" />
                            Reclamo por Email
                        </TabsTrigger>
                        <TabsTrigger value="google">
                            <IconBrandGoogle className="mr-2 size-4" />
                            Formulario Google
                        </TabsTrigger>
                    </TabsList>
                    <div className="relative mt-4 min-h-[350px] max-h-[55vh] overflow-y-auto pr-6">
                        {isLoadingTabData ? (
                            <div className="flex h-full items-center justify-center">
                                <IconLoader className="animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <>
                                <TabsContent value="email">
                                    <div className="space-y-4">
                                        <p className="text-sm text-muted-foreground">
                                            Se enviará un correo al contacto del sitio infractor. Puedes editar los detalles antes de enviar.
                                        </p>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email-contact">Email de Contacto (detectado)</Label>
                                            <div className="flex items-center gap-2">
                                                <Input id="email-contact" value={scrapedEmail} onChange={(e) => setScrapedEmail(e.target.value)} className="flex-1" />
                                                <Button variant="outline" size="icon" onClick={handleFindEmail} disabled={isFindingEmail}>
                                                    {isFindingEmail
                                                        ? <IconLoader className="size-4 animate-spin" />
                                                        : <IconSearch className="size-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email-subject">Asunto del Mensaje</Label>
                                            <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email-body">Cuerpo del Mensaje (generado por IA)</Label>
                                            <Textarea id="email-body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={10} />
                                        </div>
                                        <Button onClick={() => handleAction('email')} disabled={isProcessing || !!request.emailSentAt}>
                                            {isProcessing && <IconLoader className="mr-2 size-4 animate-spin" />}
                                            {request.emailSentAt
                                                ? `Email Enviado (${new Date(request.emailSentAt).toLocaleString()})`
                                                : 'Enviar Email de Reclamo'
                                            }
                                        </Button>
                                        {request.emailSentAt && (
                                            <p className="text-xs text-green-600">
                                                Esta acción ya fue completada.
                                            </p>
                                        )}
                                    </div>
                                </TabsContent>
                                <TabsContent value="google">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-4 rounded-lg border bg-muted/50 p-4">
                                            <p className="text-sm text-muted-foreground">
                                                Usa los botones de copiado para rellenar manualmente el formulario oficial de Google.
                                            </p>
                                            <Button asChild variant="outline" size="sm" className="shrink-0">
                                                <a href="https://reportcontent.google.com/forms/dmca_search" target="_blank" rel="noopener noreferrer">
                                                    Abrir Formulario
                                                    <IconExternalLink className="ml-2 size-4" />
                                                </a>
                                            </Button>
                                        </div>

                                        {googleFormData ? (
                                            <div className="space-y-4">
                                                <div className="grid gap-3 rounded-md border p-4">
                                                    <CopyableField label="Nombre" value={googleFormData.firstName} />
                                                    <CopyableField label="Apellidos" value={googleFormData.lastName} />
                                                    <CopyableField label="Email Contacto" value={googleFormData.contactEmail} />
                                                    <CopyableField label="País" value={googleFormData.country} />
                                                    <CopyableField label="URL Infractora" value={googleFormData.infringingUrls} />
                                                    <CopyableField label="URLs Autorizadas" value={googleFormData.authorizedExampleUrls} isTextarea />
                                                    <CopyableField label="Descripción Obra" value={googleFormData.workDescription} isTextarea />
                                                    <CopyableField label="Descripción Infracción" value={googleFormData.infringementDescription} isTextarea />
                                                    <CopyableField label="Firma" value={googleFormData.signature} />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium mb-2">Pasos Manuales Adicionales:</h4>
                                                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                                        {googleManualSteps.map((step, i) => <li key={i}>{step}</li>)}
                                                    </ul>
                                                </div>
                                                <Button onClick={() => handleAction('google')} disabled={isProcessing || !!request.googleSubmittedAt}>
                                                    {isProcessing && <IconLoader className="mr-2 size-4 animate-spin" />}
                                                    {request.googleSubmittedAt
                                                        ? `Enviado a Google (${new Date(request.googleSubmittedAt).toLocaleString()})`
                                                        : 'Marcar como Enviado a Google'
                                                    }
                                                </Button>
                                                {request.googleSubmittedAt && (
                                                    <p className="text-xs text-green-600">Esta acción ya fue completada.</p>
                                                )}
                                            </div>
                                        ) : <p className="text-sm text-muted-foreground text-center">Cargando datos del formulario...</p>}
                                    </div>
                                </TabsContent>
                            </>
                        )}
                    </div>
                </Tabs>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cerrar</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}