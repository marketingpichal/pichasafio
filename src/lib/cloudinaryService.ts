

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan variables de entorno de Supabase');
}



export interface PoseImage {
  name: string;
  url: string;
}

// 📌 Lista de imágenes conocidas en el bucket "poses" (hardcoded temporalmente)
const knownImages = [
  'Gato.jpg',
  'Martillo de Thor.jpg', 
  'Misionero.jpg',
  'Paso superior.jpg',
  'Twix.jpg',
  'Yunque.jpg'
];

// 📌 Obtener todas las imágenes del bucket "poses"
export const getPoseImages = async (): Promise<PoseImage[]> => {
  // Usar lista hardcoded mientras se resuelven los permisos RLS
  console.log('📸 Using known images from poses bucket');
  
  return knownImages.map((fileName) => ({
    name: fileName,
    url: `${supabaseUrl}/storage/v1/object/public/poses/${fileName}`,
  }));
};

// Mantener compatibilidad con el código existente
export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  created_at: string;
  bytes: number;
  tags: string[];
}

export interface PoseImageData {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  width: number;
  height: number;
  tags: string[];
  created_at: string;
}

// Función de compatibilidad que convierte PoseImage a PoseImageData
export const getPoseImagesLegacy = async (): Promise<PoseImageData[]> => {
  const images = await getPoseImages();
  
  return images.map((image, index) => ({
    id: `pose_${index + 1}`,
    name: image.name.replace(/\.[^/.]+$/, ''),
    url: image.url,
    thumbnail: image.url,
    width: 400,
    height: 600,
    tags: ['pose'],
    created_at: new Date().toISOString()
  }));
};

// Configuración de Supabase
const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  bucket: 'poses'
};

export default supabaseConfig;