import Link from 'next/link';

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold mb-4 text-primary">TW WILL</h1>
      <p className="text-xl text-muted mb-8">The simple, fast, mobile-first review platform.</p>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link href="/admin" className="btn btn-primary">
          Business Dashboard
        </Link>
        <Link href="/pricing" className="btn btn-secondary">
          View Pricing
        </Link>
        <Link href="/r/bhandara-park-hotel" className="btn btn-secondary">
          Demo: Bhandara Park Hotel
        </Link>
        <Link href="/r/kalpna-restaurant" className="btn btn-secondary">
          Demo: Kalpna Restaurant
        </Link>
      </div>
    </div>
  );
}
