#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLeaderboard() {
  try {
    console.log('🔍 Verificando tabla leaderboard...');
    
    // Intentar obtener datos de leaderboard para ver qué campos existen
    const { data: leaderboardData, error: dataError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(1);
    
    if (dataError) {
      console.log('❌ Error obteniendo datos de leaderboard:', dataError.message);
      return;
    }
    
    if (leaderboardData && leaderboardData.length > 0) {
      console.log('📊 Campos disponibles en leaderboard:');
      const fields = Object.keys(leaderboardData[0]);
      fields.forEach(field => {
        const value = leaderboardData[0][field];
        const type = typeof value;
        console.log(`  - ${field}: ${type} (valor: ${value})`);
      });
      
      console.log('\n📈 Datos actuales:');
      leaderboardData.forEach((entry, index) => {
        console.log(`  Usuario ${index + 1}:`);
        Object.entries(entry).forEach(([key, value]) => {
          console.log(`    ${key}: ${value}`);
        });
      });
    } else {
      console.log('⚠️ No hay datos en la tabla leaderboard');
      
      // Intentar insertar un registro de prueba para ver la estructura
      console.log('\n🧪 Intentando insertar registro de prueba...');
      const { data: insertData, error: insertError } = await supabase
        .from('leaderboard')
        .insert({
          user_id: 'test-id',
          username: 'test-user',
          total_points: 0,
          level: 1
        })
        .select()
        .single();
      
      if (insertError) {
        console.log('❌ Error insertando:', insertError.message);
        console.log('💡 Esto nos ayuda a entender qué campos requiere la tabla');
      } else {
        console.log('✅ Registro de prueba insertado:', insertData);
        
        // Eliminar el registro de prueba
        await supabase
          .from('leaderboard')
          .delete()
          .eq('user_id', 'test-id');
        
        console.log('🗑️ Registro de prueba eliminado');
      }
    }
    
    // Verificar todas las tablas disponibles
    console.log('\n📋 Verificando todas las tablas disponibles...');
    
    const tableNames = ['profiles', 'leaderboard', 'posts', 'post_likes', 'post_comments', 'daily_logins', 'achievements', 'user_achievements', 'user_challenges', 'challenge_stats'];
    
    for (const tableName of tableNames) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`❌ ${tableName}: ${error.message}`);
      } else {
        console.log(`✅ ${tableName}: existe (${data?.length || 0} registros de muestra)`);
        if (data && data.length > 0) {
          const fields = Object.keys(data[0]);
          console.log(`   Campos: ${fields.join(', ')}`);
        }
      }
    }
    
    console.log('\n✅ Verificación completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkLeaderboard();