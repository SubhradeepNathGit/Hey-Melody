// Temporary script to check Supabase connection
/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');

async function checkSupabaseConnection() {
  console.log('Checking Supabase Connection...\n');

  // Check environment variables
  const supabaseURL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log(' Environment Variables:');
  console.log(`   NEXT_PUBLIC_SUPABASE_URL: ${supabaseURL ? '✅ SET' : '❌ NOT SET'}`);
  if (supabaseURL) {
    console.log(`   URL Value: ${supabaseURL.substring(0, 30)}...`);
  }
  console.log(`   NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? '✅ SET' : '❌ NOT SET'}`);
  console.log('');

  if (!supabaseURL || !supabaseAnonKey) {
    console.log('OR: Missing required environment variables!');
    console.log('   Please create a .env.local file with:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
    console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
    return false;
  }

  // Try to create client
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient(supabaseURL, supabaseAnonKey);
    console.log(' Client created successfully\n');

    // Try to ping Supabase (check health)
    console.log('Testing connection to Supabase...');
    const { data, error } = await supabase.auth.getSession();

    if (error && error.message.includes('Invalid API key')) {
      console.log(' Connection failed: Invalid API key');
      return false;
    }

    // If we get here, the connection is working
    console.log('Connection successful!');
    console.log(`   Session status: ${data?.session ? 'Active' : 'No active session'}`);
    return true;

  } catch (err) {
    console.log('Connection failed:', err.message);
    return false;
  }
}

checkSupabaseConnection().then(success => {
  if (success) {
    console.log('\nSupabase is properly configured!');
    process.exit(0);
  } else {
    console.log('\nSupabase connection check failed!');
    process.exit(1);
  }
});





