"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { IconCheck } from "@tabler/icons-react"
import { useCreatorAuth } from "@/contexts/creator-auth-context"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"

// Importar los componentes de cada paso
import WelcomeStep from "@/components/onboarding/WelcomeStep"
import DMCAStep from "@/components/onboarding/DMCAStep"
import WhitelistStep from "@/components/onboarding/WhitelistStep"
import FinalStep from "@/components/onboarding/FinalStep"

const TOTAL_STEPS = 4

export default function OnboardingPage() {
    const router = useRouter()
    const { creator, updateCreatorProfile } = useCreatorAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [completedSteps, setCompletedSteps] = useState<number[]>([])

    // Estados para los datos del formulario
    const [dmcaData, setDmcaData] = useState({
        dmcaFullName: creator?.dmcaFullName || "",
        dmcaContactEmail: creator?.dmcaContactEmail || "",
        dmcaCountry: creator?.dmcaCountry || "",
        dmcaWorkDescription: creator?.dmcaWorkDescription || "",
        dmcaSignature: creator?.dmcaSignature || ""
    })

    const [whitelistData, setWhitelistData] = useState<string[]>(creator?.whitelist || [])

    const saveDMCAData = async () => {
        try {
            const payload = {
                dmcaFullName: dmcaData.dmcaFullName || null,
                dmcaContactEmail: dmcaData.dmcaContactEmail || null,
                dmcaCountry: dmcaData.dmcaCountry || null,
                dmcaWorkDescription: dmcaData.dmcaWorkDescription || null,
                dmcaSignature: dmcaData.dmcaSignature || null,
            }

            const response = await apiFetch("/api/auth/me/dmca", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || "Error al guardar datos DMCA")
            }

            const { data: updatedData } = await response.json()
            updateCreatorProfile(updatedData)
            toast.success("Datos DMCA guardados correctamente")
        } catch (error) {
            toast.error((error as Error).message)
            throw error
        }
    }

    const saveWhitelistData = async () => {
        try {
            // Obtener dominios existentes
            const existingDomains = creator?.whitelist || []

            // Agregar solo los nuevos dominios
            const newDomains = whitelistData.filter(d => !existingDomains.includes(d))

            for (const domain of newDomains) {
                const response = await apiFetch("/api/auth/me/whitelist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ domain }),
                })

                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Error al guardar whitelist")
                }

                const { data: updatedProfile } = await response.json()
                updateCreatorProfile(updatedProfile)
            }

            if (newDomains.length > 0) {
                toast.success("Whitelist guardada correctamente")
            }
        } catch (error) {
            toast.error((error as Error).message)
            throw error
        }
    }

    const handleNext = async () => {
        // Guardar datos si estamos en pasos específicos
        if (currentStep === 2 && dmcaData.dmcaFullName) {
            try {
                await saveDMCAData()
            } catch {
                return // No avanzar si hay error
            }
        }

        if (currentStep === 3 && whitelistData.length > 0) {
            try {
                await saveWhitelistData()
            } catch {
                return // No avanzar si hay error
            }
        }

        // Marcar el paso actual como completado
        if (!completedSteps.includes(currentStep)) {
            setCompletedSteps([...completedSteps, currentStep])
        }

        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSkip = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleFinish = async () => {
        try {
            // Guardar cualquier dato pendiente
            if (dmcaData.dmcaFullName && !completedSteps.includes(2)) {
                await saveDMCAData()
            }
            if (whitelistData.length > 0 && !completedSteps.includes(3)) {
                await saveWhitelistData()
            }

            toast.success("¡Perfil configurado exitosamente!")
            router.push("/creator/dashboard")
        } catch {
            toast.error("Error al finalizar la configuración")
        }
    }

    const progress = (completedSteps.length / TOTAL_STEPS) * 100

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <WelcomeStep creatorName={creator?.creatorName || "Creator"} onNext={handleNext} />
            case 2:
                return (
                    <DMCAStep
                        data={dmcaData}
                        onChange={setDmcaData}
                        onNext={handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                    />
                )
            case 3:
                return (
                    <WhitelistStep
                        data={whitelistData}
                        onChange={setWhitelistData}
                        onNext={handleNext}
                        onBack={handleBack}
                        onSkip={handleSkip}
                    />
                )
            case 4:
                return (
                    <FinalStep
                        dmcaComplete={dmcaData.dmcaFullName !== ""}
                        whitelistComplete={whitelistData.length > 0}
                        onFinish={handleFinish}
                        onBack={handleBack}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-3xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-sm font-medium text-muted-foreground">
                            Configuración Inicial
                        </h2>
                        <span className="text-sm font-medium text-muted-foreground">
                            Paso {currentStep} de {TOTAL_STEPS}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />

                    {/* Step Indicators */}
                    <div className="flex justify-between mt-4">
                        {[1, 2, 3, 4].map((step) => (
                            <div key={step} className="flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${completedSteps.includes(step)
                                        ? "bg-green-500 border-green-500 text-white"
                                        : currentStep === step
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-muted bg-background text-muted-foreground"
                                        }`}
                                >
                                    {completedSteps.includes(step) ? (
                                        <IconCheck className="w-5 h-5" />
                                    ) : (
                                        <span className="text-sm font-semibold">{step}</span>
                                    )}
                                </div>
                                <span className="text-xs text-muted-foreground hidden sm:block">
                                    {step === 1 && "Bienvenida"}
                                    {step === 2 && "DMCA"}
                                    {step === 3 && "Whitelist"}
                                    {step === 4 && "Finalizar"}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
