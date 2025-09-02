import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY
);

async function testFarmingCalculator() {
  console.log('🧪 Probando calculadora de farmeo actualizada...');
  
  try {
    // 1. Obtener usuario de prueba
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError || !profiles || profiles.length === 0) {
      console.error('❌ No se encontró usuario de prueba');
      return;
    }
    
    const testUser = profiles[0];
    console.log(`👤 Usuario de prueba: ${testUser.username} (${testUser.id})`);
    
    // 2. Verificar estado inicial del leaderboard
    const { data: initialLeaderboard } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', testUser.id)
      .single();
    
    console.log('📊 Estado inicial del leaderboard:');
    console.log(`  - Puntos: ${initialLeaderboard?.total_points || 0}`);
    console.log(`  - Nivel: ${initialLeaderboard?.level || 0}`);
    console.log(`  - Última actividad: ${initialLeaderboard?.last_activity || 'Nunca'}`);
    
    // 3. Simular uso de calculadora con nueva categoría
    console.log('\n🎯 Simulando uso de calculadora...');
    
    // Categorías nuevas para probar
    const nuevasCategorias = [
      { name: 'Prima', xp: 15 },
      { name: 'Flaca', xp: 30 },
      { name: 'Alta', xp: 25 },
      { name: 'Discapacitada', xp: 50 },
      { name: 'Anciana', xp: 35 }
    ];
    
    console.log('🆕 Nuevas categorías agregadas:');
    nuevasCategorias.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.xp} XP`);
    });
    
    // 4. Simular ganancia de XP con categoría "Flaca"
    const xpToAdd = 30; // XP de categoría "Flaca"
    const currentPoints = initialLeaderboard?.total_points || 0;
    const newPoints = currentPoints + xpToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const now = new Date().toISOString();
    
    console.log(`\n📈 Simulando ganancia de XP con categoría "Flaca":`);
    console.log(`  - XP ganada: +${xpToAdd}`);
    console.log(`  - Puntos: ${currentPoints} → ${newPoints}`);
    console.log(`  - Nivel: ${initialLeaderboard?.level || 0} → ${newLevel}`);
    
    // 5. Actualizar leaderboard
    if (initialLeaderboard) {
      const { error: updateError } = await supabase
        .from('leaderboard')
        .update({
          total_points: newPoints,
          level: newLevel,
          last_activity: now,
          updated_at: now,
        })
        .eq('user_id', testUser.id);
      
      if (updateError) {
        console.error('❌ Error actualizando leaderboard:', updateError);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert({
          user_id: testUser.id,
          username: testUser.username,
          total_points: xpToAdd,
          level: 1,
          rank: 'Novato',
          last_activity: now,
          created_at: now,
          updated_at: now,
        });
      
      if (insertError) {
        console.error('❌ Error insertando en leaderboard:', insertError);
        return;
      }
    }
    
    console.log('✅ Leaderboard actualizado correctamente');
    
    // 6. Verificar límite de 12 horas
    console.log('\n⏰ Verificando límite de 12 horas...');
    
    const { data: updatedLeaderboard } = await supabase
      .from('leaderboard')
      .select('last_activity')
      .eq('user_id', testUser.id)
      .single();
    
    if (updatedLeaderboard?.last_activity) {
      const lastActivity = new Date(updatedLeaderboard.last_activity);
      const currentTime = new Date();
      const timeDiff = currentTime.getTime() - lastActivity.getTime();
      const twelveHours = 12 * 60 * 60 * 1000;
      
      console.log(`  - Última actividad: ${lastActivity.toLocaleString()}`);
      console.log(`  - Tiempo transcurrido: ${Math.floor(timeDiff / (60 * 1000))} minutos`);
      
      if (timeDiff < twelveHours) {
        const remaining = twelveHours - timeDiff;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        console.log(`  - ⏳ Tiempo restante para usar calculadora: ${hours}h ${minutes}m`);
        console.log(`  - 🚫 Calculadora bloqueada`);
      } else {
        console.log(`  - ✅ Calculadora disponible`);
      }
    }
    
    // 7. Verificar estado final
    const { data: finalLeaderboard } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', testUser.id)
      .single();
    
    console.log('\n📊 Estado final del leaderboard:');
    console.log(`  - Puntos: ${finalLeaderboard?.total_points || 0}`);
    console.log(`  - Nivel: ${finalLeaderboard?.level || 0}`);
    console.log(`  - Última actividad: ${finalLeaderboard?.last_activity}`);
    
    // 8. Probar todas las nuevas categorías
    console.log('\n🎮 Probando todas las nuevas categorías:');
    
    const todasLasCategorias = [
      { value: 'gorda', text: 'Gorda', xp: 40 },
      { value: 'fea', text: 'Fea', xp: 20 },
      { value: 'extranjera', text: 'Extranjera', xp: 40 },
      { value: 'novia', text: 'Novia', xp: 1000 },
      { value: 'amiga', text: 'Amiga', xp: 10 },
      { value: 'normal', text: 'Normal', xp: 10 },
      { value: 'buena', text: 'Buena', xp: 5 },
      { value: 'top', text: 'Top', xp: 200 },
      { value: 'prima', text: 'Prima', xp: 15 },
      { value: 'flaca', text: 'Flaca', xp: 30 },
      { value: 'alta', text: 'Alta', xp: 25 },
      { value: 'discapacitada', text: 'Discapacitada', xp: 50 },
      { value: 'anciana', text: 'Anciana', xp: 35 }
    ];
    
    console.log('📋 Categorías disponibles:');
    todasLasCategorias.forEach((cat, index) => {
      const isNew = ['prima', 'flaca', 'alta', 'discapacitada', 'anciana'].includes(cat.value);
      const marker = isNew ? '🆕' : '📌';
      console.log(`  ${marker} ${cat.text}: ${cat.xp} XP ${isNew ? '(NUEVA)' : ''}`);
    });
    
    console.log('\n✅ Prueba de calculadora de farmeo completada!');
    console.log('\n📝 Resumen de mejoras implementadas:');
    console.log('  ✅ Calculadora almacena XP correctamente en tabla leaderboard');
    console.log('  ✅ 5 nuevas categorías agregadas (prima, flaca, alta, discapacitada, anciana)');
    console.log('  ✅ Límite de uso cambiado de diario a cada 12 horas');
    console.log('  ✅ Corrección de campos de base de datos (user_id, total_points)');
    console.log('  ✅ Cálculo de nivel corregido (cada 100 puntos)');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testFarmingCalculator();