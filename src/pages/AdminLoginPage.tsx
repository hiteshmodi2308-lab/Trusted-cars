import React, { useState } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { loginAdmin } from '../lib/api.js';
import { ShieldCheck, Lock, User, ArrowRight, KeyRound } from 'lucide-react';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
  onLoginSuccess: (token: string, adminUser: any) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate, onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@trustedcars.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await loginAdmin(email, password);
      if (res && res.token) {
        onLoginSuccess(res.token, res.user);
        onNavigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/admin/login" onNavigate={onNavigate} />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-800 text-red-500 flex items-center justify-center mx-auto shadow-xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white">Dealership Portal</h1>
            <p className="text-xs text-slate-400">Admin Login for Trusted Cars Karol Bagh</p>
          </div>

          {error && (
            <div className="p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <p className="font-bold text-white flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Demo Admin Access:
              </p>
              <p>Email: <span className="font-mono text-slate-200">admin@trustedcars.com</span></p>
              <p>Password: <span className="font-mono text-slate-200">admin123</span></p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-950 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In To Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
