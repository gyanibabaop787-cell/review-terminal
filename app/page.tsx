import Link from 'next/link';

export default function Home() {
  return (
    <div className="container min-h-screen flex flex-col justify-center items-center text-center px-4">
      <div className="card w-full max-w-sm animate-fade-in flex flex-col items-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-primary">TW WILL</h1>
          <p className="text-md text-muted opacity-90">The simple, fast, mobile-first review platform.</p>
        </div>
        
        <div className="flex flex-col gap-4 w-full">
          <Link href="/admin" className="btn btn-primary">
            Business Dashboard
          </Link>
          <Link href="/pricing" className="btn btn-secondary">
            View Pricing
          </Link>
          
          <div className="h-px bg-white/10 w-full my-4"></div>
          
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Live Demos</h2>
          <Link href="/r/the-grand-plaza" className="btn btn-secondary text-sm py-3">
            Demo: The Grand Plaza
          </Link>
          <Link href="/r/lumina-salon" className="btn btn-secondary text-sm py-3">
            Demo: Lumina Salon
          </Link>
        </div>
      </div>
    </div>
  );
}
