import React from 'react';
import './Instrucciones.css'; // Opcional: para estilos

const InstruccionesPene = () => {
  const instrucciones = [
    {
      id: 1,
      texto: "Realiza los estiramientos para el pene de manera OBLIGATORIA antes de comenzar cualquier rutina de alargamiento o engrosamiento. Esto prepara los tejidos y reduce el riesgo de lesiones."
    },
    {
      id: 2,
      texto: "Es obligatorio tomar descansos después de los ejercicios. Alterna con 1 o 2 días de reposo para permitir la recuperación adecuada."
    },
    {
      id: 3,
      texto: "Realiza los ejercicios solo hasta donde tu cuerpo lo soporte. Forzar más allá de tus límites puede provocar lesiones."
    },
    {
      id: 4,
      texto: "Evita masturbarte durante las sesiones de ejercicios para mantener la concentración y no interferir con los resultados."
    },
    {
      id: 5,
      texto: "Lleva un ritmo progresivo. Si eres principiante, no intentes ejercicios avanzados; respeta tu nivel actual."
    },
    {
      id: 6,
      texto: "RECUERDA: Una lesión puede detener tu progreso por días o semanas. Toma todas las precauciones necesarias y realiza los estiramientos previos sin excepción."
    },
    {
      id: 7,
      texto: "No apliques fuerza excesiva ni exageres en los ejercicios. Escucha a tu cuerpo y respeta tus límites para un proceso seguro."
    },
    // Sugerencia adicional
    {
      id: 8,
      texto: "Mantén una buena hidratación y consulta a un especialista si sientes dolor persistente o tienes dudas sobre la técnica."
    }
  ];

  return (
    <div className="instrucciones-container">
      <h1>Instrucciones Importantes para Rutinas de Ejercicios</h1>
      <p>A continuación, sigue estas recomendaciones clave para garantizar tu seguridad y maximizar los resultados:</p>
      
      <ol>
        {instrucciones.map((instruccion) => (
          <li key={instruccion.id}>
            <strong>{instruccion.texto}</strong>
          </li>
        ))}
      </ol>

      <div className="nota-final">
        <p>Nota: La constancia y la precaución son tus mejores aliados. ¡Avanza con cuidado, bro!
            (no nos hacemos responsables de lesiones o daños causados por mal uso de la información)
        </p>
      </div>
    </div>
  );
};

export default InstruccionesPene;