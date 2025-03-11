import { motion } from 'framer-motion';
import Engrosamiento from './Grosor';
import Alargamiento from './Largor';
import InstruccionesPene from '../Warning';
export default function Rutinas() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-16 px-8 text-center"
    >
      <InstruccionesPene></InstruccionesPene>
      <h2 className="text-4xl font-bold text-white">Nuevas Rutinas</h2>
      <p className="text-xl text-gray-300 mt-4">
        Aquí están las nuevas rutinas para que te conviertas en un campeón.
      </p>
      <Engrosamiento></Engrosamiento>
      <h2 className="text-4xl font-bold text-white">Rutina para alargarmiento</h2>
      
      <Alargamiento></Alargamiento>
    </motion.div>
  );
}