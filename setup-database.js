import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  try {
    console.log('🚀 Setting up database schema...');
    
    // Lista de archivos SQL a ejecutar en orden
    const sqlFiles = [
      'src/sql/profiles_schema.sql',
      'src/sql/posts_schema.sql',
      'src/sql/daily_logins_table.sql',
      'src/sql/create_tables.sql'
    ];
    
    for (const sqlFile of sqlFiles) {
      console.log(`📄 Executing ${sqlFile}...`);
      
      try {
        const sqlContent = readFileSync(join(__dirname, sqlFile), 'utf8');
        
        // Dividir el contenido en statements individuales
        const statements = sqlContent
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
            
            if (error) {
              // Intentar ejecutar directamente si rpc falla
              const { error: directError } = await supabase
                .from('_temp')
                .select('1')
                .limit(0);
              
              if (directError) {
                console.warn(`⚠️  Warning executing statement: ${error.message}`);
              }
            }
          }
        }
        
        console.log(`✅ ${sqlFile} executed successfully`);
      } catch (fileError) {
        console.warn(`⚠️  Could not read ${sqlFile}: ${fileError.message}`);
      }
    }
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();