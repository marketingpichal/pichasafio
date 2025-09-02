#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Configuración de desarrollo
const supabaseUrl = 'https://ghghxoxvyvztddeorhed.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addUpdatedAtColumn() {
  try {
    console.log('🚀 Agregando columna updated_at a la tabla profiles...');
    
    // Verificar si la columna ya existe
    const { data: columns, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles')
      .eq('column_name', 'updated_at');
    
    if (checkError) {
      console.error('❌ Error verificando columna:', checkError);
      return;
    }
    
    if (columns && columns.length > 0) {
      console.log('✅ La columna updated_at ya existe en la tabla profiles');
      return;
    }
    
    console.log('📝 La columna updated_at no existe, agregándola...');
    
    // Ejecutar la migración usando una consulta SQL directa
    const { error } = await supabase.rpc('exec', {
      sql: `
        -- Agregar columna updated_at
        ALTER TABLE public.profiles 
        ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        
        -- Actualizar registros existentes
        UPDATE public.profiles 
        SET updated_at = created_at 
        WHERE updated_at IS NULL;
      `
    });
    
    if (error) {
      console.error('❌ Error ejecutando migración:', error);
      
      // Intentar método alternativo
      console.log('🔄 Intentando método alternativo...');
      
      // Usar el método de inserción para verificar la estructura
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id, updated_at')
        .limit(1);
      
      if (testError && testError.message.includes('updated_at')) {
        console.log('❌ Confirmado: la columna updated_at no existe');
        console.log('💡 Necesitas ejecutar la migración manualmente en Supabase Dashboard');
        console.log('📋 SQL a ejecutar:');
        console.log('ALTER TABLE public.profiles ADD COLUMN updated_at timestamp with time zone DEFAULT now();');
      } else {
        console.log('✅ La columna updated_at parece existir');
      }
    } else {
      console.log('✅ Migración completada exitosamente');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addUpdatedAtColumn();