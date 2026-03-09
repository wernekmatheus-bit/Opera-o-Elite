const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://myktfxhdcrvyjcmaague.supabase.co';
const supabaseKey = 'sb_secret_8iBOUfEzXGmd66UBgUNE6Q_4NKvxr6t';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  console.log('Fetching Supabase row...');
  const { data, error } = await supabase
    .from('whitelist')
    .select('*')
    .limit(1);
    
  if (error) {
    console.error('Supabase Fetch Error:', error);
  } else {
    console.log('Supabase Fetch Success:', data);
  }
}

testFetch();
