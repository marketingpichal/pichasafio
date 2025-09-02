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

async function testRouletteXP() {
  try {
    console.log('Testing roulette XP update...');
    
    // Get current user from leaderboard
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(1)
      .single();
    
    if (leaderboardError || !leaderboard) {
      console.error('No leaderboard entry found:', leaderboardError);
      return;
    }
    
    console.log('\nCurrent leaderboard entry:');
    console.log(`User ID: ${leaderboard.user_id}`);
    console.log(`Username: ${leaderboard.username}`);
    console.log(`Current Points: ${leaderboard.total_points}`);
    console.log(`Current Level: ${leaderboard.level}`);
    console.log(`Last Activity: ${leaderboard.last_activity}`);
    
    // Simulate winning 25 XP from roulette
    const xpToAdd = 25;
    const newPoints = leaderboard.total_points + xpToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1;
    const now = new Date().toISOString();
    
    console.log(`\nSimulating roulette win of ${xpToAdd} XP...`);
    
    // Update leaderboard (same logic as SpinWheel)
    const { error: updateError } = await supabase
      .from('leaderboard')
      .update({
        total_points: newPoints,
        level: newLevel,
        last_activity: now,
        updated_at: now
      })
      .eq('user_id', leaderboard.user_id);
    
    if (updateError) {
      console.error('Error updating leaderboard:', updateError);
      return;
    }
    
    console.log('✅ Update successful!');
    
    // Verify the update
    const { data: updatedLeaderboard, error: verifyError } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', leaderboard.user_id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();
    
    if (verifyError) {
      console.error('Error verifying update:', verifyError);
      return;
    }
    
    console.log('\nUpdated leaderboard entry:');
    console.log(`User ID: ${updatedLeaderboard.user_id}`);
    console.log(`Username: ${updatedLeaderboard.username}`);
    console.log(`New Points: ${updatedLeaderboard.total_points} (+${xpToAdd})`);
    console.log(`New Level: ${updatedLeaderboard.level}`);
    console.log(`Last Activity: ${updatedLeaderboard.last_activity}`);
    
    // Check if the change is visible in the UI by querying the leaderboard view
    console.log('\nChecking leaderboard visibility...');
    const { data: leaderboardView, error: viewError } = await supabase
      .from('leaderboard')
      .select('username, total_points, level')
      .order('total_points', { ascending: false })
      .limit(5);
    
    if (viewError) {
      console.error('Error fetching leaderboard view:', viewError);
      return;
    }
    
    console.log('\nTop 5 leaderboard:');
    leaderboardView.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.username}: ${entry.total_points} XP (Level ${entry.level})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testRouletteXP();