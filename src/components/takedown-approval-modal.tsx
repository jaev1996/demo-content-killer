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
    requests: TakedownRequest[]
    profile: Profile | null
    onSuccess: (requestIds: string[]) => void
}

export function TakedownApprovalModal({
    isOpen,
    onOpenChange,
    requests,
    profile,
    onSuccess,
}: TakedownApprovalModalProps) {
    const request = requests[0] || null; // Para compatibilidad con datos base como el primer ID
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
        if (isOpen && requests.length > 0) {
            const fetchDataForTab = async () => {
                setIsLoadingTabData(true)
                const mainRequest = requests[0];
                const allRequestIds = requests.map(r => r.id).join(',');

                if (activeTab === "email") {
                    try {
                        // Enviamos todos los IDs para que el backend sepa que es un lote
                        const response = await apiFetch(`/api/takedowns/${mainRequest.id}/preview-email?batch=${allRequestIds}`);
                        const result = await response.json();

                        if (!response.ok) {
                            throw new Error(result.message || "Error al generar la vista previa del email.");
                        }

                        const { to, subject, body, signature } = result.data;
                        setScrapedEmail(to || "No se pudo encontrar un email.");
                        setEmailSubject(subject || "");

                        // Si hay múltiples URLs y el backend no las incluyó, las añadimos nosotros
                        let finalBody = body;
                        if (requests.length > 1 && !body.includes(requests[1].infringingUrl)) {
                            const urlsList = requests.map(r => `- ${r.infringingUrl}`).join('\n');
                            finalBody = body.replace(/infringing URL[:\s]+[^\n]+/i, `infringing URLs:\n${urlsList}`);
                        }

                        setEmailBody(`${finalBody}\n\n${signature}`);

                    } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Error al cargar datos del email.");
                        setScrapedEmail("Error al cargar.")
                    }
                } else if (activeTab === "google") {
                    try {
                        const response = await apiFetch(`/api/takedowns/${mainRequest.id}/preview-google-form?batch=${allRequestIds}`);
                        const result = await response.json();
                        if (!response.ok) {
                            throw new Error(result.message || "Error al generar datos para Google.");
                        }
                        const { formFields, manualSteps } = result.data as GoogleFormResponse;

                        // Consolidar todas las URLs para el formulario
                        const consolidatedUrls = requests.map(r => r.infringingUrl).join('\n');

                        setGoogleFormData({
                            ...formFields,
                            infringingUrls: consolidatedUrls
                        });
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

        // Limpiar estados al cerrar para evitar mostrar datos viejos
        return () => {
            if (!isOpen) {
                setActiveTab("email");
                setScrapedEmail("");
                setEmailBody("");
                setEmailSubject("");
                setIsProcessing(false);
                setIsLoadingTabData(false);
                setGoogleFormData(null);
                setGoogleManualSteps([]);
            }
        };
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
        if (requests.length === 0) return;

        setIsProcessing(true);
        const allRequestIds = requests.map(r => r.id);

        try {
            if (actionType === 'email') {
                const [body, ...signatureParts] = emailBody.split(/\n\nAtentamente,\n/);
                const signature = signatureParts.join('\n\nAtentamente,\n');

                const response = await apiFetch(`/api/takedowns/batch/send-email`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ids: allRequestIds,
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
                onSuccess(allRequestIds);

            } else if (actionType === 'google') {
                const response = await apiFetch(`/api/takedowns/batch/submit-google-form`, {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ids: allRequestIds,
                        formFields: googleFormData
                    }),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Fallo al iniciar el proceso para Google.");
                }
                const result = await response.json();
                toast.success(result.message || `Proceso de retiro para Google iniciado.`);
                onSuccess(allRequestIds);
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setIsProcessing(false);
        }
    };

    const countryMap: { [key: string]: string } = {
        // 1. Hispanoamérica (Mayor probabilidad de coincidencia)
        "MX": "México",
        "CO": "Colombia",
        "AR": "Argentina",
        "CL": "Chile",
        "PE": "Perú",
        "EC": "Ecuador",
        "VE": "Venezuela",
        "DO": "República Dominicana",
        "CU": "Cuba",
        "GT": "Guatemala",
        "CR": "Costa Rica",
        "PR": "Puerto Rico",
        "PA": "Panamá",
        "SV": "El Salvador",
        "HN": "Honduras",
        "BO": "Bolivia",
        "PY": "Paraguay",
        "UY": "Uruguay",
        "NI": "Nicaragua",

        // 2. Norteamérica y Europa Occidental (Grandes mercados)
        "US": "Estados Unidos",
        "ES": "España",
        "CA": "Canadá",
        "GB": "Reino Unido",
        "FR": "Francia",
        "DE": "Alemania",
        "IT": "Italia",
        "NL": "Países Bajos",
        "PT": "Portugal",
        "BE": "Bélgica",
        "CH": "Suiza",
        "IE": "Irlanda",
        "AT": "Austria",
        "SE": "Suecia",
        "NO": "Noruega",
        "DK": "Dinamarca",
        "FI": "Finlandia",

        // 3. Europa Oriental y Rusia
        "RU": "Rusia",
        "PL": "Polonia",
        "UA": "Ucrania",
        "RO": "Rumanía",
        "CZ": "República Checa",
        "HU": "Hungría",
        "GR": "Grecia",
        "TR": "Turquía",
        "BG": "Bulgaria",
        "SK": "Eslovaquia",
        "HR": "Croacia",
        "RS": "Serbia",
        "LT": "Lituania",
        "LV": "Letonia",
        "EE": "Estonia",

        // 4. Asia y Oceanía
        "AU": "Australia",
        "NZ": "Nueva Zelanda",
        "JP": "Japón",
        "KR": "Corea del Sur",
        "CN": "China",
        "IN": "India",
        "PH": "Filipinas",
        "TH": "Tailandia",
        "MY": "Malasia",
        "ID": "Indonesia",
        "VN": "Vietnam",
        "SG": "Singapur",
        "TW": "Taiwán",
        "HK": "Hong Kong",

        // 5. África y Oriente Medio
        "ZA": "Sudáfrica",
        "NG": "Nigeria",
        "EG": "Egipto",
        "MA": "Marruecos",
        "DZ": "Argelia",
        "AE": "Emiratos Árabes Unidos",
        "SA": "Arabia Saudí",
        "IL": "Israel",
        "IQ": "Iraq",

        // 6. Brasil y otros importantes de Latam/Caribe
        "BR": "Brasil", // El más grande en Latam, aunque no hispanohablante
        "HT": "Haití",
        "JM": "Jamaica",
        "TT": "Trinidad y Tobago",

        // 7. Otros países europeos y del G20
        "PK": "Pakistán",
        "BD": "Bangladés",
        "MM": "Myanmar",
        "NP": "Nepal",
        "LK": "Sri Lanka",
        "IR": "Irán",
        "SY": "Siria",
        "LB": "Líbano",
        "JO": "Jordania",
        "KW": "Kuwait",
        "QA": "Catar",
        "OM": "Omán",
        "BH": "Baréin",
        "CY": "Chipre",
        "MT": "Malta"
        // El listado cubre más de 80 países clave para la creación global de contenido,
        // garantizando alta probabilidad de acierto.
    };

    const buildClaimJson = (): string => {
        if (!googleFormData) return "";

        const fullCountryName = countryMap[googleFormData.country] || googleFormData.country;

        const claimData = {
            "DMCA_AUTOFILL_DATA": true,
            "campos": {
                "nombre": googleFormData.firstName,
                "apellido": googleFormData.lastName,
                "nombreEmpresa": googleFormData.companyName,
                "descripcionObra": googleFormData.workDescription,
                "urlsOriginales": googleFormData.authorizedExampleUrls,
                "urlsInfractoras": googleFormData.infringingUrls,
                "firma": googleFormData.signature,
            },
            "selectores": {
                "nombre": "input[aria-label=\"Nombre\"]",
                "apellido": "input[aria-label=\"Apellido\"]",
                "nombreEmpresa": "input[aria-label=\"Nombre de la empresa\"]",
                "titularDerechos": "material-radio:has-text(\"Yo mismo\")",
                "paisRegion": "div[role=\"button\"]:has-text(\"Seleccionar país o región\")",
                "paisSeleccion": `material-select-dropdown-item:has-text("${fullCountryName}")`,
                "streamsNo": "material-radio:has-text(\"No\")",
                "descripcionObra": "textarea[aria-label=\"Introduce tu descripción aquí\"]",
                "urlsOriginales": "textarea[aria-label=\"Introduce tus ejemplos aquí\"]",
                "urlsInfractoras": "textarea[aria-label=\"Introduce tus URLs aquí\"]",
                "checkGoodFaith": "material-checkbox[aria-labelledby=\"mat-label-good-faith-belief\"]",
                "checkAccurateInfo": "material-checkbox[aria-labelledby=\"mat-label-accurate-information\"]",
                "checkLumen": "material-checkbox[aria-labelledby=\"mat-label-lumen-acknowledgement\"]",
                "checkCopyrightAck": "material-checkbox[aria-labelledby=\"mat-label-copyright-acknowledgement\"]",
                "fechaFirmaBtn": "div[aria-label=\"Fecha de la firma:* Elige una fecha\"]",
                "fechaHoy": "div.day-slot.today[role=\"gridcell\"]",
                "firmaInput": "input[aria-label=\"Firma\"]"
            }
        };
        return JSON.stringify(claimData, null, 2);
    };

    const handleDmcaClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const jsonToCopy = buildClaimJson();
        if (!jsonToCopy) {
            toast.error("No hay datos del formulario para copiar.");
            return;
        }

        try {
            await navigator.clipboard.writeText(jsonToCopy);
            window.open("https://reportcontent.google.com/forms/dmca_search", "_blank");
            toast.success("¡Datos copiados! Ahora, ve a la nueva pestaña y haz clic en el marcador 'Rellenar DMCA' para completar el envío.");
        } catch (err) {
            console.error("Error al copiar al portapapeles:", err);
            toast.error("No se pudo copiar al portapapeles. Por favor, inténtalo manualmente.");
        }
    };

    const handleGoogleFormChange = (field: keyof GoogleFormData, value: string) => {
        setGoogleFormData(prev => prev ? { ...prev, [field]: value } : null);
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
                    <DialogTitle>Aprobar Solicitud de Retiro ({requests.length} URLs)</DialogTitle>
                    <DialogDescription>
                        Selecciona el método para procesar el reclamo para <span className="font-semibold">{profile.creatorName}</span>.
                        {requests.length > 1 && ` Se enviará un único reclamo con todas las URLs seleccionadas.`}
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
                                        <Button onClick={() => handleAction('email')} disabled={isProcessing}>
                                            {isProcessing && <IconLoader className="mr-2 size-4 animate-spin" />}
                                            {requests.some(r => r.emailSentAt)
                                                ? 'Re-enviar Email de Reclamo (Ya hay enviados)'
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
                                                <div id="previewForm" className="grid gap-3 rounded-md border p-4">
                                                    <div className="grid grid-cols-4 items-center gap-2">
                                                        <Label htmlFor="g-firstName" className="text-right text-muted-foreground">Nombre</Label>
                                                        <Input id="g-firstName" value={googleFormData.firstName} onChange={e => handleGoogleFormChange('firstName', e.target.value)} className="col-span-3" />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-2">
                                                        <Label htmlFor="g-lastName" className="text-right text-muted-foreground">Apellidos</Label>
                                                        <Input id="g-lastName" value={googleFormData.lastName} onChange={e => handleGoogleFormChange('lastName', e.target.value)} className="col-span-3" />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-2">
                                                        <Label htmlFor="g-contactEmail" className="text-right text-muted-foreground">Email Contacto</Label>
                                                        <Input id="g-contactEmail" value={googleFormData.contactEmail} onChange={e => handleGoogleFormChange('contactEmail', e.target.value)} className="col-span-3" />
                                                    </div>
                                                    {/* País no es editable aquí, se usa el del perfil */}
                                                    <CopyableField label="País" value={`${googleFormData.country} (${countryMap[googleFormData.country] || 'N/A'})`} />
                                                    <div className="grid grid-cols-4 items-start gap-2">
                                                        <Label htmlFor="g-infringingUrls" className="text-right text-muted-foreground pt-2">URL Infractora</Label>
                                                        <Textarea id="g-infringingUrls" value={googleFormData.infringingUrls} onChange={e => handleGoogleFormChange('infringingUrls', e.target.value)} className="col-span-3" rows={2} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-start gap-2">
                                                        <Label htmlFor="g-authorizedExampleUrls" className="text-right text-muted-foreground pt-2">URLs Autorizadas</Label>
                                                        <Textarea id="g-authorizedExampleUrls" value={googleFormData.authorizedExampleUrls} onChange={e => handleGoogleFormChange('authorizedExampleUrls', e.target.value)} className="col-span-3" rows={3} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-start gap-2">
                                                        <Label htmlFor="g-workDescription" className="text-right text-muted-foreground pt-2">Descripción Obra</Label>
                                                        <Textarea id="g-workDescription" value={googleFormData.workDescription} onChange={e => handleGoogleFormChange('workDescription', e.target.value)} className="col-span-3" rows={3} />
                                                    </div>
                                                    <div className="grid grid-cols-4 items-center gap-2">
                                                        <Label htmlFor="g-signature" className="text-right text-muted-foreground">Firma</Label>
                                                        <Input id="g-signature" value={googleFormData.signature} onChange={e => handleGoogleFormChange('signature', e.target.value)} className="col-span-3" />
                                                    </div>
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
                                                <Button onClick={handleDmcaClick} variant="secondary">
                                                    <IconCopy className="mr-2 size-4" />
                                                    Copiar y Abrir Formulario DMCA
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