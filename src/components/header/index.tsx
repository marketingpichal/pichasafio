import { motion } from 'framer-motion';

export default function Header() {
  return (
<motion.section
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-16 px-8 text-center"
    >
      <motion.h1
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
      >
        Pichasafio.com
      </motion.h1>
 
      <p className="text-xl md:text-2xl text-gray-200 mt-4">
        Agranda tu chimbo, dura más y no te vengas rápido
      </p>
      <button className="mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all">
        ¡Únete al Reto!
      </button>
    </motion.section>
  );
}