import { getBusinessBySlug } from '@/lib/supabase';
import ReviewFlow from '@/components/ReviewFlow';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const business = await getBusinessBySlug(params.slug);
    return {
      title: `Review ${business.business_name} | TW WILL`,
    };
  } catch {
    return { title: 'Not Found | TW WILL' };
  }
}

export default async function ReviewPage({ params }: Props) {
  try {
    const business = await getBusinessBySlug(params.slug);
    
    return (
      <main className="container min-h-screen flex flex-col justify-center">
        <ReviewFlow business={business} />
      </main>
    );
  } catch (err) {
    notFound();
  }
}
