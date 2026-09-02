"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getAllBusinesses, getSession, logoutUser } from '@/lib/supabase';
import CreateBusinessForm from '@/components/CreateBusinessForm';
import ReviewsTable from '@/components/ReviewsTable';
import { QrCode, Download, RefreshCw, Copy } from 'lucide-react';
import html2canvas from 'html2canvas';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [view, setView] = useState<'select' | 'create'>('select');
  const [showQr, setShowQr] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const session = await getSession();
        if (!session) {
          router.push('/login');
        } else {
          setIsAuthenticated(true);
          loadBusinesses();
        }
      } catch (e) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const loadBusinesses = async () => {
    try {
      const data = await getAllBusinesses();
      setBusinesses(data);
      if (data.length > 0 && !selectedBusiness) {
        setSelectedBusiness(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQr = async (slug: string) => {
    if (!qrRef.current) return;
    try {
      const canvas = await html2canvas(qrRef.current, { scale: 3, backgroundColor: null });
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${slug}-google-review-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container min-h-screen py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn bg-white/10 hover:bg-white/20 text-white text-sm py-2">Logout</button>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          className={`btn flex-1 ${view === 'select' ? 'btn-primary shadow-lg' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
          onClick={() => setView('select')}
        >
          View Businesses & Reviews
        </button>
        <button 
          className={`btn flex-1 ${view === 'create' ? 'btn-primary shadow-lg' : 'bg-white/5 text-white/70 hover:bg-white/10'}`}
          onClick={() => setView('create')}
        >
          + Add New Business
        </button>
      </div>

      {view === 'create' && (
        <CreateBusinessForm onSuccess={() => {
          loadBusinesses();
          setView('select');
        }} />
      )}

      {view === 'select' && (
        <div className="animate-fade-in">
          {businesses.length === 0 ? (
            <div className="card text-center p-8 text-white/50">
              No businesses found. Click "Add New Business" to get started.
            </div>
          ) : (
            <>
              <div className="card mb-8">
                <label className="label mb-3">Select a Business to View Reviews</label>
                <select 
                  className="input w-full bg-black/40 text-white text-lg py-3"
                  value={selectedBusiness?.id || ''}
                  onChange={(e) => {
                    const b = businesses.find(x => x.id === e.target.value);
                    setSelectedBusiness(b);
                    setShowQr(false);
                  }}
                >
                  {businesses.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.business_name} {b.category ? `(${b.category})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBusiness && (
                <div className="mb-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      {selectedBusiness.logo_url && (
                        <img src={selectedBusiness.logo_url} alt="Logo" className="w-12 h-12 rounded-full object-cover shadow-lg" />
                      )}
                      <div>
                        <h2 className="text-2xl font-bold text-white">{selectedBusiness.business_name}</h2>
                        <a href={`/r/${selectedBusiness.slug}`} target="_blank" className="text-primary text-sm hover:underline">
                          Public Review Link: /r/{selectedBusiness.slug}
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex flex-row items-center gap-2 mt-4 md:mt-0">
                      <button
                        onClick={() => {
                          loadBusinesses();
                          setRefreshTick(prev => prev + 1);
                        }}
                        className="btn btn-secondary text-sm py-2 px-3 flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
                        title="Refresh Reviews"
                      >
                        <RefreshCw size={16} />
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/r/${selectedBusiness.slug}`);
                          alert("Public review link copied to clipboard!");
                        }}
                        className="btn btn-secondary text-sm py-2 px-4 flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
                      >
                        <Copy size={16} /> <span className="hidden sm:inline">Copy Link</span>
                      </button>
                      <button 
                        onClick={() => setShowQr(!showQr)}
                        className="btn btn-secondary text-sm py-2 px-4 flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
                      >
                        <QrCode size={16} /> <span className="hidden sm:inline">{showQr ? 'Hide QR Code' : 'Generate QR'}</span>
                      </button>
                    </div>
                  </div>

                  {showQr && (
                    <div className="bg-black/20 border border-white/10 rounded-xl p-6 mb-6 flex flex-col items-center animate-fade-in backdrop-blur-md">
                      <div className="mb-4 text-center">
                        <p className="text-sm text-white/70 mb-2">This is exactly how your downloaded PNG will look.</p>
                      </div>
                      
                      {/* The QR Card that will be downloaded */}
                      <div 
                        ref={qrRef}
                        className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
                        style={{ width: '400px', height: '550px' }}
                      >
                        {/* Decorative top border in Google colors */}
                        <div className="absolute top-0 left-0 w-full h-3 flex">
                          <div className="h-full flex-1" style={{ backgroundColor: '#4285F4' }}></div>
                          <div className="h-full flex-1" style={{ backgroundColor: '#EA4335' }}></div>
                          <div className="h-full flex-1" style={{ backgroundColor: '#FBBC05' }}></div>
                          <div className="h-full flex-1" style={{ backgroundColor: '#34A853' }}></div>
                        </div>

                        <div className="text-center mb-6 mt-4">
                          <h2 className="text-4xl font-extrabold mb-1" style={{ color: '#202124' }}>
                            <span style={{ color: '#4285F4' }}>G</span>
                            <span style={{ color: '#EA4335' }}>o</span>
                            <span style={{ color: '#FBBC05' }}>o</span>
                            <span style={{ color: '#4285F4' }}>g</span>
                            <span style={{ color: '#34A853' }}>l</span>
                            <span style={{ color: '#EA4335' }}>e</span>
                            <span className="ml-2">Review</span>
                          </h2>
                          <p className="text-xl font-medium" style={{ color: '#5f6368' }}>Review us on Google</p>
                        </div>

                        <div className="bg-white p-2 rounded-2xl shadow-sm mb-6 border-2 border-gray-100">
                          <QRCodeSVG 
                            value={`${window.location.origin}/r/${selectedBusiness.slug}`} 
                            size={220}
                            level="H"
                            includeMargin={false}
                            fgColor="#202124"
                          />
                        </div>

                        <div className="text-center w-full px-4">
                          <h3 className="text-2xl font-bold mb-1 truncate" style={{ color: '#202124' }}>
                            {selectedBusiness.business_name}
                          </h3>
                          <div className="flex justify-center items-center gap-1 mt-2">
                            {[1,2,3,4,5].map(i => (
                              <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#FBBC05" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => downloadQr(selectedBusiness.slug)}
                        className="btn btn-primary shadow-lg flex items-center gap-2 mt-6"
                      >
                        <Download size={16} /> Download High-Res PNG
                      </button>
                    </div>
                  )}

                  <ReviewsTable businessId={selectedBusiness.id} refreshTick={refreshTick} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
