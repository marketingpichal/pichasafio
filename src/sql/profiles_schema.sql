-- 👤 Tabla de Perfiles de Usuario
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  email text,
  bio text,
  avatar_url text,
  theme text DEFAULT 'light',
  "30_days" jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Los usuarios pueden ver todos los perfiles (para funcionalidades sociales)
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Los usuarios solo pueden insertar su propio perfil
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Los usuarios solo pueden eliminar su propio perfil
CREATE POLICY "Users can delete their own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER update_profiles_updated_at_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profiles_updated_at();

-- Función para crear perfil automáticamente cuando se registra un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, created_at)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'username', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para crear perfil automáticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Comentarios para documentación
COMMENT ON TABLE public.profiles IS 'Perfiles de usuario con información adicional';
COMMENT ON COLUMN public.profiles.id IS 'ID del usuario (referencia a auth.users)';
COMMENT ON COLUMN public.profiles.username IS 'Nombre de usuario único';
COMMENT ON COLUMN public.profiles.email IS 'Email del usuario';
COMMENT ON COLUMN public.profiles.bio IS 'Biografía del usuario';
COMMENT ON COLUMN public.profiles.avatar_url IS 'URL del avatar del usuario';
COMMENT ON COLUMN public.profiles.theme IS 'Tema preferido del usuario';
COMMENT ON COLUMN public.profiles."30_days" IS 'Datos del reto de 30 días';
COMMENT ON COLUMN public.profiles.created_at IS 'Fecha de creación del perfil';
COMMENT ON COLUMN public.profiles.updated_at IS 'Fecha de última actualización del perfil';