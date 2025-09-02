import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthProviderLogic() {
  try {
    console.log('🔍 Testing AuthProvider logic...');
    
    // Simulate what AuthProvider does
    console.log('\n1️⃣ Getting user session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
      return;
    }
    
    if (!session || !session.user) {
      console.log('⚠️ No active session - user needs to login first');
      console.log('💡 Instructions:');
      console.log('   1. Go to http://localhost:3002/login');
      console.log('   2. Login with: juanperezagogo@icloud.com');
      console.log('   3. Check browser console for AuthProvider debug logs');
      return;
    }
    
    console.log('✅ User session found:', session.user.email);
    
    // Simulate the profile check that AuthProvider does
    console.log('\n2️⃣ Simulating AuthProvider profile check...');
    console.log('🔍 AuthProvider: Verificando perfil del usuario...', { 
      userId: session.user.id, 
      currentPath: '/' // Simulating root path
    });
    
    console.log('📡 AuthProvider: Consultando perfil en base de datos...');
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", session.user.id)
      .single();
    
    console.log('📊 AuthProvider: Resultado de consulta', { profile, error });
    
    if (error || !profile || !profile.username) {
      console.log('❌ AuthProvider: Perfil incompleto, redirigiendo...', { 
        error, 
        profile, 
        hasUsername: profile?.username 
      });
      console.log('🔄 AuthProvider: Would redirect to /complete-profile');
      
      // Analyze the issue
      if (error) {
        console.log('\n🔍 Error analysis:');
        console.log('   - Error code:', error.code);
        console.log('   - Error message:', error.message);
        
        if (error.code === 'PGRST116') {
          console.log('   - This means no profile was found for this user ID');
          console.log('   - The user exists in auth.users but not in profiles table');
        }
      }
      
      if (profile && !profile.username) {
        console.log('\n🔍 Profile analysis:');
        console.log('   - Profile exists but username is null/empty');
        console.log('   - This would trigger the complete-profile redirect');
      }
      
    } else {
      console.log('✅ AuthProvider: Perfil completo', { username: profile.username });
      console.log('✅ No redirect should happen');
    }
    
    // Additional check: verify the profile exists with all details
    console.log('\n3️⃣ Full profile verification...');
    const { data: fullProfile, error: fullError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (fullError) {
      console.error('❌ Full profile error:', fullError);
    } else {
      console.log('✅ Full profile data:', fullProfile);
    }
    
    console.log('\n📋 Summary:');
    console.log('='.repeat(50));
    if (error || !profile || !profile.username) {
      console.log('❌ Issue found: AuthProvider will redirect to complete-profile');
      console.log('🔧 Possible solutions:');
      if (error && error.code === 'PGRST116') {
        console.log('   1. Create a profile entry for this user');
        console.log('   2. Check if the user ID matches between auth.users and profiles');
      }
      if (profile && !profile.username) {
        console.log('   1. Update the profile to have a username');
        console.log('   2. Check why the username is null');
      }
    } else {
      console.log('✅ No issues found - AuthProvider should work correctly');
      console.log('💡 If you\'re still seeing the complete-profile page, check:');
      console.log('   1. Browser cache - try hard refresh (Cmd+Shift+R)');
      console.log('   2. Make sure you\'re logged in with the correct user');
      console.log('   3. Check browser console for actual AuthProvider logs');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuthProviderLogic();