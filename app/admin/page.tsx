"use client";

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createBusiness } from '@/lib/supabase';

export default function AdminPage() {
  const [businessName, setBusinessName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [slug, setSlug] = useState('');
  
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // Auto-generate slug from name
  useEffect(() => {
    if (businessName) {
      const generatedSlug = businessName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  }, [businessName]);

  const handleSave = async () => {
    if (!slug || !businessName || !googleReviewUrl) {
      alert("Please provide at least a Business Name and Google Review URL");
      return;
    }
    
    setSaving(true);
    try {
      await createBusiness({
        slug,
        business_name: businessName,
        logo_url: logoUrl,
        google_review_url: googleReviewUrl
      });
      
      const url = `${window.location.origin}/r/${slug}`;
      setGeneratedUrl(url);
      alert('Business saved successfully to your database!');
    } catch (err: any) {
      alert(err.message || 'Failed to save business');
    } finally {
      setSaving(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    alert('URL copied to clipboard!');
  };

  const downloadQr = () => {
    const svg = document.getElementById('qr-code');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `${slug}-qr.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="container min-h-screen py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">TW WILL Dashboard</h1>
      
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-6">Business Details</h2>
        
        <div className="form-group">
          <label className="label">Business Name</label>
          <input 
            type="text" 
            className="input" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. Bhandara Park Hotel"
          />
        </div>
        
        <div className="form-group">
          <label className="label">Logo URL</label>
          <input 
            type="url" 
            className="input" 
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div className="form-group mb-6">
          <label className="label">Google Review URL</label>
          <input 
            type="url" 
            className="input" 
            value={googleReviewUrl}
            onChange={(e) => setGoogleReviewUrl(e.target.value)}
            placeholder="https://g.page/r/..."
          />
        </div>
        
        <button className="btn btn-primary" onClick={handleSave} disabled={!businessName || saving}>
          {saving ? 'Saving...' : 'Save Business'}
        </button>
      </div>

      {generatedUrl && (
        <div className="card text-center animate-fade-in">
          <h2 className="text-xl font-semibold mb-6">Your Review Link</h2>
          
          <div className="p-4 bg-gray-50 border rounded-lg mb-6 break-all font-mono text-sm">
            {generatedUrl}
          </div>
          
          <button className="btn btn-secondary mb-8" onClick={copyUrl}>
            Copy URL
          </button>
          
          <div className="flex flex-col items-center">
            <h3 className="label mb-4">Review QR Code</h3>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6 inline-block">
              <QRCodeSVG 
                id="qr-code"
                value={generatedUrl} 
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <button className="btn btn-primary" onClick={downloadQr}>
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
