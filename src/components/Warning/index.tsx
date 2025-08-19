import { useState } from 'react';
import './Instrucciones.css'; // Opcional: para estilos

const InstruccionesPene = () => {
  const [mostrarInstrucciones, setMostrarInstrucciones] = useState(false);

  const instrucciones = [
    {
      id: 1,
      titulo: "Calentamiento Obligatorio",
      texto: "Siempre realiza estiramientos previos antes de cualquier rutina. Esto prepara los tejidos, mejora la circulación y previene lesiones graves."
    },
    {
      id: 2,
      titulo: "Descanso y Recuperación",
      texto: "Respeta los días de descanso (1-2 días entre sesiones). La recuperación es cuando ocurre el crecimiento real de los tejidos."
    },
    {
      id: 3,
      titulo: "Escucha tu Cuerpo",
      texto: "Nunca fuerces más allá de tu límite. Si sientes dolor agudo o molestias, detente inmediatamente y descansa."
    },
    {
      id: 4,
      titulo: "Concentración Total",
      texto: "Evita distracciones durante los ejercicios. Mantén el foco en la técnica correcta para obtener mejores resultados."
    },
    {
      id: 5,
      titulo: "Progresión Gradual",
      texto: "Comienza con ejercicios básicos y aumenta la intensidad progresivamente. La paciencia es clave para el éxito a largo plazo."
    },
    {
      id: 6,
      titulo: "Prevención de Lesiones",
      texto: "Una lesión puede retrasar tu progreso semanas o meses. Siempre prioriza la seguridad sobre la velocidad de resultados."
    },
    {
      id: 7,
      titulo: "Técnica Correcta",
      texto: "La calidad del movimiento es más importante que la intensidad. Aprende la técnica correcta antes de aumentar la dificultad."
    },
    {
      id: 8,
      titulo: "Hidratación y Consulta",
      texto: "Mantente bien hidratado y no dudes en consultar a un especialista si tienes dudas o experimentas dolor persistente."
    }
  ];

  const toggleInstrucciones = () => {
    setMostrarInstrucciones(!mostrarInstrucciones);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Instrucciones de Seguridad - Lectura Obligatoria
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Lee estas recomendaciones antes de comenzar cualquier rutina
              </p>
            </div>
          </div>
          <button
            onClick={toggleInstrucciones}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            {mostrarInstrucciones ? 'Ocultar' : 'Mostrar'} Instrucciones
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${mostrarInstrucciones ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {mostrarInstrucciones && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 animate-in slide-in-from-top duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
            Guía de Seguridad para Ejercicios
          </h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            {instrucciones.map((instruccion) => (
              <div key={instruccion.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {instruccion.id}
                  </span>
                  {instruccion.titulo}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {instruccion.texto}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="h-5 w-5 text-red-400 mt-0.5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-1">Descargo de Responsabilidad</h4>
                <p className="text-sm text-red-700">
                  La constancia y la precaución son fundamentales para el éxito. No nos hacemos responsables por lesiones o daños causados por el mal uso de esta información. Siempre consulta con un profesional de la salud antes de comenzar.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstruccionesPene;