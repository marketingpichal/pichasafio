import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function createCommentsTable() {
  try {
    console.log('Creating comments table...');
    
    // Create the function to execute SQL
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION create_comments_table_and_setup()
      RETURNS TEXT AS $$
      BEGIN
        -- Create comments table
        CREATE TABLE IF NOT EXISTS public.comments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
          user_id UUID NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Create indexes
        CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);
        CREATE INDEX IF NOT EXISTS idx_comments_user_id ON public.comments(user_id);
        CREATE INDEX IF NOT EXISTS idx_comments_created_at ON public.comments(created_at);
        
        -- Enable RLS
        ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Comments are viewable by everyone" ON public.comments;
        DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
        DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
        DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;
        
        -- Create RLS policies
        CREATE POLICY "Comments are viewable by everyone" ON public.comments
          FOR SELECT USING (true);
        
        CREATE POLICY "Users can insert their own comments" ON public.comments
          FOR INSERT WITH CHECK (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own comments" ON public.comments
          FOR UPDATE USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can delete their own comments" ON public.comments
          FOR DELETE USING (auth.uid() = user_id);
        
        -- Create trigger function to update comments count
        CREATE OR REPLACE FUNCTION update_post_comments_count()
        RETURNS TRIGGER AS $trigger$
        BEGIN
          IF TG_OP = 'INSERT' THEN
            UPDATE public.posts 
            SET comments_count = comments_count + 1 
            WHERE id = NEW.post_id;
            RETURN NEW;
          ELSIF TG_OP = 'DELETE' THEN
            UPDATE public.posts 
            SET comments_count = comments_count - 1 
            WHERE id = OLD.post_id;
            RETURN OLD;
          END IF;
          RETURN NULL;
        END;
        $trigger$ LANGUAGE plpgsql;
        
        -- Drop existing triggers if they exist
        DROP TRIGGER IF EXISTS trigger_update_comments_count_insert ON public.comments;
        DROP TRIGGER IF EXISTS trigger_update_comments_count_delete ON public.comments;
        
        -- Create triggers
        CREATE TRIGGER trigger_update_comments_count_insert
          AFTER INSERT ON public.comments
          FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
        
        CREATE TRIGGER trigger_update_comments_count_delete
          AFTER DELETE ON public.comments
          FOR EACH ROW EXECUTE FUNCTION update_post_comments_count();
        
        RETURN 'Comments table and setup completed successfully!';
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // First create the function
    const { error: functionError } = await supabase.rpc('create_comments_table_and_setup');
    
    if (functionError && functionError.message.includes('function "create_comments_table_and_setup" does not exist')) {
      console.log('Function does not exist, trying to create it...');
      // The function doesn't exist, so we need to create it first
      // This is a chicken-and-egg problem, so let's try a different approach
      
      // Let's try to create the table directly using insert operations
      console.log('Attempting to create table using direct operations...');
      
      // Try to create a simple comment to test if table exists
      const { error: testError } = await supabase
        .from('comments')
        .select('id')
        .limit(1);
      
      if (testError && testError.message.includes('does not exist')) {
        console.log('Table does not exist. Please create it manually in Supabase Dashboard.');
        console.log('Go to: https://supabase.com/dashboard/project/[your-project-id]/editor');
        console.log('And run the SQL provided in the previous script.');
        return;
      }
    } else if (functionError) {
      console.error('Error calling function:', functionError);
      return;
    } else {
      console.log('Comments table setup completed successfully!');
    }
    
    // Test the table
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error testing comments table:', error);
    } else {
      console.log('Comments table is working correctly!');
      console.log('Found', data.length, 'existing comments');
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createCommentsTable();