import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY; // Using anon key like frontend

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase configuration');
  console.log('VITE_SUPABASE_URL:', supabaseUrl);
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Present' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLeaderboardFrontend() {
  try {
    console.log('🔍 Testing leaderboard from frontend perspective...');
    console.log('🔗 Supabase URL:', supabaseUrl);
    console.log('🔑 Using anon key (like frontend)');
    
    // Test 1: Direct leaderboard query (like challengeService does)
    console.log('\n1️⃣ Testing direct leaderboard query...');
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error in leaderboard query:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return;
    }

    console.log(`✅ Query successful, got ${data?.length || 0} entries`);
    
    if (data && data.length > 0) {
      console.log('📊 Raw leaderboard data:');
      data.forEach((entry, index) => {
        console.log(`  ${index + 1}. User: ${entry.user_id}`);
        console.log(`     Username: ${entry.username || 'N/A'}`);
        console.log(`     Points: ${entry.total_points}`);
        console.log(`     Level: ${entry.level}`);
        console.log('---');
      });
    }

    // Test 2: Get usernames from profiles (like challengeService does)
    console.log('\n2️⃣ Testing profiles query for usernames...');
    const userIds = (data || []).map(entry => entry.user_id);
    
    if (userIds.length > 0) {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profileError) {
        console.error('❌ Error fetching usernames:', profileError);
        console.error('Profile error details:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });
      } else {
        console.log(`✅ Found ${profiles?.length || 0} profiles`);
        
        // Create username map
        const usernameMap = {};
        profiles?.forEach(profile => {
          usernameMap[profile.id] = profile.username;
          console.log(`  - ${profile.id}: ${profile.username || 'No username'}`);
        });

        // Map the data (like challengeService does)
        const leaderboardResult = (data || []).map(entry => ({
          ...entry,
          username: usernameMap[entry.user_id] || null
        }));

        console.log('\n🏆 Final mapped leaderboard:');
        leaderboardResult.forEach((entry, index) => {
          console.log(`  ${index + 1}. ${entry.username || 'No username'}: ${entry.total_points} points (Level ${entry.level})`);
        });
      }
    }
    
    // Test 3: Check RLS policies
    console.log('\n3️⃣ Testing Row Level Security policies...');
    
    // Test if we can read from leaderboard without auth
    const { data: testData, error: testError } = await supabase
      .from('leaderboard')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('❌ RLS might be blocking access:', testError.message);
      console.log('💡 This could be why the frontend can\'t load the leaderboard');
    } else {
      console.log('✅ RLS allows read access to leaderboard');
    }
    
    // Test profiles access
    const { data: profileTestData, error: profileTestError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
    
    if (profileTestError) {
      console.error('❌ RLS might be blocking profiles access:', profileTestError.message);
    } else {
      console.log('✅ RLS allows read access to profiles');
    }
    
    console.log('\n✅ Frontend leaderboard test completed!');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testLeaderboardFrontend();