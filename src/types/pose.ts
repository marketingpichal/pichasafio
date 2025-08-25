// Tipos unificados para poses con integración de Cloudinary

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

// Interfaz base para poses
export interface Pose {
  id: string;
  name: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  rating: number;
  views: number;
  likes: number;
  description: string;
  benefits: string[];
  duration: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
  isLocked?: boolean;
  // Imágenes de Cloudinary
  images: PoseImageData[];
  // Imagen principal (primera imagen o thumbnail)
  image: string;
}

// Para PoseScroll (versión simplificada)
export interface PoseScrollItem {
  id: string;
  name: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  rating: number;
  views: number;
  likes: number;
  image: string;
  description: string;
  benefits: string[];
  isLocked: boolean;
}

// Para PoseViewer (versión completa con pasos)
export interface PoseStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  tips?: string[];
  warnings?: string[];
}

export interface PoseDetailed extends Pose {
  steps: PoseStep[];
  requirements: string[];
  safetyTips: string[];
  instructions: string[];
  tips: string[];
  popularity: number;
}

// Filtros para poses
export interface PoseFilters {
  difficulty: string;
  category: string;
  minPopularity: number;
  searchTerm: string;
}

// Respuesta de la API de Cloudinary
export interface CloudinaryResponse {
  resources: CloudinaryImage[];
  next_cursor?: string;
  rate_limit_allowed: number;
  rate_limit_reset_at: string;
  rate_limit_remaining: number;
}