#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Primero verificar qué columnas existen en profiles
async function checkProfilesStructure() {
  console.log('🔍 Verificando estructura de la tabla profiles...');
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.log('❌ Error:', error.message);
    return null;
  }
  
  if (data && data.length > 0) {
    console.log('📊 Columnas disponibles:', Object.keys(data[0]));
    return Object.keys(data[0]);
  } else {
    // Si no hay datos, intentar con una consulta que falle para ver el error
    const { error: testError } = await supabase
      .from('profiles')
      .select('id, username, email, created_at')
      .limit(1);
    
    if (testError) {
      console.log('❌ Error de prueba:', testError.message);
    } else {
      console.log('✅ Columnas básicas disponibles: id, username, email, created_at');
      return ['id', 'username', 'email', 'created_at'];
    }
  }
  
  return null;
}

async function insertBasicTestData() {
  try {
    console.log('🚀 Insertando datos básicos de prueba...');
    
    // Verificar estructura primero
    const availableColumns = await checkProfilesStructure();
    
    if (!availableColumns) {
      console.log('❌ No se pudo determinar la estructura de la tabla');
      return;
    }
    
    // Datos de prueba básicos (solo campos que sabemos que existen)
    const testUsers = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        username: 'juanperezagogo',
        email: 'juanperezagogo@icloud.com'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'maria_yoga',
        email: 'maria@example.com'
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        username: 'carlos_zen',
        email: 'carlos@example.com'
      }
    ];
    
    console.log('\n👤 Insertando perfiles básicos...');
    
    for (const user of testUsers) {
      // Solo usar campos que existen
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email
      };
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(userData, { onConflict: 'id' })
        .select();
      
      if (error) {
        console.log(`❌ Error insertando usuario ${user.username}:`, error.message);
      } else {
        console.log(`✅ Usuario ${user.username} insertado/actualizado`);
      }
    }
    
    // Intentar insertar en leaderboard (sin onConflict si no hay constraint)
    console.log('\n🏆 Insertando datos básicos de leaderboard...');
    
    const leaderboardData = [
      {
        user_id: testUsers[0].id,
        username: testUsers[0].username,
        total_points: 150,
        level: 3,
        current_streak: 5,
        longest_streak: 12
      },
      {
        user_id: testUsers[1].id,
        username: testUsers[1].username,
        total_points: 280,
        level: 5,
        current_streak: 8,
        longest_streak: 15
      },
      {
        user_id: testUsers[2].id,
        username: testUsers[2].username,
        total_points: 95,
        level: 2,
        current_streak: 3,
        longest_streak: 7
      }
    ];
    
    for (const entry of leaderboardData) {
      // Primero verificar si ya existe
      const { data: existing } = await supabase
        .from('leaderboard')
        .select('user_id')
        .eq('user_id', entry.user_id)
        .single();
      
      if (existing) {
        // Actualizar
        const { error } = await supabase
          .from('leaderboard')
          .update(entry)
          .eq('user_id', entry.user_id);
        
        if (error) {
          console.log(`❌ Error actualizando leaderboard para ${entry.username}:`, error.message);
        } else {
          console.log(`✅ Leaderboard para ${entry.username} actualizado`);
        }
      } else {
        // Insertar nuevo
        const { error } = await supabase
          .from('leaderboard')
          .insert(entry);
        
        if (error) {
          console.log(`❌ Error insertando leaderboard para ${entry.username}:`, error.message);
        } else {
          console.log(`✅ Leaderboard para ${entry.username} insertado`);
        }
      }
    }
    
    // Verificar datos insertados
    console.log('\n🔍 Verificando datos insertados...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email')
      .order('username');
    
    if (profilesError) {
      console.log('❌ Error verificando perfiles:', profilesError.message);
    } else {
      console.log('📊 Perfiles en la base de datos:');
      profiles.forEach(profile => {
        console.log(`  - ${profile.username} (${profile.email || 'sin email'})`);
      });
    }
    
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('username, total_points, level')
      .order('total_points', { ascending: false });
    
    if (leaderboardError) {
      console.log('❌ Error verificando leaderboard:', leaderboardError.message);
    } else {
      console.log('\n🏆 Leaderboard:');
      leaderboard.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry.username} - ${entry.total_points} puntos (Nivel ${entry.level})`);
      });
    }
    
    console.log('\n✅ Datos básicos de prueba insertados!');
    console.log('\n💡 Ahora puedes probar:');
    console.log('1. Actualizar perfil de usuario: juanperezagogo');
    console.log('2. Ver el leaderboard con datos reales');
    console.log('3. Probar la funcionalidad de perfiles');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

insertBasicTestData();