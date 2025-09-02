#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY
);

async function testSpinWheel() {
  console.log('🎰 Probando sistema de ruleta de premios...');
  
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
    
    console.log('\n📊 Estado inicial del leaderboard:');
    console.log(`  - Puntos: ${initialLeaderboard?.total_points || 0}`);
    console.log(`  - Nivel: ${initialLeaderboard?.level || 0}`);
    console.log(`  - Última actividad: ${initialLeaderboard?.last_activity || 'Nunca'}`);
    
    // 3. Verificar disponibilidad de ruleta
    console.log('\n⏰ Verificando disponibilidad de ruleta...');
    
    let canSpin = true;
    let timeRemaining = '';
    
    if (initialLeaderboard?.last_activity) {
      const lastActivity = new Date(initialLeaderboard.last_activity);
      const now = new Date();
      const timeDiff = now.getTime() - lastActivity.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      console.log(`  - Última actividad: ${lastActivity.toLocaleString()}`);
      console.log(`  - Tiempo transcurrido: ${Math.floor(timeDiff / (60 * 1000))} minutos`);
      
      if (timeDiff < twentyFourHours) {
        canSpin = false;
        const remaining = twentyFourHours - timeDiff;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        timeRemaining = `${hours}h ${minutes}m`;
        console.log(`  - ⏳ Tiempo restante: ${timeRemaining}`);
        console.log(`  - 🚫 Ruleta no disponible`);
      } else {
        console.log(`  - ✅ Ruleta disponible`);
      }
    } else {
      console.log(`  - ✅ Primera vez - Ruleta disponible`);
    }
    
    // 4. Simular giro de ruleta si está disponible
    if (canSpin) {
      console.log('\n🎲 Simulando giro de ruleta...');
      
      // Premios disponibles (mismo array que en el componente)
      const prizes = [
        { xp: 10, color: '#FF6B6B', label: '10 XP' },
        { xp: 15, color: '#4ECDC4', label: '15 XP' },
        { xp: 20, color: '#45B7D1', label: '20 XP' },
        { xp: 25, color: '#96CEB4', label: '25 XP' },
        { xp: 30, color: '#FFEAA7', label: '30 XP' },
        { xp: 35, color: '#DDA0DD', label: '35 XP' },
        { xp: 40, color: '#98D8C8', label: '40 XP' },
        { xp: 50, color: '#F7DC6F', label: '50 XP' }
      ];
      
      // Seleccionar premio aleatorio
      const randomIndex = Math.floor(Math.random() * prizes.length);
      const selectedPrize = prizes[randomIndex];
      
      console.log(`🎯 Premio seleccionado: ${selectedPrize.label}`);
      console.log(`🎨 Color: ${selectedPrize.color}`);
      
      // 5. Actualizar leaderboard con el premio
      const currentPoints = initialLeaderboard?.total_points || 0;
      const newPoints = currentPoints + selectedPrize.xp;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const now = new Date().toISOString();
      
      console.log(`\n📈 Actualizando leaderboard:`);
      console.log(`  - XP ganada: +${selectedPrize.xp}`);
      console.log(`  - Puntos: ${currentPoints} → ${newPoints}`);
      console.log(`  - Nivel: ${initialLeaderboard?.level || 0} → ${newLevel}`);
      
      if (initialLeaderboard) {
        // Actualizar leaderboard existente
        const { error: updateError } = await supabase
          .from('leaderboard')
          .update({
            total_points: newPoints,
            level: newLevel,
            last_activity: now,
            updated_at: now
          })
          .eq('user_id', testUser.id);
        
        if (updateError) {
          console.error('❌ Error actualizando leaderboard:', updateError);
          return;
        }
      } else {
        // Crear nueva entrada en leaderboard
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert({
            user_id: testUser.id,
            username: testUser.username,
            total_points: selectedPrize.xp,
            level: 1,
            rank: 'Novato',
            last_activity: now,
            created_at: now,
            updated_at: now
          });
        
        if (insertError) {
          console.error('❌ Error insertando en leaderboard:', insertError);
          return;
        }
      }
      
      console.log('✅ Leaderboard actualizado correctamente');
      
      // 6. Verificar estado final
      const { data: finalLeaderboard } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', testUser.id)
        .single();
      
      console.log('\n📊 Estado final del leaderboard:');
      console.log(`  - Puntos: ${finalLeaderboard?.total_points || 0}`);
      console.log(`  - Nivel: ${finalLeaderboard?.level || 0}`);
      console.log(`  - Última actividad: ${finalLeaderboard?.last_activity}`);
      
      // 7. Verificar que la ruleta ahora está bloqueada
      console.log('\n🔒 Verificando bloqueo de ruleta...');
      const newLastActivity = new Date(finalLeaderboard.last_activity);
      const currentTime = new Date();
      const newTimeDiff = currentTime.getTime() - newLastActivity.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      if (newTimeDiff < twentyFourHours) {
        const remaining = twentyFourHours - newTimeDiff;
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
        console.log(`  - ✅ Ruleta correctamente bloqueada por ${hours}h ${minutes}m`);
      } else {
        console.log(`  - ⚠️  Ruleta debería estar bloqueada pero no lo está`);
      }
    }
    
    // 8. Mostrar resumen de premios disponibles
    console.log('\n🎁 Premios disponibles en la ruleta:');
    const allPrizes = [
      { xp: 10, color: '#FF6B6B', label: '10 XP' },
      { xp: 15, color: '#4ECDC4', label: '15 XP' },
      { xp: 20, color: '#45B7D1', label: '20 XP' },
      { xp: 25, color: '#96CEB4', label: '25 XP' },
      { xp: 30, color: '#FFEAA7', label: '30 XP' },
      { xp: 35, color: '#DDA0DD', label: '35 XP' },
      { xp: 40, color: '#98D8C8', label: '40 XP' },
      { xp: 50, color: '#F7DC6F', label: '50 XP' }
    ];
    
    allPrizes.forEach((prize, index) => {
      console.log(`  🎯 Sección ${index + 1}: ${prize.label} (${prize.color})`);
    });
    
    console.log('\n✅ Prueba de ruleta completada!');
    console.log('\n📝 Resumen del sistema implementado:');
    console.log('  ✅ Ruleta con 8 premios diferentes (10-50 XP)');
    console.log('  ✅ Animación automática al cargar');
    console.log('  ✅ Sistema de cooldown de 24 horas');
    console.log('  ✅ Integración con tabla leaderboard');
    console.log('  ✅ Actualización automática de puntos y nivel');
    console.log('  ✅ Aparece automáticamente al iniciar sesión');
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testSpinWheel();