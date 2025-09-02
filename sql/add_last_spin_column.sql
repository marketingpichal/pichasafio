-- Agregar columna last_spin a la tabla profiles para el sistema de ruleta
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_spin TIMESTAMP WITH TIME ZONE;

-- Comentario: Esta columna almacenará la última vez que el usuario usó la ruleta de premios
-- para implementar el cooldown de 24 horas