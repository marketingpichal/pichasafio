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

async function debugLeaderboard() {
  try {
    console.log('🔍 Debugging leaderboard loading issue...');
    
    // Test 1: Check if leaderboard table exists and has data
    console.log('\n1️⃣ Checking leaderboard table...');
    const { data: leaderboardData, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false });
    
    if (leaderboardError) {
      console.error('❌ Error fetching leaderboard:', leaderboardError);
      return;
    }
    
    console.log(`✅ Leaderboard table exists with ${leaderboardData?.length || 0} entries`);
    
    if (leaderboardData && leaderboardData.length > 0) {
      console.log('📊 Leaderboard entries:');
      leaderboardData.forEach((entry, index) => {
        console.log(`  ${index + 1}. User ID: ${entry.user_id}`);
        console.log(`     Username: ${entry.username || 'N/A'}`);
        console.log(`     Points: ${entry.total_points}`);
        console.log(`     Level: ${entry.level}`);
        console.log('---');
      });
    } else {
      console.log('⚠️ No data in leaderboard table');
    }
    
    // Test 2: Check profiles table for usernames
    console.log('\n2️⃣ Checking profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
    } else {
      console.log(`✅ Profiles table has ${profilesData?.length || 0} entries`);
      profilesData?.forEach(profile => {
        console.log(`  - ${profile.id}: ${profile.username || 'No username'}`);
      });
    }
    
    // Test 3: Simulate the challengeService.getLeaderboard function
    console.log('\n3️⃣ Simulating challengeService.getLeaderboard...');
    
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error in leaderboard query:', error);
      return;
    }

    console.log(`✅ Query successful, got ${data?.length || 0} entries`);

    // Get usernames from profiles
    const userIds = (data || []).map(entry => entry.user_id);
    console.log(`🔍 Looking up usernames for user IDs: ${userIds.join(', ')}`);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);

    if (profileError) {
      console.error('❌ Error fetching usernames:', profileError);
    } else {
      console.log(`✅ Found ${profiles?.length || 0} profiles`);
    }

    // Create username map
    const usernameMap = {};
    profiles?.forEach(profile => {
      usernameMap[profile.id] = profile.username;
    });

    // Map the data
    const leaderboardResult = (data || []).map(entry => ({
      ...entry,
      username: usernameMap[entry.user_id] || null
    }));

    console.log('\n🏆 Final leaderboard result:');
    leaderboardResult.forEach((entry, index) => {
      console.log(`  ${index + 1}. ${entry.username || 'No username'}: ${entry.total_points} points (Level ${entry.level})`);
    });
    
    // Test 4: Check if there are any console errors in the browser
    console.log('\n4️⃣ Recommendations:');
    console.log('- Check browser console for JavaScript errors');
    console.log('- Verify network requests in browser dev tools');
    console.log('- Check if the LeaderboardTable component is properly mounted');
    console.log('- Verify Supabase client configuration in the frontend');
    
    if (leaderboardResult.length === 0) {
      console.log('\n⚠️ No leaderboard data found. Creating test data...');
      
      // Get first profile to create test data
      const { data: firstProfile } = await supabase
        .from('profiles')
        .select('id, username')
        .limit(1)
        .single();
      
      if (firstProfile) {
        const testEntry = {
          user_id: firstProfile.id,
          username: firstProfile.username || 'TestUser',
          total_points: 100,
          level: 2,
          rank: 'Bronze',
          challenges_completed: 1,
          current_streak: 1,
          longest_streak: 1,
          total_sessions: 1,
          total_minutes: 30,
          last_activity: new Date().toISOString(),
          achievements: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert(testEntry);
        
        if (insertError) {
          console.error('❌ Error creating test data:', insertError);
        } else {
          console.log('✅ Test leaderboard entry created');
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug error:', error);
  }
}

debugLeaderboard();