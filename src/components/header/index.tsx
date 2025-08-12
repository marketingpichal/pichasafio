import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PichasahurComicBanner from '../common/PichasahurComicBanner';

export default function Header() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/rutinas');
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-8 lg:px-12 text-center overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Pichasahur Comic Banner */}
        <motion.div
          initial={{ scale: 0, y: -50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <PichasahurComicBanner size="large" animated={true} variant="action" />
        </motion.div>
        
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight font-poppins"
        >
          Pichasafio.com
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 mt-4 sm:mt-6 max-w-2xl mx-auto leading-relaxed font-poppins-light"
        >
          Agranda tu chimbo, dura más y no te vengas rápido
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-10"
        >
          <button
            onClick={handleClick}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50 font-poppins-semibold"
          >
            <span className="relative z-10">¡CLIC AQUÍ PARA VER LAS NUEVAS RUTINAS!</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>
        </motion.div>

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"></div>
      </div>
    </motion.section>
  );
}