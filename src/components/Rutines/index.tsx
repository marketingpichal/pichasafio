import { motion } from "framer-motion";
import Engrosamiento from "./Grosor";
import Alargamiento from "./Largor";
import InstruccionesPene from "../Warning";
import ResponsiveCard from "../common/ResponsiveCard";
import { Dumbbell, Target, TrendingUp, Play } from "lucide-react";

export default function Rutinas() {
  // const [showRecipesPopup, setShowRecipesPopup] = useState(false);

  // useEffect(() => {
  //   // Mostrar popup después de 2 segundos de entrar a la página
  //   const timer = setTimeout(() => {
  //     setShowRecipesPopup(true);
  //   }, 2000);

  //   return () => clearTimeout(timer);
  // }, []);

  // const handleCloseRecipesPopup = () => {
  //   setShowRecipesPopup(false);
  // };

  // const handleJoinWhatsAppForRecipes = () => {
  //   const phoneNumber = "573004048012";
  //   const message = "Quiero unirme al canal del WhatsApp por las recetas afrodisíacas";
  //   const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  //   window.open(whatsappUrl, '_blank');
  //   setShowRecipesPopup(false);
  // };

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Dumbbell className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4 font-poppins">
            Nuevas Rutinas
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-poppins-light">
            Aquí están las nuevas rutinas para que te conviertas en un campeón.
            Sigue estas rutinas paso a paso para obtener los mejores resultados.
          </p>
        </motion.div>

        {/* Warning Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <InstruccionesPene />
        </motion.div>

        {/* Daily Videos Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-12"
        >
          {/* <DailyVideos /> */}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-poppins-semibold">
              Videos Diarios
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Desbloquea nuevos videos de entrenamiento iniciando sesión cada
              día
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-poppins-semibold">
              Rutinas Especializadas
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Rutinas diseñadas específicamente para diferentes objetivos y
              niveles
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-poppins-semibold">
              Progreso Diario
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Sigue tu progreso y mantén la constancia con contenido diario
            </p>
          </ResponsiveCard>
        </motion.div>

        {/* Engrosamiento Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-12"
        >
          <ResponsiveCard
            title="Rutina de Engrosamiento"
            subtitle="Aumenta el grosor de tu pene con estos ejercicios especializados"
            className="mb-8"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white font-poppins-semibold">
                  Objetivo: Engrosamiento
                </h3>
              </div>
              <Engrosamiento />
            </div>
          </ResponsiveCard>
        </motion.div>

        {/* Alargamiento Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mb-12"
        >
          <ResponsiveCard
            title="Rutina de Alargamiento"
            subtitle="Aumenta la longitud de tu pene con estos ejercicios progresivos"
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white font-poppins-semibold">
                  Objetivo: Alargamiento
                </h3>
              </div>
              <Alargamiento />
            </div>
          </ResponsiveCard>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center"
        >
          <ResponsiveCard className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold gradient-text mb-4 font-poppins-bold">
                ¡Comienza tu Transformación Hoy!
              </h3>
              <p className="text-gray-300 leading-relaxed font-poppins-light">
                Sigue estas rutinas de manera consistente y verás resultados
                increíbles. Recuerda que la constancia es la clave del éxito.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-poppins-semibold">
                  Ver Más Rutinas
                </button>
                <button className="bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 font-poppins-semibold">
                  Consejos de Expertos
                </button>
              </div>
            </div>
          </ResponsiveCard>
        </motion.div>
      </div>

      {/* Popup de Recetas Afrodisíacas */}
      {/* <RecipesPopup
        isOpen={showRecipesPopup}
        onClose={handleCloseRecipesPopup}
        onJoinWhatsApp={handleJoinWhatsAppForRecipes}
      /> */}
    </div>
  );
}
