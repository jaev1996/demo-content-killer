"use client"

import { IconBrandWhatsapp, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface WhatsAppButtonProps {
    phoneNumber: string
    message?: string
    showOnMobile?: boolean
}

export function WhatsAppButton({
    phoneNumber,
    message = "Hola! Necesito ayuda con PrivaClean",
    showOnMobile = true
}: WhatsAppButtonProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    const handleClick = () => {
        const encodedMessage = encodeURIComponent(message)
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
        window.open(whatsappUrl, '_blank')
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 ${!showOnMobile ? 'hidden sm:block' : ''}`}>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-xs border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex items-start justify-between mb-2">
                            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                ¿Necesitas ayuda?
                            </p>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <IconX className="w-4 h-4" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                            Nuestro equipo está listo para ayudarte. Haz clic abajo para chatear por WhatsApp.
                        </p>
                        <Button
                            onClick={handleClick}
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            size="sm"
                        >
                            <IconBrandWhatsapp className="w-4 h-4 mr-2" />
                            Iniciar Chat
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => isExpanded ? handleClick() : setIsExpanded(true)}
                className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors"
                aria-label="Contactar por WhatsApp"
            >
                <IconBrandWhatsapp className="w-7 h-7" />
            </motion.button>
        </div>
    )
}
