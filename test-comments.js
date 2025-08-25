import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testComments() {
  try {
    console.log('Testing comments functionality...');
    
    // First, let's check if we can read from comments table
    const { data: comments, error: readError } = await supabase
      .from('comments')
      .select('*')
      .limit(5);
    
    if (readError) {
      console.error('Error reading comments:', readError);
      return;
    }
    
    console.log('Existing comments:', comments);
    
    // Check if we can get posts to test with
    const { data: posts, error: postsError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);
    
    if (postsError) {
      console.error('Error reading posts:', postsError);
      return;
    }
    
    if (posts.length === 0) {
      console.log('No posts found to test with');
      return;
    }
    
    console.log('Found post to test with:', posts[0].id);
    
    // Try to insert a test comment
    const testComment = {
      post_id: posts[0].id,
      user_id: '834bb75e-d140-405d-b407-bb7669bb7f77',
      content: 'Test comment from script'
    };
    
    const { data: newComment, error: insertError } = await supabase
      .from('comments')
      .insert(testComment)
      .select('*')
      .single();
    
    if (insertError) {
      console.error('Error inserting comment:', insertError);
      return;
    }
    
    console.log('Successfully inserted comment:', newComment);
    
    // Clean up - delete the test comment
    const { error: deleteError } = await supabase
      .from('comments')
      .delete()
      .eq('id', newComment.id);
    
    if (deleteError) {
      console.error('Error deleting test comment:', deleteError);
    } else {
      console.log('Test comment cleaned up successfully');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testComments();