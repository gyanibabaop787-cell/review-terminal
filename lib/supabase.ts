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
    business_name: 'The Grand Plaza',
    slug: 'the-grand-plaza',
    logo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop',
    google_review_url: 'https://google.com'
  },
  {
    id: '2',
    business_name: 'Lumina Salon',
    slug: 'lumina-salon',
    logo_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
    google_review_url: 'https://google.com'
  },
  {
    id: '3',
    business_name: 'Danial',
    slug: 'danial',
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

export async function createBusiness(businessData: { slug: string, business_name: string, logo_url: string, google_review_url: string, category?: string }) {
  if (supabase) {
    // We intentionally omit 'category' from the payload to prevent schema errors 
    // since the database table doesn't have a category column yet.
    const payload = {
      slug: businessData.slug,
      business_name: businessData.business_name,
      logo_url: businessData.logo_url,
      google_review_url: businessData.google_review_url
    };

    const { data, error } = await supabase
      .from('businesses')
      .insert([payload])
      .select()
      .single();
      
    if (error) {
      if (error.code === '23505') {
        throw new Error('A business with this generated URL slug already exists. Try slightly changing the business name.');
      }
      throw error;
    }
    return data;
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return { id: 'mock-id', ...businessData };
}

export async function getAllBusinesses() {
  if (supabase) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
  return MOCK_BUSINESSES;
}

export async function getFeedbackByBusinessId(businessId: string) {
  if (supabase) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    return data || [];
  }
  
  // Mock fallback
  return [
    { id: '1', rating: 5, message: 'Positive: The service was outstanding and extremely prompt.', created_at: new Date().toISOString() },
    { id: '2', rating: 2, message: 'Negative: The service was incredibly slow and frustrating.', created_at: new Date(Date.now() - 86400000).toISOString() }
  ];
}

export async function uploadLogo(file: File) {
  if (!supabase) {
    // Mock upload URL for offline development
    return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=200&fit=crop';
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('logos')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Upload Error Details:', uploadError);
    throw new Error('Image upload failed. Ensure you have created a public bucket named "logos" in Supabase Storage.');
  }

  const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
  return data.publicUrl;
}

export async function registerUser(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function loginUser(email: string, password: string) {
  if (!supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function logoutUser() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function deleteFeedback(id: string) {
  if (supabase) {
    const { error, count } = await supabase
      .from('feedback')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) throw error;
    if (count === 0) {
      throw new Error("Could not delete. Make sure you have a Supabase RLS Policy allowing 'DELETE' on the 'feedback' table.");
    }
    return;
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function deleteAllFeedbackByBusinessId(businessId: string) {
  if (supabase) {
    const { error, count } = await supabase
      .from('feedback')
      .delete({ count: 'exact' })
      .eq('business_id', businessId);
    if (error) throw error;
    if (count === 0) {
      throw new Error("Could not delete. Make sure you have a Supabase RLS Policy allowing 'DELETE' on the 'feedback' table.");
    }
    return;
  }
  await new Promise(resolve => setTimeout(resolve, 500));
}
