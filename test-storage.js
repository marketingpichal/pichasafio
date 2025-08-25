// Script para probar Supabase Storage
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testStorage() {
  try {
    console.log('Testing Supabase Storage...');
    
    // 1. Listar buckets
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.error('Error listing buckets:', bucketsError);
      return;
    }
    
    console.log('Available buckets:', buckets.map(b => b.name));
    
    // 2. Verificar si existe el bucket 'posts'
    const postsBucket = buckets.find(b => b.name === 'posts');
    
    if (!postsBucket) {
      console.log('❌ Bucket "posts" not found!');
      console.log('Available buckets:', buckets.map(b => b.name));
      return;
    }
    
    console.log('✅ Bucket "posts" found!');
    
    // 3. Intentar crear un archivo de prueba
    const testFile = new Blob(['test content'], { type: 'text/plain' });
    const fileName = `test-${Date.now()}.txt`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('posts')
      .upload(fileName, testFile);
    
    if (uploadError) {
      console.error('❌ Error uploading test file:', uploadError);
      return;
    }
    
    console.log('✅ Test file uploaded successfully:', uploadData);
    
    // 4. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('posts')
      .getPublicUrl(fileName);
    
    console.log('✅ Public URL:', urlData.publicUrl);
    
    // 5. Limpiar - eliminar archivo de prueba
    const { error: deleteError } = await supabase.storage
      .from('posts')
      .remove([fileName]);
    
    if (deleteError) {
      console.error('⚠️ Error deleting test file:', deleteError);
    } else {
      console.log('✅ Test file deleted successfully');
    }
    
  } catch (error) {
    console.error('❌ General error:', error);
  }
}

testStorage();