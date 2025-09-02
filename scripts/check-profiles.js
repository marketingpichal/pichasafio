import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfiles() {
  try {
    console.log('Checking profiles table...');
    
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, created_at')
      .limit(10);
    
    if (error) {
      console.error('Error fetching profiles:', error);
      return;
    }
    
    console.log('\nProfiles found:');
    profiles.forEach(profile => {
      console.log(`ID: ${profile.id}`);
      console.log(`Username: ${profile.username || 'NULL'}`);
      console.log(`Created: ${profile.created_at}`);
      console.log('---');
    });
    
    // Check for profiles without username
    const profilesWithoutUsername = profiles.filter(p => !p.username);
    console.log(`\nProfiles without username: ${profilesWithoutUsername.length}`);
    
    if (profilesWithoutUsername.length > 0) {
      console.log('Profiles missing username:');
      profilesWithoutUsername.forEach(profile => {
        console.log(`- ID: ${profile.id}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkProfiles();