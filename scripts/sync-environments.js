#!/usr/bin/env node

/**
 * Script para sincronizar cambios entre entornos
 * Permite copiar esquemas, datos y configuraciones
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

// Función para exportar esquema
async function exportSchema(env, outputFile) {
  try {
    console.log(`📤 Exportando esquema desde ${env}...`);
    
    const supabase = createSupabaseClient(env);
    
    // Obtener información de tablas
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .neq('table_name', 'spatial_ref_sys'); // Excluir tabla del sistema
    
    if (tablesError) throw tablesError;
    
    console.log(`📊 Encontradas ${tables.length} tablas`);
    
    // Generar SQL para recrear tablas
    let sql = '-- Esquema exportado desde ' + env + '\n';
    sql += '-- Fecha: ' + new Date().toISOString() + '\n\n';
    
    for (const table of tables) {
      console.log(`🔍 Procesando tabla: ${table.table_name}`);
      
      // Obtener definición de la tabla (esto es simplificado)
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select('column_name, data_type, is_nullable, column_default')
        .eq('table_schema', 'public')
        .eq('table_name', table.table_name)
        .order('ordinal_position');
      
      if (columnsError) throw columnsError;
      
      sql += `-- Tabla: ${table.table_name}\n`;
      sql += `CREATE TABLE IF NOT EXISTS ${table.table_name} (\n`;
      
      const columnDefs = columns.map(col => {
        let def = `  ${col.column_name} ${col.data_type}`;
        if (col.is_nullable === 'NO') def += ' NOT NULL';
        if (col.column_default) def += ` DEFAULT ${col.column_default}`;
        return def;
      });
      
      sql += columnDefs.join(',\n');
      sql += '\n);\n\n';
    }
    
    // Guardar archivo
    fs.writeFileSync(outputFile, sql);
    console.log(`✅ Esquema exportado a: ${outputFile}`);
    
  } catch (error) {
    console.error(`❌ Error exportando esquema:`, error.message);
    throw error;
  }
}

// Función para comparar entornos
async function compareEnvironments() {
  try {
    console.log('🔍 Comparando entornos...');
    
    const devClient = createSupabaseClient('development');
    const prodClient = createSupabaseClient('production');
    
    // Obtener tablas de cada entorno
    const [devTables, prodTables] = await Promise.all([
      devClient.from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public'),
      prodClient.from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
    ]);
    
    if (devTables.error) throw devTables.error;
    if (prodTables.error) throw prodTables.error;
    
    const devTableNames = new Set(devTables.data.map(t => t.table_name));
    const prodTableNames = new Set(prodTables.data.map(t => t.table_name));
    
    // Encontrar diferencias
    const onlyInDev = [...devTableNames].filter(t => !prodTableNames.has(t));
    const onlyInProd = [...prodTableNames].filter(t => !devTableNames.has(t));
    const common = [...devTableNames].filter(t => prodTableNames.has(t));
    
    console.log('\n📊 Comparación de entornos:');
    console.log(`🟢 Tablas comunes: ${common.length}`);
    console.log(`🔵 Solo en desarrollo: ${onlyInDev.length}`);
    console.log(`🔴 Solo en producción: ${onlyInProd.length}`);
    
    if (onlyInDev.length > 0) {
      console.log('\n🔵 Tablas solo en desarrollo:');
      onlyInDev.forEach(table => console.log(`  - ${table}`));
    }
    
    if (onlyInProd.length > 0) {
      console.log('\n🔴 Tablas solo en producción:');
      onlyInProd.forEach(table => console.log(`  - ${table}`));
    }
    
  } catch (error) {
    console.error(`❌ Error comparando entornos:`, error.message);
    throw error;
  }
}

// Función principal
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Uso: node sync-environments.js <comando> [opciones]');
    console.log('\nComandos disponibles:');
    console.log('  compare                    - Comparar esquemas entre entornos');
    console.log('  export <env> <archivo>     - Exportar esquema de un entorno');
    console.log('  sync <origen> <destino>    - Sincronizar de origen a destino');
    console.log('\nEjemplos:');
    console.log('  node sync-environments.js compare');
    console.log('  node sync-environments.js export development schema-dev.sql');
    console.log('  node sync-environments.js sync development production');
    process.exit(1);
  }
  
  const [command, ...commandArgs] = args;
  
  switch (command) {
    case 'compare':
      await compareEnvironments();
      break;
      
    case 'export':
      if (commandArgs.length < 2) {
        console.error('❌ Uso: export <entorno> <archivo>');
        process.exit(1);
      }
      const [env, outputFile] = commandArgs;
      if (!environments[env]) {
        console.error(`❌ Entorno no válido: ${env}`);
        process.exit(1);
      }
      await exportSchema(env, outputFile);
      break;
      
    case 'sync':
      if (commandArgs.length < 2) {
        console.error('❌ Uso: sync <origen> <destino>');
        process.exit(1);
      }
      const [source, target] = commandArgs;
      if (!environments[source] || !environments[target]) {
        console.error('❌ Entornos no válidos');
        process.exit(1);
      }
      
      console.log(`⚠️  ADVERTENCIA: Vas a sincronizar desde ${source} hacia ${target}`);
      const confirmed = await askConfirmation('¿Continuar? (y/N): ');
      
      if (!confirmed) {
        console.log('❌ Sincronización cancelada');
        process.exit(0);
      }
      
      // Exportar desde origen y aplicar a destino
      const tempFile = `temp-schema-${Date.now()}.sql`;
      await exportSchema(source, tempFile);
      
      console.log(`🔄 Aplicando cambios a ${target}...`);
      // Aquí se aplicaría el esquema al entorno destino
      // Por seguridad, solo exportamos por ahora
      console.log(`✅ Esquema exportado. Aplica manualmente: ${tempFile}`);
      
      break;
      
    default:
      console.error(`❌ Comando no reconocido: ${command}`);
      process.exit(1);
  }
}

// Ejecutar script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { exportSchema, compareEnvironments };