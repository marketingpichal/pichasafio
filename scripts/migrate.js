#!/usr/bin/env node

/**
 * Script de migración para Supabase
 * Permite ejecutar migraciones en desarrollo y producción
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

// Configuración de entornos
const environments = {
  development: {
    url: process.env.VITE_SUPABASE_URL_DEV || 'https://ghghxoxvyvztddeorhed.supabase.co',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY_DEV || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoZ2h4b3h2eXZ6dGRkZW9yaGVkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTczNDM0MiwiZXhwIjoyMDcxMzEwMzQyfQ.vQJHOGD0mTCKRqP24rw4hNW12HjRL9PbLSXa-ui2Bnw'
  },
  production: {
    url: process.env.VITE_SUPABASE_URL_PROD || '',
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY_PROD || ''
  }
};

// Función para crear cliente de Supabase
function createSupabaseClient(env) {
  const config = environments[env];
  if (!config.url || !config.serviceKey) {
    throw new Error(`Configuración incompleta para el entorno ${env}`);
  }
  return createClient(config.url, config.serviceKey);
}

// Función para leer archivos SQL
function readSQLFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Archivo no encontrado: ${filePath}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

// Función para ejecutar migración
async function runMigration(env, migrationFile) {
  try {
    console.log(`🚀 Ejecutando migración en ${env}...`);
    console.log(`📁 Archivo: ${migrationFile}`);
    
    const supabase = createSupabaseClient(env);
    const sql = readSQLFile(migrationFile);
    
    // Dividir el SQL en statements individuales
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    console.log(`📊 Ejecutando ${statements.length} statement(s)...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`⚡ Ejecutando statement ${i + 1}/${statements.length}`);
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
      
      if (error) {
        console.error(`❌ Error en statement ${i + 1}:`, error);
        throw error;
      }
    }
    
    console.log(`✅ Migración completada exitosamente en ${env}`);
    
  } catch (error) {
    console.error(`❌ Error ejecutando migración en ${env}:`, error.message);
    process.exit(1);
  }
}

// Función para confirmar acción
function askConfirmation(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Uso: node migrate.js <entorno> <archivo-migracion>');
    console.log('Entornos disponibles: development, production');
    console.log('Ejemplo: node migrate.js development ./sql/001_create_tables.sql');
    process.exit(1);
  }
  
  const [env, migrationFile] = args;
  
  if (!environments[env]) {
    console.error(`❌ Entorno no válido: ${env}`);
    console.log('Entornos disponibles:', Object.keys(environments).join(', '));
    process.exit(1);
  }
  
  const fullPath = path.resolve(migrationFile);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Archivo no encontrado: ${fullPath}`);
    process.exit(1);
  }
  
  // Mostrar información de la migración
  console.log('\n📋 Información de la migración:');
  console.log(`🎯 Entorno: ${env}`);
  console.log(`📁 Archivo: ${fullPath}`);
  console.log(`🌐 URL: ${environments[env].url}`);
  
  // Confirmar en producción
  if (env === 'production') {
    console.log('\n⚠️  ADVERTENCIA: Estás a punto de ejecutar una migración en PRODUCCIÓN');
    const confirmed = await askConfirmation('¿Estás seguro de que quieres continuar? (y/N): ');
    
    if (!confirmed) {
      console.log('❌ Migración cancelada');
      process.exit(0);
    }
  }
  
  await runMigration(env, fullPath);
}

// Ejecutar script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runMigration, createSupabaseClient };