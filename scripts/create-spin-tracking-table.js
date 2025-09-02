#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY
);

async function createSpinTrackingTable() {
  console.log('🎰 Creando tabla para tracking de ruleta...');
  
  try {
    // Crear tabla user_spins para tracking de la ruleta
    const { data, error } = await supabase
      .from('user_spins')
      .select('*')
      .limit(1);
    
    if (error && error.code === 'PGRST116') {
      console.log('❌ Tabla user_spins no existe');
      console.log('📝 Necesitas crear la tabla manualmente en Supabase Dashboard:');
      console.log(`
CREATE TABLE user_spins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_spin TIMESTAMP WITH TIME ZONE,
  total_spins INTEGER DEFAULT 0,
  total_xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Habilitar RLS
ALTER TABLE user_spins ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean sus propios datos
CREATE POLICY "Users can view own spin data" ON user_spins
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own spin data" ON user_spins
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own spin data" ON user_spins
  FOR UPDATE USING (auth.uid() = user_id);`);
      
      return false;
    } else if (error) {
      console.error('❌ Error verificando tabla:', error);
      return false;
    } else {
      console.log('✅ Tabla user_spins ya existe');
      return true;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Función para insertar datos de prueba
async function insertTestData() {
  console.log('\n📊 Insertando datos de prueba...');
  
  try {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (!profiles || profiles.length === 0) {
      console.log('❌ No hay usuarios para insertar datos de prueba');
      return;
    }
    
    const userId = profiles[0].id;
    
    const { error } = await supabase
      .from('user_spins')
      .upsert({
        user_id: userId,
        last_spin: null, // Primera vez
        total_spins: 0,
        total_xp_earned: 0
      });
    
    if (error) {
      console.error('❌ Error insertando datos de prueba:', error);
    } else {
      console.log('✅ Datos de prueba insertados correctamente');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

async function main() {
  const tableExists = await createSpinTrackingTable();
  
  if (tableExists) {
    await insertTestData();
    console.log('\n🎉 Sistema de tracking de ruleta listo!');
  } else {
    console.log('\n⚠️  Ejecuta el SQL mostrado arriba en Supabase Dashboard y luego ejecuta este script nuevamente.');
  }
}

main();