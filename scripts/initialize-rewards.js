import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY
);

import { randomUUID } from 'crypto';

const rewards = [
  // Recompensas por nivel
  {
    id: randomUUID(),
    name: 'Primer Paso',
    description: 'Alcanza el nivel 1',
    icon: '🌱',
    requirement_type: 'level',
    requirement_value: 1,
    points_reward: 50
  },
  {
    id: randomUUID(),
    name: 'En Crecimiento',
    description: 'Alcanza el nivel 2',
    icon: '🌿',
    requirement_type: 'level',
    requirement_value: 2,
    points_reward: 100
  },
  {
    id: randomUUID(),
    name: 'Dedicado',
    description: 'Alcanza el nivel 5',
    icon: '🌳',
    requirement_type: 'level',
    requirement_value: 5,
    points_reward: 250
  },
  {
    id: randomUUID(),
    name: 'Experto',
    description: 'Alcanza el nivel 10',
    icon: '🏆',
    requirement_type: 'level',
    requirement_value: 10,
    points_reward: 500
  },
  {
    id: randomUUID(),
    name: 'Maestro',
    description: 'Alcanza el nivel 20',
    icon: '👑',
    requirement_type: 'level',
    requirement_value: 20,
    points_reward: 1000
  },
  
  // Recompensas por puntos
  {
    id: randomUUID(),
    name: 'Coleccionista',
    description: 'Acumula 500 puntos',
    icon: '💎',
    requirement_type: 'points',
    requirement_value: 500,
    points_reward: 100
  },
  {
    id: randomUUID(),
    name: 'Acumulador',
    description: 'Acumula 1000 puntos',
    icon: '💰',
    requirement_type: 'points',
    requirement_value: 1000,
    points_reward: 200
  },
  {
    id: randomUUID(),
    name: 'Millonario',
    description: 'Acumula 2500 puntos',
    icon: '🏦',
    requirement_type: 'points',
    requirement_value: 2500,
    points_reward: 500
  },
  
  // Recompensas por racha
  {
    id: randomUUID(),
    name: 'Constante',
    description: 'Mantén una racha de 3 días',
    icon: '🔥',
    requirement_type: 'streak',
    requirement_value: 3,
    points_reward: 150
  },
  {
    id: randomUUID(),
    name: 'Semana Perfecta',
    description: 'Mantén una racha de 7 días',
    icon: '⚡',
    requirement_type: 'streak',
    requirement_value: 7,
    points_reward: 300
  },
  {
    id: randomUUID(),
    name: 'Imparable',
    description: 'Mantén una racha de 30 días',
    icon: '🚀',
    requirement_type: 'streak',
    requirement_value: 30,
    points_reward: 1000
  },
  
  // Recompensas por sesiones
  {
    id: randomUUID(),
    name: 'Practicante',
    description: 'Completa 10 sesiones',
    icon: '📚',
    requirement_type: 'sessions',
    requirement_value: 10,
    points_reward: 200
  },
  {
    id: randomUUID(),
    name: 'Estudiante',
    description: 'Completa 50 sesiones',
    icon: '🎓',
    requirement_type: 'sessions',
    requirement_value: 50,
    points_reward: 500
  },
  {
    id: randomUUID(),
    name: 'Académico',
    description: 'Completa 100 sesiones',
    icon: '🏛️',
    requirement_type: 'sessions',
    requirement_value: 100,
    points_reward: 1000
  }
];

async function initializeRewards() {
  console.log('🎯 Inicializando sistema de recompensas...');
  
  try {
    // Verificar si ya existen recompensas
    const { data: existingRewards, error: checkError } = await supabase
      .from('achievements')
      .select('id')
      .limit(1);
    
    if (checkError) {
      console.error('Error verificando recompensas existentes:', checkError);
      return;
    }
    
    if (existingRewards && existingRewards.length > 0) {
      console.log('⚠️  Ya existen recompensas en la base de datos');
      console.log('🔄 Actualizando recompensas existentes...');
      
      // Actualizar recompensas existentes
      for (const reward of rewards) {
        const { error: upsertError } = await supabase
          .from('achievements')
          .upsert(reward, { onConflict: 'id' });
        
        if (upsertError) {
          console.error(`Error actualizando recompensa ${reward.id}:`, upsertError);
        } else {
          console.log(`✅ Recompensa actualizada: ${reward.name}`);
        }
      }
    } else {
      console.log('📝 Insertando nuevas recompensas...');
      
      // Insertar todas las recompensas
      const { error: insertError } = await supabase
        .from('achievements')
        .insert(rewards);
      
      if (insertError) {
        console.error('Error insertando recompensas:', insertError);
        return;
      }
      
      console.log(`✅ ${rewards.length} recompensas insertadas exitosamente`);
    }
    
    // Verificar la inserción
    const { data: allRewards, error: verifyError } = await supabase
      .from('achievements')
      .select('*')
      .order('requirement_value', { ascending: true });
    
    if (verifyError) {
      console.error('Error verificando recompensas:', verifyError);
      return;
    }
    
    console.log('\n🏆 Recompensas en la base de datos:');
    allRewards.forEach(reward => {
      console.log(`  ${reward.icon} ${reward.name} - ${reward.description} (+${reward.points_reward} pts)`);
    });
    
    console.log('\n✨ Sistema de recompensas inicializado correctamente!');
    
  } catch (error) {
    console.error('Error inicializando recompensas:', error);
  }
}

initializeRewards();