#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function insertRealTestData() {
  try {
    console.log('🚀 Insertando datos de prueba con usuarios reales...');
    
    // 1. Obtener usuarios existentes de auth.users
    console.log('👥 Obteniendo usuarios existentes...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email')
      .order('created_at');
    
    if (profilesError) {
      console.log('❌ Error obteniendo perfiles:', profilesError.message);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('⚠️ No hay perfiles existentes para usar como base');
      return;
    }
    
    console.log('📊 Perfiles existentes:');
    profiles.forEach((profile, index) => {
      console.log(`  ${index + 1}. ${profile.username || 'sin username'} (${profile.email || 'sin email'})`);
    });
    
    // 2. Actualizar el perfil existente con datos de prueba
    const existingProfile = profiles[0];
    
    if (existingProfile.id) {
      console.log(`\n✏️ Actualizando perfil existente: ${existingProfile.username || 'usuario sin nombre'}`);
      
      const updateData = {
        username: 'juanperezagogo',
        email: 'juanperezagogo@icloud.com'
      };
      
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.log('❌ Error actualizando perfil:', updateError.message);
      } else {
        console.log('✅ Perfil actualizado:', updatedProfile);
      }
      
      // 3. Insertar datos en leaderboard para este usuario
      console.log('\n🏆 Insertando datos de leaderboard...');
      
      const leaderboardEntry = {
        user_id: existingProfile.id,
        username: 'juanperezagogo',
        total_points: 150,
        level: 3,
        current_streak: 5,
        longest_streak: 12
      };
      
      // Verificar si ya existe en leaderboard
      const { data: existingLeaderboard } = await supabase
        .from('leaderboard')
        .select('user_id')
        .eq('user_id', existingProfile.id)
        .single();
      
      if (existingLeaderboard) {
        // Actualizar
        const { error: leaderboardError } = await supabase
          .from('leaderboard')
          .update(leaderboardEntry)
          .eq('user_id', existingProfile.id);
        
        if (leaderboardError) {
          console.log('❌ Error actualizando leaderboard:', leaderboardError.message);
        } else {
          console.log('✅ Leaderboard actualizado');
        }
      } else {
        // Insertar nuevo
        const { error: leaderboardError } = await supabase
          .from('leaderboard')
          .insert(leaderboardEntry);
        
        if (leaderboardError) {
          console.log('❌ Error insertando leaderboard:', leaderboardError.message);
        } else {
          console.log('✅ Leaderboard insertado');
        }
      }
    }
    
    // 4. Crear algunos datos adicionales si hay más usuarios
    if (profiles.length > 1) {
      console.log('\n👥 Creando datos adicionales para otros usuarios...');
      
      for (let i = 1; i < Math.min(profiles.length, 3); i++) {
        const profile = profiles[i];
        const testUsernames = ['maria_yoga', 'carlos_zen', 'ana_pilates'];
        const testEmails = ['maria@example.com', 'carlos@example.com', 'ana@example.com'];
        const testPoints = [280, 95, 200];
        const testLevels = [5, 2, 4];
        
        // Actualizar perfil
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            username: testUsernames[i - 1],
            email: testEmails[i - 1]
          })
          .eq('id', profile.id);
        
        if (!updateError) {
          console.log(`✅ Perfil ${testUsernames[i - 1]} actualizado`);
          
          // Agregar a leaderboard
          const { data: existingLB } = await supabase
            .from('leaderboard')
            .select('user_id')
            .eq('user_id', profile.id)
            .single();
          
          const leaderboardData = {
            user_id: profile.id,
            username: testUsernames[i - 1],
            total_points: testPoints[i - 1],
            level: testLevels[i - 1],
            current_streak: Math.floor(Math.random() * 10) + 1,
            longest_streak: Math.floor(Math.random() * 20) + 5
          };
          
          if (existingLB) {
            await supabase
              .from('leaderboard')
              .update(leaderboardData)
              .eq('user_id', profile.id);
          } else {
            await supabase
              .from('leaderboard')
              .insert(leaderboardData);
          }
          
          console.log(`✅ Leaderboard para ${testUsernames[i - 1]} actualizado`);
        }
      }
    }
    
    // 5. Verificar resultados finales
    console.log('\n🔍 Verificando datos finales...');
    
    const { data: finalProfiles } = await supabase
      .from('profiles')
      .select('id, username, email')
      .order('username');
    
    console.log('📊 Perfiles actualizados:');
    finalProfiles?.forEach(profile => {
      console.log(`  - ${profile.username || 'sin username'} (${profile.email || 'sin email'})`);
    });
    
    const { data: finalLeaderboard } = await supabase
      .from('leaderboard')
      .select('username, total_points, level, current_streak')
      .order('total_points', { ascending: false });
    
    console.log('\n🏆 Leaderboard final:');
    finalLeaderboard?.forEach((entry, index) => {
      console.log(`  ${index + 1}. ${entry.username} - ${entry.total_points} puntos (Nivel ${entry.level}, Racha: ${entry.current_streak})`);
    });
    
    console.log('\n✅ ¡Datos de prueba insertados exitosamente!');
    console.log('\n💡 Ahora puedes:');
    console.log('1. Hacer login con el email del usuario actualizado');
    console.log('2. Probar la funcionalidad de actualización de perfil');
    console.log('3. Ver el leaderboard con datos reales');
    console.log('4. Probar todas las funcionalidades de la aplicación');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

insertRealTestData();