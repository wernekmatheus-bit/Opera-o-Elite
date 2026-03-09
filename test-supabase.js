const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://myktfxhdcrvyjcmaague.supabase.co';
const supabaseKey = 'sb_secret_8iBOUfEzXGmd66UBgUNE6Q_4NKvxr6t';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing Supabase connection...');
  const { data, error } = await supabase.from('whitelist').select('*').limit(1);
  if (error) {
    console.error('Supabase Error:', error);
  } else {
    console.log('Supabase Success:', data);
  }
}

test();
