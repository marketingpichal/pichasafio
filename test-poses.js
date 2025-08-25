// Script de prueba para verificar getPoseImages
import { getPoseImages } from './src/lib/cloudinaryService.ts';

console.log('🧪 Probando getPoseImages...');

getPoseImages()
  .then(images => {
    console.log('✅ Imágenes obtenidas:', images.length);
    console.log('📸 Primera imagen:', images[0]);
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });