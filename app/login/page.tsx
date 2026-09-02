"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginUser } from '@/lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await loginUser(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Invalid login credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-h-screen py-10 flex flex-col items-center justify-center">
      <div className="card w-full max-w-sm animate-fade-in">
        <h1 className="text-2xl font-bold mb-2 text-center text-white">Admin Login</h1>
        <p className="text-center text-sm text-white/50 mb-6">Sign in to your dashboard</p>
        
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="form-group">
            <label className="label">Email Address</label>
            <input 
              type="email" 
              className="input w-full" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Password</label>
            <input 
              type="password" 
              className="input w-full" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          {error && <p className="text-red-400 text-sm bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
          
          <button type="submit" className="btn btn-primary shadow-lg mt-2" disabled={loading}>
            {loading ? 'Logging in...' : 'Login to Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-white/50">
          Don't have an account?{' '}
          <Link href="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
