const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://myktfxhdcrvyjcmaague.supabase.co';
const supabaseKey = 'sb_secret_8iBOUfEzXGmd66UBgUNE6Q_4NKvxr6t';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpsert() {
  console.log('Testing Supabase upsert without status...');
  const { data, error } = await supabase
    .from('whitelist')
    .upsert(
      { 
        email: 'test@example.com', 
        paid: true, 
      },
      { onConflict: 'email' }
    );
    
  if (error) {
    console.error('Supabase Upsert Error:', error);
  } else {
    console.log('Supabase Upsert Success:', data);
  }
}

testUpsert();
