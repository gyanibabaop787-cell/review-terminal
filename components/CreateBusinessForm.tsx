"use client";

import { useState } from 'react';
import { createBusiness, uploadLogo } from '@/lib/supabase';
import { Upload } from 'lucide-react';

export default function CreateBusinessForm({ onSuccess }: { onSuccess: () => void }) {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Hotel');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('File size must be under 1MB.');
      return;
    }
    setError('');
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !googleReviewUrl) {
      setError("Please provide Name and Google URL.");
      return;
    }
    
    setSaving(true);
    setError('');
    
    try {
      const slug = businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      
      // Upload Logo
      let logoUrl = '';
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }
      
      // Create Business
      await createBusiness({
        slug,
        business_name: businessName,
        category,
        logo_url: logoUrl,
        google_review_url: googleReviewUrl
      });
      
      alert('Business saved successfully!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to save business');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="card animate-fade-in w-full max-w-xl mx-auto mb-10 p-8">
      <h2 className="text-xl font-bold mb-6 text-white tracking-wide">Add New Business</h2>
      
      {error && <div className="bg-red-500/20 border border-red-500 text-red-400 p-3 rounded-lg mb-6 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="form-group">
          <label className="label">Business Name</label>
          <input 
            type="text" 
            className="input w-full" 
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g. The Grand Plaza Hotel"
          />
        </div>

        <div className="form-group">
          <label className="label">Category</label>
          <select 
            className="input w-full bg-black/40 text-white" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Hotel</option>
            <option>Salon</option>
            <option>Restaurant</option>
            <option>Cafe</option>
            <option>Retail</option>
            <option>Other</option>
          </select>
        </div>
      </div>
      
      <div className="form-group mb-6">
        <label className="label">Google Review URL</label>
        <input 
          type="url" 
          className="input w-full" 
          value={googleReviewUrl}
          onChange={(e) => setGoogleReviewUrl(e.target.value)}
          placeholder="https://g.page/r/..."
        />
      </div>

      <div className="form-group mb-8">
        <label className="label">Logo Image (Optional, Under 1MB)</label>
        <div className="relative border-2 border-dashed border-white/20 rounded-xl p-8 flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-center">
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {logoPreview ? (
            <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-cover rounded-full shadow-lg" />
          ) : (
            <>
              <Upload className="w-10 h-10 text-white/50 mb-3" />
              <p className="text-sm text-white/70">Drag & drop or click to upload</p>
              <p className="text-xs text-white/40 mt-1">PNG, JPG up to 1MB</p>
            </>
          )}
        </div>
      </div>
      
      <button type="submit" className="btn btn-primary shadow-lg w-full" disabled={saving}>
        {saving ? 'Uploading & Saving...' : 'Create Business'}
      </button>
    </form>
  );
}
