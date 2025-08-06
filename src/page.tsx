// Page.tsx
import React from "react";
import { motion } from "framer-motion";
import Header from "./components/header";
import { Testimonial } from "./components/testimmonials";
import DonationBanner from "./components/donations";
import ResponsiveCard from "./components/common/ResponsiveCard";
import AdComponent from "./components/common/AdComponent";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <Header />

        {/* Anuncio del Header */}
        <div className="my-6">
          <AdComponent 
            adZoneId="1098247" 
            width={728} 
            height={90} 
            position="header"
            className="mx-auto"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Izquierdo */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AdComponent 
                adZoneId="1098246" 
                width={250} 
                height={250} 
                position="sidebar-left"
                className="mb-6"
              />
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="lg:col-span-2 space-y-8">
            {/* Sección de Instrucciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ResponsiveCard
                title="Instrucciones Importantes para Rutinas de Ejercicios"
                subtitle="Sigue estas recomendaciones para tu seguridad y mejores resultados"
              >
                <div className="space-y-4 text-gray-300 font-poppins-light">
                  <p>
                    A continuación, sigue estas recomendaciones clave para garantizar tu seguridad y maximizar los resultados:
                  </p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Realiza los estiramientos para el pene de manera OBLIGATORIA antes de comenzar cualquier rutina de ejercicios.</li>
                    <li>Nunca ejerzas más presión de la necesaria - si sientes dolor, detente inmediatamente.</li>
                    <li>Mantén una hidratación adecuada durante todo el proceso.</li>
                    <li>Descansa al menos 1 día entre sesiones para permitir la recuperación.</li>
                    <li>Si experimentas cualquier efecto secundario, consulta con un profesional de la salud.</li>
                  </ul>
                </div>
              </ResponsiveCard>
            </motion.div>

            {/* Sección de Testimonios */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Testimonial />
            </motion.div>

            {/* Sección de Donaciones */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <DonationBanner />
            </motion.div>
          </div>

          {/* Sidebar Derecho */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AdComponent 
                adZoneId="1098248" 
                width={308} 
                height={286} 
                position="sidebar-right"
                className="mb-6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}