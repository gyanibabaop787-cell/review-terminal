import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a real client if env vars are present, otherwise null.
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

// Mock data for development when Supabase is not connected
export const MOCK_BUSINESSES = [
  {
    id: '1',
    business_name: 'Bhandara Park Hotel',
    slug: 'bhandara-park-hotel',
    logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop',
    google_review_url: 'https://google.com'
  },
  {
    id: '2',
    business_name: 'Kalpna Restaurant',
    slug: 'kalpna-restaurant',
    logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    google_review_url: 'https://google.com'
  }
];

export async function getBusinessBySlug(slug: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return data;
  }
  
  // Fallback to mock
  const business = MOCK_BUSINESSES.find(b => b.slug === slug);
  if (!business) throw new Error('Business not found');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return business;
}

export async function submitFeedback(businessId: string, rating: number, message: string) {
  if (supabase) {
    const { error } = await supabase
      .from('feedback')
      .insert([
        { business_id: businessId, rating, message }
      ]);
    if (error) throw error;
    return;
  }
  
  // Mock success
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('Feedback submitted:', { businessId, rating, message });
}

export async function createBusiness(businessData: { slug: string, business_name: string, logo_url: string, google_review_url: string }) {
  if (supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .insert([businessData])
      .select()
      .single();
      
    if (error) {
      // If it's a unique constraint error on slug, we might want to tell the user
      if (error.code === '23505') {
        throw new Error('A business with this generated URL slug already exists. Try slightly changing the business name.');
      }
      throw error;
    }
    return data;
  }
  
  // Mock success
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id: 'mock-id', ...businessData };
}
