// Configuración para el sistema de asesorías
export const ASESORIAS_CONFIG = {
  // Precio y duración
  PRECIO: "50.000 COP",
  DURACION: "30 minutos",
  
  // Configuración del widget flotante
  WIDGET: {
    // Páginas donde NO mostrar el widget
    HIDE_ON_PAGES: [
      "/asesorias", // No mostrar en la página de asesorías
      "/login",     // No mostrar en login
      "/register",  // No mostrar en registro
    ],
    
    // Delay antes de mostrar (en segundos)
    SHOW_DELAY: 2,
    
    // Posición del widget
    POSITION: {
      bottom: "1.5rem", // 6 en Tailwind
      right: "1.5rem",  // 6 en Tailwind
    }
  },
  
  // Configuración del banner superior
  BANNER: {
    // Páginas donde NO mostrar el banner
    HIDE_ON_PAGES: [
      "/asesorias", // No mostrar en la página de asesorías
      "/login",     // No mostrar en login
      "/register",  // No mostrar en registro
    ],
    
    // Texto del banner
    TEXT: {
      TITLE: "¿Necesitas ayuda personalizada?",
      SUBTITLE: "Asesorías desde $50.000 COP",
      CTA: "Solicitar Ahora"
    }
  },
  
  // Motivos de asesoría más populares para mostrar en el widget
  MOTIVOS_POPULARES: [
    "Problemas de erección",
    "Eyaculación precoz", 
    "Bajo deseo sexual",
    "Rutinas de ejercicios"
  ],
  
  // Beneficios destacados
  BENEFICIOS: [
    "Atención personalizada 24/7",
    "Solución inmediata vía WhatsApp"
  ]
};

// Función para verificar si mostrar elementos en una página específica
export const shouldShowAsesorias = (currentPath: string, elementType: 'widget' | 'banner'): boolean => {
  const hidePages = elementType === 'widget' 
    ? ASESORIAS_CONFIG.WIDGET.HIDE_ON_PAGES
    : ASESORIAS_CONFIG.BANNER.HIDE_ON_PAGES;
    
  return !hidePages.some(page => currentPath.startsWith(page));
};
