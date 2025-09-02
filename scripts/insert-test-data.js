#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Datos de prueba
const testUsers = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    username: 'juanperezagogo',
    email: 'juanperezagogo@icloud.com',
    bio: '¡Hola! Soy Juan y me encanta el yoga 🧘‍♂️',
    theme: 'neon'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    username: 'maria_yoga',
    email: 'maria@example.com',
    bio: 'Instructora de yoga con 5 años de experiencia 🌟',
    theme: 'light'
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    username: 'carlos_zen',
    email: 'carlos@example.com',
    bio: 'Buscando paz interior a través del yoga 🕉️',
    theme: 'dark'
  }
];

const testPoses = [
  {
    name: 'Postura del Guerrero I',
    description: 'Una postura fundamental que fortalece las piernas y mejora el equilibrio',
    difficulty: 'beginner',
    duration: 30,
    category: 'standing'
  },
  {
    name: 'Postura del Perro Boca Abajo',
    description: 'Excelente para estirar la espalda y fortalecer los brazos',
    difficulty: 'beginner',
    duration: 45,
    category: 'inversion'
  },
  {
    name: 'Postura del Árbol',
    description: 'Mejora el equilibrio y la concentración',
    difficulty: 'intermediate',
    duration: 60,
    category: 'balance'
  }
];

async function insertTestData() {
  try {
    console.log('🚀 Insertando datos de prueba...');
    
    // 1. Insertar perfiles de usuario
    console.log('👤 Insertando perfiles de usuario...');
    
    for (const user of testUsers) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(user, { onConflict: 'id' });
      
      if (error) {
        console.log(`❌ Error insertando usuario ${user.username}:`, error.message);
      } else {
        console.log(`✅ Usuario ${user.username} insertado/actualizado`);
      }
    }
    
    // 2. Insertar poses (si la tabla existe)
    console.log('\n🧘 Insertando poses...');
    
    for (const pose of testPoses) {
      const { data, error } = await supabase
        .from('poses')
        .upsert(pose, { onConflict: 'name' });
      
      if (error) {
        console.log(`❌ Error insertando pose ${pose.name}:`, error.message);
        if (error.message.includes('relation "poses" does not exist')) {
          console.log('⚠️ La tabla poses no existe, saltando...');
          break;
        }
      } else {
        console.log(`✅ Pose ${pose.name} insertada/actualizada`);
      }
    }
    
    // 3. Insertar datos en leaderboard
    console.log('\n🏆 Insertando datos de leaderboard...');
    
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
      const { data, error } = await supabase
        .from('leaderboard')
        .upsert(entry, { onConflict: 'user_id' });
      
      if (error) {
        console.log(`❌ Error insertando leaderboard para ${entry.username}:`, error.message);
      } else {
        console.log(`✅ Leaderboard para ${entry.username} insertado/actualizado`);
      }
    }
    
    // 4. Verificar datos insertados
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
        console.log(`  - ${profile.username} (${profile.email})`);
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
    
    console.log('\n✅ Datos de prueba insertados exitosamente!');
    console.log('\n💡 Ahora puedes:');
    console.log('1. Probar el login con: juanperezagogo@icloud.com');
    console.log('2. Ver el leaderboard con datos');
    console.log('3. Probar la funcionalidad de perfiles');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

insertTestData();