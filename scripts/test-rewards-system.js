import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY
);

async function testRewardsSystem() {
  console.log('🧪 Probando sistema de recompensas...');
  
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
    console.log(`  - Racha: ${initialLeaderboard?.current_streak || 0}`);
    console.log(`  - Sesiones: ${initialLeaderboard?.total_sessions || 0}`);
    
    // 3. Verificar recompensas disponibles
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value');
    
    console.log(`\n🏆 Recompensas disponibles: ${achievements?.length || 0}`);
    achievements?.slice(0, 5).forEach(achievement => {
      console.log(`  ${achievement.icon} ${achievement.name} - ${achievement.requirement_type}: ${achievement.requirement_value} (+${achievement.points_reward} pts)`);
    });
    
    // 4. Verificar recompensas ya obtenidas
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          name,
          icon,
          points_reward
        )
      `)
      .eq('user_id', testUser.id);
    
    console.log(`\n✨ Recompensas obtenidas: ${userAchievements?.length || 0}`);
    userAchievements?.forEach(ua => {
      console.log(`  ${ua.achievements?.icon} ${ua.achievements?.name} (+${ua.achievements?.points_reward} pts)`);
    });
    
    // 5. Simular progreso y verificar nuevas recompensas
    console.log('\n🎯 Simulando progreso...');
    
    // Agregar puntos para subir de nivel
    const pointsToAdd = 200;
    const newPoints = (initialLeaderboard?.total_points || 0) + pointsToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const newSessions = (initialLeaderboard?.total_sessions || 0) + 2;
    
    const { error: updateError } = await supabase
      .from('leaderboard')
      .update({
        total_points: newPoints,
        level: newLevel,
        total_sessions: newSessions,
        current_streak: 5,
        last_activity: new Date().toISOString()
      })
      .eq('user_id', testUser.id);
    
    if (updateError) {
      console.error('❌ Error actualizando leaderboard:', updateError);
      return;
    }
    
    console.log(`📈 Progreso simulado:`);
    console.log(`  - Puntos: ${initialLeaderboard?.total_points || 0} → ${newPoints}`);
    console.log(`  - Nivel: ${initialLeaderboard?.level || 0} → ${newLevel}`);
    console.log(`  - Sesiones: ${initialLeaderboard?.total_sessions || 0} → ${newSessions}`);
    console.log(`  - Racha: ${initialLeaderboard?.current_streak || 0} → 5`);
    
    // 6. Verificar qué recompensas debería obtener
    console.log('\n🔍 Verificando recompensas elegibles...');
    
    const earnedIds = userAchievements?.map(ua => ua.achievement_id) || [];
    const eligibleRewards = achievements?.filter(achievement => {
      if (earnedIds.includes(achievement.id)) return false;
      
      switch (achievement.requirement_type) {
        case 'level':
          return newLevel >= achievement.requirement_value;
        case 'points':
          return newPoints >= achievement.requirement_value;
        case 'streak':
          return 5 >= achievement.requirement_value;
        case 'sessions':
          return newSessions >= achievement.requirement_value;
        default:
          return false;
      }
    });
    
    console.log(`🎁 Recompensas elegibles: ${eligibleRewards?.length || 0}`);
    eligibleRewards?.forEach(reward => {
      console.log(`  ${reward.icon} ${reward.name} - ${reward.requirement_type}: ${reward.requirement_value} (+${reward.points_reward} pts)`);
    });
    
    // 7. Otorgar recompensas elegibles
    if (eligibleRewards && eligibleRewards.length > 0) {
      console.log('\n🎉 Otorgando recompensas...');
      
      for (const reward of eligibleRewards) {
        const { error: awardError } = await supabase
          .from('user_achievements')
          .insert({
            user_id: testUser.id,
            achievement_id: reward.id
          });
        
        if (!awardError) {
          // Agregar puntos bonus
          const { error: bonusError } = await supabase
            .from('leaderboard')
            .update({
              total_points: newPoints + reward.points_reward
            })
            .eq('user_id', testUser.id);
          
          if (!bonusError) {
            console.log(`  ✅ ${reward.icon} ${reward.name} otorgada (+${reward.points_reward} pts bonus)`);
          }
        } else {
          console.log(`  ❌ Error otorgando ${reward.name}:`, awardError.message);
        }
      }
    }
    
    // 8. Verificar estado final
    const { data: finalLeaderboard } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', testUser.id)
      .single();
    
    const { data: finalAchievements } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievements (
          name,
          icon,
          points_reward
        )
      `)
      .eq('user_id', testUser.id);
    
    console.log('\n📊 Estado final:');
    console.log(`  - Puntos: ${finalLeaderboard?.total_points || 0}`);
    console.log(`  - Nivel: ${finalLeaderboard?.level || 0}`);
    console.log(`  - Recompensas totales: ${finalAchievements?.length || 0}`);
    
    console.log('\n✅ Prueba del sistema de recompensas completada!');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testRewardsSystem();