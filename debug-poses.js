// Script simple para debuggear getPoseImages
import { getPoseImages } from './src/lib/cloudinaryService.ts';

console.log('🔍 Iniciando debug de getPoseImages...');

try {
  const images = await getPoseImages();
  console.log('✅ Imágenes obtenidas:', images.length);
  console.log('📊 Primera imagen:', images[0]);
  console.log('📊 Todas las imágenes:', images);
} catch (error) {
  console.error('❌ Error:', error);
}