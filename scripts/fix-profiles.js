#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixProfilesTable() {
  try {
    console.log('🔧 Intentando agregar columna updated_at a profiles...');
    
    // Método 1: Intentar usar la función sql directamente
    try {
      const { data, error } = await supabase.rpc('sql', {
        query: 'ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();'
      });
      
      if (error) {
        console.log('❌ Método 1 falló:', error.message);
      } else {
        console.log('✅ Método 1 exitoso - Columna agregada');
        
        // Actualizar registros existentes
        const { error: updateError } = await supabase.rpc('sql', {
          query: 'UPDATE public.profiles SET updated_at = created_at WHERE updated_at IS NULL;'
        });
        
        if (updateError) {
          console.log('⚠️ Error actualizando registros existentes:', updateError.message);
        } else {
          console.log('✅ Registros existentes actualizados');
        }
        return;
      }
    } catch (e) {
      console.log('❌ Método 1 excepción:', e.message);
    }
    
    // Método 2: Usar fetch directo a la API REST
    console.log('🔄 Intentando método 2 - API REST...');
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        query: 'ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();'
      })
    });
    
    if (response.ok) {
      console.log('✅ Método 2 exitoso - Columna agregada');
      
      // Actualizar registros existentes
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({
          query: 'UPDATE public.profiles SET updated_at = created_at WHERE updated_at IS NULL;'
        })
      });
      
      if (updateResponse.ok) {
        console.log('✅ Registros existentes actualizados');
      } else {
        console.log('⚠️ Error actualizando registros existentes');
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Método 2 falló:', errorText);
      
      console.log('\n💡 SOLUCIÓN MANUAL:');
      console.log('1. Ve a https://supabase.com/dashboard/project/ghghxoxvyvztddeorhed');
      console.log('2. Ve a SQL Editor');
      console.log('3. Ejecuta este SQL:');
      console.log('\nALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();');
      console.log('UPDATE public.profiles SET updated_at = created_at WHERE updated_at IS NULL;');
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
    
    console.log('\n💡 SOLUCIÓN MANUAL:');
    console.log('1. Ve a https://supabase.com/dashboard/project/ghghxoxvyvztddeorhed');
    console.log('2. Ve a SQL Editor');
    console.log('3. Ejecuta este SQL:');
    console.log('\nALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();');
    console.log('UPDATE public.profiles SET updated_at = created_at WHERE updated_at IS NULL;');
  }
}

fixProfilesTable();