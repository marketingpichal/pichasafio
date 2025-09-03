import React, { useState } from "react";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import { MessageCircle, Phone, Clock, User, Send } from "lucide-react";

interface FormData {
  nombre: string;
  telefono: string;
  motivo: string;
  descripcion: string;
}

const Asesorias: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nombre: "",
    telefono: "",
    motivo: "",
    descripcion: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Construir el mensaje para WhatsApp
      const mensaje = `*Nueva Solicitud de Asesoría*%0A%0A` +
        `*Nombre:* ${formData.nombre}%0A` +
        `*Teléfono:* ${formData.telefono}%0A` +
        `*Motivo:* ${formData.motivo}%0A` +
        `*Descripción:* ${formData.descripcion}%0A%0A` +
        `*Fecha:* ${new Date().toLocaleDateString('es-ES')}%0A` +
        `*Hora:* ${new Date().toLocaleTimeString('es-ES')}`;

      // Número de WhatsApp (reemplaza con el número real)
      const whatsappNumber = "573008607992"; // TODO: Cambia este número por el número real de WhatsApp
      
      // Crear URL de WhatsApp
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${mensaje}`;
      
      // Redirigir a WhatsApp
      window.open(whatsappUrl, '_blank');
      
      // Resetear formulario
      setFormData({
        nombre: "",
        telefono: "",
        motivo: "",
        descripcion: "",
      });

    } catch (error) {
      console.error("Error al enviar formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const motivosAsesoria = [
    "Problemas de erección",
    "Eyaculación precoz",
    "Bajo deseo sexual",
    "Problemas de tamaño",
    "Rutinas de ejercicios",
    "Técnicas de respiración",
    "Problemas de confianza",
    "Relaciones de pareja",
    "Salud sexual general",
    "Otro (especificar en descripción)"
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4">
            Asesorías Personalizadas
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Obtén orientación experta y personalizada para mejorar tu salud íntima. 
            Nuestros especialistas están aquí para ayudarte en tu viaje de automejora.
          </p>
          <div className="mt-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-xl p-4">
            <p className="text-white font-semibold text-lg">
              💰 Precio: $50.000 COP por 30 minutos de asesoría personalizada
            </p>
          </div>
        </motion.div>

        {/* Beneficios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        >
          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <User className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Personalizado</h3>
            <p className="text-gray-300 text-sm">Atención individualizada según tus necesidades específicas</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <Clock className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Disponible 24/7</h3>
            <p className="text-gray-300 text-sm">Consulta cuando más te convenga, sin horarios fijos</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <Phone className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Vía WhatsApp</h3>
            <p className="text-gray-300 text-sm">Comunicación directa y rápida por tu app favorita</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">$50.000 COP</h3>
            <p className="text-gray-300 text-sm">Por 30 minutos de asesoría personalizada</p>
          </ResponsiveCard>
        </motion.div>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <ResponsiveCard
            title="Solicita tu Asesoría"
            subtitle="Completa el formulario y serás contactado vía WhatsApp. Costo: $50.000 COP por 30 minutos"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tu nombre completo"
                  />
                </div>
              
                {/* Teléfono */}
                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-300 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+57 300 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Motivo */}
                <div>
                  <label htmlFor="motivo" className="block text-sm font-medium text-gray-300 mb-2">
                    Motivo Principal *
                  </label>
                  <select
                    id="motivo"
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un motivo</option>
                    {motivosAsesoria.map((motivo, index) => (
                      <option key={index} value={motivo}>
                        {motivo}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descripcion" className="block text-sm font-medium text-gray-300 mb-2">
                  Descripción Detallada *
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                  placeholder="Describe tu situación, objetivos, y cualquier información adicional que consideres importante..."
                />
              </div>

              {/* Botón de envío */}
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Solicitud</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </ResponsiveCard>
        </motion.div>

        {/* Información adicional */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <ResponsiveCard className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold gradient-text mb-4">
                ¿Qué esperar después de enviar tu solicitud?
              </h3>
              <div className="text-left space-y-3 text-gray-300">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Recibirás un mensaje de confirmación vía WhatsApp</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Un especialista revisará tu solicitud en las próximas 24 horas</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Se programará una consulta personalizada según tu disponibilidad</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Recibirás orientación específica y un plan de acción personalizado</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p><strong>Importante:</strong> La asesoría tiene un costo de $50.000 COP por 30 minutos</p>
                </div>
              </div>
            </div>
          </ResponsiveCard>
        </motion.div>
      </div>
    </div>
  );
};

export default Asesorias;
