"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { getAllBusinesses, getSession, logoutUser } from '@/lib/supabase';
import CreateBusinessForm from '@/components/CreateBusinessForm';
import ReviewsTable from '@/components/ReviewsTable';
import { QrCode, Download, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [view, setView] = useState<'select' | 'create'>('select');
  const [showQr, setShowQr] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);

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

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.push('/login');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const downloadQr = (slug: string) => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        // Fill white background for the PNG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${slug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
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
                        onClick={() => setShowQr(!showQr)}
                        className="btn btn-secondary text-sm py-2 px-4 flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10"
                      >
                        <QrCode size={16} /> <span className="hidden sm:inline">{showQr ? 'Hide QR Code' : 'Generate QR Code'}</span>
                      </button>
                    </div>
                  </div>

                  {showQr && (
                    <div className="bg-black/20 border border-white/10 rounded-xl p-6 mb-6 flex flex-col items-center animate-fade-in backdrop-blur-md">
                      <h3 className="text-white font-bold mb-4">Scan to Review</h3>
                      <div className="bg-white p-4 rounded-xl shadow-lg mb-4">
                        <QRCodeSVG 
                          id="qr-code"
                          value={`${window.location.origin}/r/${selectedBusiness.slug}`} 
                          size={180}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                      <button 
                        onClick={() => downloadQr(selectedBusiness.slug)}
                        className="btn btn-primary shadow-lg flex items-center gap-2"
                      >
                        <Download size={16} /> Download PNG
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
