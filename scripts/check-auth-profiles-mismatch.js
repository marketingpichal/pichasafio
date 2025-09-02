import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.development' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase configuration');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SUPABASE')));
  process.exit(1);
}

// Use service role key to access auth.users
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAuthProfilesMismatch() {
  try {
    console.log('🔍 Checking auth.users vs profiles mismatch...');
    
    // Get all users from auth.users (requires service role)
    console.log('\n1️⃣ Getting users from auth.users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error getting auth users:', authError);
      return;
    }
    
    console.log(`✅ Found ${authUsers.users.length} users in auth.users`);
    authUsers.users.forEach(user => {
      console.log(`   - ${user.email} (ID: ${user.id})`);
    });
    
    // Get all profiles
    console.log('\n2️⃣ Getting profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, username, email');
    
    if (profilesError) {
      console.error('❌ Error getting profiles:', profilesError);
      return;
    }
    
    console.log(`✅ Found ${profiles.length} profiles`);
    profiles.forEach(profile => {
      console.log(`   - ${profile.email || 'no email'} / ${profile.username || 'no username'} (ID: ${profile.id})`);
    });
    
    // Check for mismatches
    console.log('\n3️⃣ Checking for mismatches...');
    
    // Users in auth.users but not in profiles
    const authUserIds = authUsers.users.map(u => u.id);
    const profileIds = profiles.map(p => p.id);
    
    const usersWithoutProfiles = authUserIds.filter(id => !profileIds.includes(id));
    const profilesWithoutUsers = profileIds.filter(id => !authUserIds.includes(id));
    
    if (usersWithoutProfiles.length > 0) {
      console.log('❌ Users in auth.users but NOT in profiles:');
      usersWithoutProfiles.forEach(userId => {
        const user = authUsers.users.find(u => u.id === userId);
        console.log(`   - ${user?.email} (ID: ${userId})`);
      });
      console.log('💡 This would cause complete-profile redirects!');
    } else {
      console.log('✅ All auth users have profiles');
    }
    
    if (profilesWithoutUsers.length > 0) {
      console.log('⚠️ Profiles without corresponding auth users:');
      profilesWithoutUsers.forEach(profileId => {
        const profile = profiles.find(p => p.id === profileId);
        console.log(`   - ${profile?.email || 'no email'} (ID: ${profileId})`);
      });
    } else {
      console.log('✅ All profiles have corresponding auth users');
    }
    
    // Check for profiles with missing usernames
    console.log('\n4️⃣ Checking for profiles with missing usernames...');
    const profilesWithoutUsername = profiles.filter(p => !p.username);
    
    if (profilesWithoutUsername.length > 0) {
      console.log('❌ Profiles without username:');
      profilesWithoutUsername.forEach(profile => {
        console.log(`   - ${profile.email || 'no email'} (ID: ${profile.id})`);
      });
      console.log('💡 These would also cause complete-profile redirects!');
    } else {
      console.log('✅ All profiles have usernames');
    }
    
    // Summary and recommendations
    console.log('\n📋 Summary and Recommendations:');
    console.log('='.repeat(60));
    
    if (usersWithoutProfiles.length > 0) {
      console.log('🔧 Fix: Create profiles for users without them');
      console.log('   Run this SQL in Supabase Dashboard:');
      usersWithoutProfiles.forEach(userId => {
        const user = authUsers.users.find(u => u.id === userId);
        console.log(`   INSERT INTO profiles (id, email) VALUES ('${userId}', '${user?.email}');`);
      });
    }
    
    if (profilesWithoutUsername.length > 0) {
      console.log('🔧 Fix: Add usernames to profiles without them');
      console.log('   Run this SQL in Supabase Dashboard:');
      profilesWithoutUsername.forEach(profile => {
        const suggestedUsername = profile.email?.split('@')[0] || `user_${profile.id.slice(0, 8)}`;
        console.log(`   UPDATE profiles SET username = '${suggestedUsername}' WHERE id = '${profile.id}';`);
      });
    }
    
    if (usersWithoutProfiles.length === 0 && profilesWithoutUsername.length === 0) {
      console.log('✅ No issues found with auth/profiles relationship');
      console.log('💡 The complete-profile redirect might be caused by:');
      console.log('   1. User not being logged in');
      console.log('   2. Browser cache issues');
      console.log('   3. Frontend authentication state problems');
      console.log('\n🔧 Next steps:');
      console.log('   1. Make sure to login at http://localhost:3002/login');
      console.log('   2. Check browser console for AuthProvider debug logs');
      console.log('   3. Try hard refresh (Cmd+Shift+R) to clear cache');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

checkAuthProfilesMismatch();