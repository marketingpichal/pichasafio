import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.development' });

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDailyXPButton() {
  console.log('🧪 Probando funcionalidad del botón de XP diario...');
  
  try {
    // 1. Obtener un usuario de prueba
    const { data: profiles } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (!profiles || profiles.length === 0) {
      console.log('❌ No se encontraron usuarios para probar');
      return;
    }
    
    const testUser = profiles[0];
    console.log(`👤 Usuario de prueba: ${testUser.username} (${testUser.id})`);
    
    // 2. Verificar estado actual del leaderboard
    const { data: leaderboard } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', testUser.id)
      .single();
    
    if (leaderboard) {
      console.log(`📊 Estado actual del leaderboard:`);
      console.log(`   - Puntos: ${leaderboard.total_points}`);
      console.log(`   - Nivel: ${leaderboard.level}`);
      console.log(`   - Última actividad: ${leaderboard.last_activity}`);
      
      // 3. Verificar si puede reclamar XP
      const lastActivity = new Date(leaderboard.last_activity);
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      const hoursElapsed = timeDiff / (60 * 60 * 1000);
      
      console.log(`⏰ Tiempo transcurrido desde última actividad: ${hoursElapsed.toFixed(2)} horas`);
      
      if (timeDiff >= twentyFourHours) {
        console.log('✅ El botón debería estar DISPONIBLE (han pasado 24+ horas)');
      } else {
        const timeLeft = twentyFourHours - timeDiff;
        const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        console.log(`⏳ El botón debería mostrar: "Próximo en ${hoursLeft}h ${minutesLeft}m"`);
      }
    } else {
      console.log('🆕 Usuario sin entrada en leaderboard - botón debería estar DISPONIBLE');
    }
    
    // 4. Simular actualización de last_activity para probar cooldown
    console.log('\n🔄 Simulando actualización de actividad...');
    
    const { error: updateError } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: testUser.id,
        username: testUser.username,
        total_points: leaderboard ? leaderboard.total_points + 25 : 25,
        level: leaderboard ? leaderboard.level : 1,
        last_activity: new Date().toISOString()
      });
    
    if (updateError) {
      console.log('❌ Error actualizando leaderboard:', updateError.message);
    } else {
      console.log('✅ Actividad actualizada - botón debería mostrar cooldown ahora');
    }
    
    // 5. Verificar nuevo estado
    const { data: updatedLeaderboard } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', testUser.id)
      .single();
    
    if (updatedLeaderboard) {
      console.log(`\n📊 Estado actualizado del leaderboard:`);
      console.log(`   - Puntos: ${updatedLeaderboard.total_points}`);
      console.log(`   - Nivel: ${updatedLeaderboard.level}`);
      console.log(`   - Última actividad: ${updatedLeaderboard.last_activity}`);
    }
    
    console.log('\n✅ Prueba completada. Verifica en la interfaz que:');
    console.log('   1. El botón flotante aparece en la parte superior');
    console.log('   2. Muestra el tiempo de cooldown correctamente');
    console.log('   3. Solo permite reclamar cada 24 horas');
    console.log('   4. Al hacer clic, abre la ruleta de premios');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error.message);
  }
}

testDailyXPButton();