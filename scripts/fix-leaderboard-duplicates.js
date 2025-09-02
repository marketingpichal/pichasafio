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

async function fixLeaderboardDuplicates() {
  try {
    console.log('Checking for duplicate entries in leaderboard...');
    
    // Get all leaderboard entries
    const { data: allEntries, error: fetchError } = await supabase
      .from('leaderboard')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (fetchError) {
      console.error('Error fetching leaderboard:', fetchError);
      return;
    }
    
    console.log(`Total entries found: ${allEntries.length}`);
    
    // Group by user_id to find duplicates
    const userGroups = {};
    allEntries.forEach(entry => {
      if (!userGroups[entry.user_id]) {
        userGroups[entry.user_id] = [];
      }
      userGroups[entry.user_id].push(entry);
    });
    
    // Find users with duplicates
    const duplicateUsers = Object.keys(userGroups).filter(userId => userGroups[userId].length > 1);
    
    console.log(`Users with duplicate entries: ${duplicateUsers.length}`);
    
    if (duplicateUsers.length === 0) {
      console.log('No duplicates found!');
      return;
    }
    
    // Process each user with duplicates
    for (const userId of duplicateUsers) {
      const entries = userGroups[userId];
      console.log(`\nProcessing user ${userId} with ${entries.length} entries:`);
      
      // Sort by updated_at to keep the most recent
      entries.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
      
      const keepEntry = entries[0]; // Most recent
      const deleteEntries = entries.slice(1); // All others
      
      console.log(`Keeping entry with ${keepEntry.total_points} points (${keepEntry.updated_at || keepEntry.created_at})`);
      console.log(`Deleting ${deleteEntries.length} duplicate entries`);
      
      // Delete duplicate entries
      for (const entry of deleteEntries) {
        const { error: deleteError } = await supabase
          .from('leaderboard')
          .delete()
          .eq('id', entry.id);
        
        if (deleteError) {
          console.error(`Error deleting entry ${entry.id}:`, deleteError);
        } else {
          console.log(`✅ Deleted duplicate entry with ${entry.total_points} points`);
        }
      }
    }
    
    // Verify cleanup
    console.log('\nVerifying cleanup...');
    const { data: cleanedEntries, error: verifyError } = await supabase
      .from('leaderboard')
      .select('user_id, username, total_points, level')
      .order('total_points', { ascending: false });
    
    if (verifyError) {
      console.error('Error verifying cleanup:', verifyError);
      return;
    }
    
    console.log('\nCleaned leaderboard:');
    cleanedEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.username}: ${entry.total_points} XP (Level ${entry.level})`);
    });
    
    // Check for remaining duplicates
    const userIds = cleanedEntries.map(e => e.user_id);
    const uniqueUserIds = [...new Set(userIds)];
    
    if (userIds.length === uniqueUserIds.length) {
      console.log('\n✅ All duplicates successfully removed!');
    } else {
      console.log('\n⚠️ Some duplicates may still exist');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixLeaderboardDuplicates();