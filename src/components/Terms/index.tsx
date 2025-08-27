import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthProvider";
import { supabase } from "../../lib/supabaseClient";

export default function TerminosYCondiciones() {
  const [aceptado, setAceptado] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAceptar = async () => {
    if (!user?.id) {
      console.error("Usuario no autenticado");
      return;
    }

    try {
      // 1. Actualizar en Supabase que aceptó los TyC
      const { error } = await supabase
        .from("profiles") // usar la tabla profiles en lugar de usuarios
        .update({ tyc: true }) // columna booleana
        .eq("id", user.id);

      if (error) {
        console.error("Error guardando TyC:", error);
        return;
      }

      // 2. Cambiar estado local
      setAceptado(true);

      // 3. Redirigir
      navigate("/"); // aquí pones la ruta a donde quieres ir
    } catch (err) {
      console.error("Error general:", err);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <h1 style={styles.titulo}>Términos y Condiciones</h1>
        <div style={styles.texto}>
          <p>
            Bienvenido a <strong>pichasafio.com</strong>. El uso de este sitio
            implica la aceptación plena de estos términos y condiciones.
          </p>
          <p>
            Este sitio ofrece información, productos y contenido relacionado con
            el mejoramiento del rendimiento masculino y bienestar sexual. Toda
            la información proporcionada es con fines educativos y de
            entretenimiento.
          </p>
          <p>
            <strong>Exoneración de responsabilidad:</strong> Pichasafio.com no
            se responsabiliza por lesiones, daños, efectos secundarios o
            cualquier otro perjuicio físico o psicológico derivado del uso de la
            información, productos o servicios mencionados en este sitio. El
            usuario es el único responsable de verificar la idoneidad y
            seguridad de cualquier práctica o producto antes de su uso,
            consultando siempre con un profesional de la salud.
          </p>
          <p>
            Si no está de acuerdo con estos términos, debe abandonar este sitio
            inmediatamente.
          </p>
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="aceptar"
            checked={aceptado}
            onChange={() => setAceptado(!aceptado)}
          />
          <label htmlFor="aceptar">
            He leído y acepto los términos y condiciones
          </label>
        </div>

        <button
          style={{
            ...styles.boton,
            backgroundColor: aceptado ? "#4caf50" : "#ccc",
            cursor: aceptado ? "pointer" : "not-allowed",
          }}
          disabled={!aceptado}
          onClick={handleAceptar}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  container: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "12px",
    maxWidth: "700px",
    width: "90%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    maxHeight: "90vh",
    overflowY: "auto" as const,
  },
  titulo: {
    textAlign: "center" as const,
    marginBottom: "20px",
    color: "#222",
  },
  texto: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#555",
    marginBottom: "20px",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },
  boton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#fff",
    transition: "0.3s",
  },
};
