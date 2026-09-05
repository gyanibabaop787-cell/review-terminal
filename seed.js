const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://xvqfkgilmwselwdnfjpl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2cWZrZ2lsbXdzZWx3ZG5manBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NzMxNzQsImV4cCI6MjEwMzU0OTE3NH0.RfSDR4MRecuqw-uRDcH2TIHbyC-Qr3kUBw4tcTLLGCc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const payload = {
    slug: 'danial',
    business_name: 'Danial',
    logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    google_review_url: 'https://google.com'
  };

  const { data, error } = await supabase
    .from('businesses')
    .insert([payload]);
    
  if (error) {
    console.error(error);
  } else {
    console.log('Inserted successfully!');
  }
}
run();
