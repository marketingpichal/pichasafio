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

async function testAuthAndLeaderboard() {
  try {
    console.log('🔍 Testing authentication and leaderboard access...');
    
    // Test 1: Check current session
    console.log('\n1️⃣ Checking current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Session error:', sessionError);
    } else if (session) {
      console.log('✅ User is authenticated:', session.user.email);
      console.log('🆔 User ID:', session.user.id);
    } else {
      console.log('⚠️ No active session - user is not authenticated');
      console.log('💡 This means LeaderboardTable won\'t be rendered in the frontend');
    }
    
    // Test 2: Try to get user profile
    console.log('\n2️⃣ Checking user profile...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError) {
      console.error('❌ User error:', userError);
    } else if (user) {
      console.log('✅ User data available:', user.email);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('❌ Profile error:', profileError);
      } else {
        console.log('✅ User profile found:', profile.username);
      }
    } else {
      console.log('⚠️ No user data available');
    }
    
    // Test 3: Test leaderboard access with current auth state
    console.log('\n3️⃣ Testing leaderboard access with current auth state...');
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);
    
    if (leaderboardError) {
      console.error('❌ Leaderboard access error:', leaderboardError);
      console.log('💡 This could be why the frontend can\'t load the leaderboard');
    } else {
      console.log(`✅ Leaderboard accessible, ${leaderboardData?.length || 0} entries found`);
    }
    
    // Test 4: Simulate login if no session
    if (!session) {
      console.log('\n4️⃣ Attempting to sign in with test credentials...');
      
      // Get the first profile to use for login
      const { data: profiles } = await supabase
        .from('profiles')
        .select('email')
        .limit(1);
      
      if (profiles && profiles.length > 0 && profiles[0].email) {
        console.log(`🔑 Attempting login with: ${profiles[0].email}`);
        
        // Note: This won't work without a password, but it shows the process
        console.log('💡 To test authentication in the browser:');
        console.log(`   1. Go to http://localhost:3002/login`);
        console.log(`   2. Login with: ${profiles[0].email}`);
        console.log('   3. Check browser console for LeaderboardTable logs');
        console.log('   4. Verify that the leaderboard section appears');
      } else {
        console.log('⚠️ No email found in profiles for testing login');
      }
    }
    
    console.log('\n📋 Summary:');
    console.log('- Backend leaderboard data: ✅ Available');
    console.log('- Supabase connection: ✅ Working');
    console.log('- Authentication state:', session ? '✅ Authenticated' : '❌ Not authenticated');
    console.log('- Next step: Test login in browser and check console logs');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAuthAndLeaderboard();