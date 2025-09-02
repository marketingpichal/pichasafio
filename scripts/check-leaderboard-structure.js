#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLeaderboardStructure() {
  try {
    console.log('🔍 Verificando estructura de la tabla leaderboard...');
    
    // Verificar columnas de leaderboard
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'leaderboard')
      .eq('table_schema', 'public')
      .order('ordinal_position');
    
    if (columnsError) {
      console.log('❌ Error obteniendo columnas:', columnsError.message);
      return;
    }
    
    console.log('📊 Columnas de la tabla leaderboard:');
    columns?.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'} ${col.column_default ? `default: ${col.column_default}` : ''}`);
    });
    
    // Verificar datos existentes
    const { data: leaderboardData, error: dataError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(5);
    
    if (dataError) {
      console.log('❌ Error obteniendo datos:', dataError.message);
    } else {
      console.log('\n📈 Datos existentes en leaderboard:');
      if (leaderboardData && leaderboardData.length > 0) {
        leaderboardData.forEach((entry, index) => {
          console.log(`  ${index + 1}. Usuario: ${entry.user_id}`);
          console.log(`     - Username: ${entry.username || 'N/A'}`);
          console.log(`     - Puntos: ${entry.total_points || 0}`);
          console.log(`     - Nivel: ${entry.level || 1}`);
          console.log(`     - Racha actual: ${entry.current_streak || 0}`);
          console.log(`     - Racha más larga: ${entry.longest_streak || 0}`);
          console.log('');
        });
      } else {
        console.log('  No hay datos en la tabla leaderboard');
      }
    }
    
    // Verificar si existen tablas relacionadas con achievements
    console.log('\n🏆 Verificando tablas de logros...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .like('table_name', '%achievement%');
    
    if (tablesError) {
      console.log('❌ Error verificando tablas:', tablesError.message);
    } else {
      if (tables && tables.length > 0) {
        console.log('📋 Tablas de logros encontradas:');
        tables.forEach(table => {
          console.log(`  - ${table.table_name}`);
        });
      } else {
        console.log('⚠️ No se encontraron tablas de logros (achievements)');
      }
    }
    
    console.log('\n✅ Verificación completada!');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkLeaderboardStructure();