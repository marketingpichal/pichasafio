import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import ResponsiveButton from "../common/ResponsiveButton";
import { profileService } from "../../lib/profileService";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required("El nombre de usuario es obligatorio")
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .max(20, "El nombre de usuario no puede tener más de 20 caracteres")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "El nombre de usuario solo puede contener letras, números y guiones bajos"
    ),
});

const CompleteProfile = () => {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar el formulario
      await validationSchema.validate({ username });

      // Verificar disponibilidad del username
      const isAvailable = await profileService.isUsernameAvailable(username);
      if (!isAvailable) {
        setError("Este nombre de usuario ya está en uso");
        setLoading(false);
        return;
      }

      // Obtener el usuario actual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError("No se pudo obtener la información del usuario");
        setLoading(false);
        return;
      }

      // Actualizar o crear el perfil con el username
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          username: username,
        });

      if (updateError) {
        setError("Error al actualizar el perfil: " + updateError.message);
        setLoading(false);
        return;
      }

      // Redirigir a rutinas después de completar el perfil
      navigate("/rutinas");
    } catch (validationError: any) {
      setError(validationError.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <ResponsiveCard className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Completa tu perfil
            </h1>
            <p className="text-gray-600">
              Necesitas un nombre de usuario para continuar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre de usuario *
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingresa tu nombre de usuario"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <ResponsiveButton
              type="submit"
              disabled={loading || !username.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Guardando..." : "Completar perfil"}
            </ResponsiveButton>
          </form>
        </ResponsiveCard>
      </motion.div>
    </div>
  );
};

export default CompleteProfile;