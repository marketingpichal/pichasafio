#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testProfileUpdate() {
  try {
    console.log('🧪 Probando actualización de perfil...');
    
    // Buscar un usuario existente para probar
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, username, email')
      .limit(1);
    
    if (fetchError) {
      console.log('❌ Error obteniendo perfiles:', fetchError.message);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('⚠️ No hay perfiles para probar');
      return;
    }
    
    const testProfile = profiles[0];
    console.log('👤 Perfil de prueba:', testProfile);
    
    // Probar actualización sin updated_at
    const testUsername = `test_${Date.now()}`;
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        username: testUsername
      })
      .eq('id', testProfile.id)
      .select()
      .single();
    
    if (updateError) {
      console.log('❌ Error actualizando perfil:', updateError.message);
      
      // Verificar si es por la columna updated_at
      if (updateError.message.includes('updated_at')) {
        console.log('🔍 El error sigue siendo por updated_at');
        console.log('💡 Necesitas agregar la columna manualmente en Supabase Dashboard');
      }
    } else {
      console.log('✅ Perfil actualizado exitosamente:', updatedProfile);
      
      // Revertir el cambio
      await supabase
        .from('profiles')
        .update({
          username: testProfile.username
        })
        .eq('id', testProfile.id);
      
      console.log('🔄 Cambio revertido');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

testProfileUpdate();