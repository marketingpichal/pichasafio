-- Crear tabla para rastrear inicios de sesión diarios
CREATE TABLE IF NOT EXISTS daily_logins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  login_date DATE NOT NULL,
  day_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_daily_logins_user_id ON daily_logins(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logins_login_date ON daily_logins(login_date);
CREATE INDEX IF NOT EXISTS idx_daily_logins_user_date ON daily_logins(user_id, login_date);
CREATE INDEX IF NOT EXISTS idx_daily_logins_day_number ON daily_logins(day_number);

-- Crear constraint único para evitar múltiples registros del mismo usuario en el mismo día
ALTER TABLE daily_logins 
ADD CONSTRAINT unique_user_login_date 
UNIQUE (user_id, login_date);

-- Habilitar RLS (Row Level Security)
ALTER TABLE daily_logins ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- Los usuarios solo pueden ver y modificar sus propios registros
CREATE POLICY "Users can view own daily logins" ON daily_logins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logins" ON daily_logins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logins" ON daily_logins
  FOR UPDATE USING (auth.uid() = user_id);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at
CREATE TRIGGER update_daily_logins_updated_at 
  BEFORE UPDATE ON daily_logins 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios para documentación
COMMENT ON TABLE daily_logins IS 'Tabla para rastrear los inicios de sesión diarios de los usuarios';
COMMENT ON COLUMN daily_logins.user_id IS 'ID del usuario que inició sesión';
COMMENT ON COLUMN daily_logins.login_date IS 'Fecha del inicio de sesión (YYYY-MM-DD)';
COMMENT ON COLUMN daily_logins.day_number IS 'Número de día consecutivo de inicio de sesión del usuario';
COMMENT ON COLUMN daily_logins.created_at IS 'Timestamp de creación del registro';
COMMENT ON COLUMN daily_logins.updated_at IS 'Timestamp de última actualización del registro';