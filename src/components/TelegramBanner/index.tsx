
import { useState, useEffect } from "react"
import { X, Send, Users, Zap } from "lucide-react"

const STORAGE_KEY = "telegram-banner-dismissed"

export default function TelegramBannerImproved() {
    const [isVisible, setIsVisible] = useState(false)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        const isDismissed = localStorage.getItem(STORAGE_KEY)
        if (!isDismissed) {
            setTimeout(() => setIsVisible(true), 500)
        }
    }, [])

    const handleDismiss = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsVisible(false)
            localStorage.setItem(STORAGE_KEY, "true")
        }, 300)
    }

    const handleJoinTelegram = () => {
        window.open("https://t.me/pichasafio", "_blank")
    }

    if (!isVisible) return null

    return (
        <div
            className={`relative bg-gradient-to-br from-white via-gray-50 to-blue-50 border border-gray-200 shadow-lg transition-all duration-300 ${isClosing ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left Icon */}
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-[#0088cc]/15 flex-shrink-0">
                        <Send className="w-6 h-6 text-[#0088cc] fill-[#0088cc]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-8 sm:pr-0">
                        <div className="flex items-center gap-2 mb-1">
                            <Send className="w-5 h-5 text-[#0088cc] fill-[#0088cc] sm:hidden" />
                            <h3 className="font-bold text-gray-900 text-base sm:text-lg">Únete a la comunidad Pichasafio</h3>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                            Accede a <span className="font-semibold text-gray-900">tips exclusivos, retos especiales</span> y conecta
                            con otros miembros.
                        </p>

                        <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Users className="w-3.5 h-3.5" />
                                <span className="font-medium">+2500 miembros activos</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span className="font-medium">Actualizaciones diarias</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleJoinTelegram}
                        className="flex-shrink-0 bg-[#0088cc] hover:bg-[#0077b3] text-white font-semibold px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2 group"
                    >
                        <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        <span className="hidden sm:inline">Unirse Ahora</span>
                        <span className="sm:hidden">Unirse</span>
                    </button>

                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 sm:relative sm:top-0 sm:right-0 p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group flex-shrink-0"
                        aria-label="Cerrar banner"
                    >
                        <X className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
                    </button>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#0088cc]/40 to-transparent" />
        </div>
    )
}
