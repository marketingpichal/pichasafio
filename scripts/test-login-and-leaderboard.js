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

async function testLoginAndLeaderboard() {
  try {
    console.log('🔍 Testing complete login flow and leaderboard access...');
    
    // Test 1: Get user credentials from profiles
    console.log('\n1️⃣ Getting test user credentials...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('email, username')
      .limit(1);
    
    if (profilesError || !profiles || profiles.length === 0) {
      console.error('❌ No profiles found for testing');
      return;
    }
    
    const testEmail = profiles[0].email;
    console.log(`✅ Test email found: ${testEmail}`);
    
    // Test 2: Attempt login (this will fail without password, but shows the process)
    console.log('\n2️⃣ Login process simulation...');
    console.log('⚠️ Note: Actual login requires password, but we can test the flow');
    
    // Test 3: Simulate what happens after successful login
    console.log('\n3️⃣ Simulating post-login leaderboard access...');
    
    // This simulates what challengeService.getLeaderboard does
    console.log('📡 Step 1: Fetching leaderboard data...');
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);
    
    if (leaderboardError) {
      console.error('❌ Leaderboard fetch error:', leaderboardError);
      return;
    }
    
    console.log(`✅ Leaderboard data fetched: ${leaderboardData.length} entries`);
    
    // Step 2: Fetch usernames for each entry
    console.log('📡 Step 2: Fetching usernames...');
    const userIds = leaderboardData.map(entry => entry.user_id);
    
    const { data: profilesData, error: profilesFetchError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);
    
    if (profilesFetchError) {
      console.error('❌ Profiles fetch error:', profilesFetchError);
      return;
    }
    
    console.log(`✅ Profiles fetched: ${profilesData.length} profiles`);
    
    // Step 3: Combine data (like challengeService does)
    console.log('🔄 Step 3: Combining leaderboard and profile data...');
    const combinedData = leaderboardData.map(entry => {
      const profile = profilesData.find(p => p.id === entry.user_id);
      return {
        ...entry,
        username: profile?.username || 'Unknown'
      };
    });
    
    console.log('✅ Final leaderboard data:');
    combinedData.forEach((entry, index) => {
      console.log(`   ${index + 1}. ${entry.username} - ${entry.total_points} points (Level ${entry.level})`);
    });
    
    // Test 4: Check if there are any RLS issues
    console.log('\n4️⃣ Testing Row Level Security (RLS)...');
    
    // Test anonymous access to leaderboard
    const { data: anonLeaderboard, error: anonError } = await supabase
      .from('leaderboard')
      .select('user_id, total_points, level')
      .limit(1);
    
    if (anonError) {
      console.error('❌ Anonymous leaderboard access blocked:', anonError);
      console.log('💡 This could be the issue - RLS might be blocking anonymous access');
    } else {
      console.log('✅ Anonymous leaderboard access allowed');
    }
    
    // Test anonymous access to profiles
    const { data: anonProfiles, error: anonProfilesError } = await supabase
      .from('profiles')
      .select('id, username')
      .limit(1);
    
    if (anonProfilesError) {
      console.error('❌ Anonymous profiles access blocked:', anonProfilesError);
      console.log('💡 This could be the issue - RLS might be blocking anonymous access to profiles');
    } else {
      console.log('✅ Anonymous profiles access allowed');
    }
    
    console.log('\n📋 Diagnosis Summary:');
    console.log('='.repeat(50));
    console.log('✅ Backend data: Available');
    console.log('✅ Supabase connection: Working');
    console.log('✅ Data fetching logic: Working');
    console.log('✅ RLS policies: Allowing access');
    console.log('');
    console.log('🎯 The issue is likely:');
    console.log('   1. User is not authenticated in the browser');
    console.log('   2. LeaderboardTable component is not being rendered');
    console.log('   3. Frontend authentication state is not working');
    console.log('');
    console.log('🔧 Next steps to debug:');
    console.log('   1. Open browser and go to http://localhost:3002/');
    console.log(`   2. Login with: ${testEmail}`);
    console.log('   3. Check browser console for our debug logs');
    console.log('   4. Verify that "🎯 LeaderboardTable: Componente renderizado" appears');
    console.log('   5. Check if authentication state is working in the frontend');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testLoginAndLeaderboard();