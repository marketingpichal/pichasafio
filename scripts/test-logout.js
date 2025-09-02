#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY
);

async function testLogout() {
  console.log('🔐 Probando funcionalidad de logout...');
  
  try {
    // 1. Verificar configuración de Supabase
    console.log('\n📋 Verificando configuración:');
    console.log(`  - URL: ${process.env.VITE_SUPABASE_URL}`);
    console.log(`  - Service Role Key: ${process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY ? 'Configurada' : 'No configurada'}`);
    
    // 2. Verificar sesión actual
    console.log('\n🔍 Verificando sesión actual...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Error obteniendo sesión:', sessionError);
      return;
    }
    
    console.log('📊 Estado de sesión:');
    console.log(`  - Sesión activa: ${sessionData.session ? 'Sí' : 'No'}`);
    if (sessionData.session) {
      console.log(`  - Usuario: ${sessionData.session.user?.email}`);
      console.log(`  - ID: ${sessionData.session.user?.id}`);
      console.log(`  - Expira: ${new Date(sessionData.session.expires_at * 1000).toLocaleString()}`);
    }
    
    // 3. Probar función signOut
    console.log('\n🚪 Probando función signOut...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('❌ Error en signOut:', signOutError);
      console.error('  - Mensaje:', signOutError.message);
      console.error('  - Código:', signOutError.status);
      return;
    }
    
    console.log('✅ signOut ejecutado sin errores');
    
    // 4. Verificar que la sesión se cerró
    console.log('\n🔍 Verificando que la sesión se cerró...');
    const { data: newSessionData, error: newSessionError } = await supabase.auth.getSession();
    
    if (newSessionError) {
      console.error('❌ Error verificando nueva sesión:', newSessionError);
      return;
    }
    
    console.log('📊 Estado después del logout:');
    console.log(`  - Sesión activa: ${newSessionData.session ? 'Sí' : 'No'}`);
    
    if (newSessionData.session) {
      console.log('⚠️  La sesión sigue activa después del logout');
      console.log(`  - Usuario: ${newSessionData.session.user?.email}`);
      console.log(`  - ID: ${newSessionData.session.user?.id}`);
    } else {
      console.log('✅ Sesión cerrada correctamente');
    }
    
    // 5. Verificar listeners de auth state
    console.log('\n👂 Probando listeners de cambio de estado...');
    
    let authStateChanged = false;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`🔄 Evento de auth: ${event}`);
      console.log(`📊 Nueva sesión: ${session ? 'Activa' : 'Inactiva'}`);
      authStateChanged = true;
    });
    
    // Esperar un momento para que se disparen los eventos
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    subscription.unsubscribe();
    
    console.log(`📡 Listener funcionando: ${authStateChanged ? 'Sí' : 'No'}`);
    
    // 6. Verificar configuración del cliente
    console.log('\n⚙️  Verificando configuración del cliente Supabase...');
    
    // Intentar una operación que requiera autenticación
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      if (profileError.code === 'PGRST301' || profileError.message.includes('JWT')) {
        console.log('✅ Cliente correctamente sin autenticación (error JWT esperado)');
      } else {
        console.log('⚠️  Error inesperado:', profileError.message);
      }
    } else {
      console.log('⚠️  Cliente aún tiene acceso a datos (posible problema)');
    }
    
    console.log('\n📝 Resumen del diagnóstico:');
    console.log('  ✅ Función signOut disponible');
    console.log(`  ${newSessionData.session ? '❌' : '✅'} Sesión cerrada correctamente`);
    console.log(`  ${authStateChanged ? '✅' : '❌'} Listeners de auth funcionando`);
    
    if (newSessionData.session) {
      console.log('\n🔧 Posibles soluciones:');
      console.log('  1. Verificar que el AuthProvider esté escuchando los cambios');
      console.log('  2. Revisar si hay múltiples instancias de Supabase');
      console.log('  3. Verificar configuración de cookies/localStorage');
      console.log('  4. Comprobar si hay errores en el navegador');
    }
    
  } catch (error) {
    console.error('❌ Error en la prueba:', error);
  }
}

testLogout();