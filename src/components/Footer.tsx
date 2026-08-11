import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Clock, Car, ChevronRight, Lock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';

interface FooterProps {
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* BRAND OVERVIEW */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/40">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-wider uppercase text-white">
                  TRUSTED <span className="text-red-500">CARS</span>
                </span>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Karol Bagh • New Delhi</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.description || 'Delhi’s most transparent pre-owned car dealership. 200+ quality points checked, non-accidental guarantee, and instant loan approvals.'}
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Owner: {settings.ownerName}</span>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase border-l-2 border-red-500 pl-2.5">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Browse Pre-Owned Cars', path: '/cars' },
                { label: 'Sell Your Car (Instant Quote)', path: '/sell' },
                { label: 'EMI & Loan Calculator', path: '/finance' },
                { label: 'About Trusted Cars', path: '/about' },
                { label: 'Contact Us & Showroom Location', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => handleNav(item.path)}
                    className="hover:text-red-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-red-500 group-hover:translate-x-1 transition-transform" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* POPULAR SEARCHES IN DELHI */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase border-l-2 border-red-500 pl-2.5">
              Popular Cars in Delhi
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Used Maruti Dzire in Delhi', query: 'Maruti' },
                { label: 'Used Hyundai Creta in Delhi', query: 'Creta' },
                { label: 'Used Honda City in Delhi', query: 'City' },
                { label: 'Used Tata Nexon in Delhi', query: 'Nexon' },
                { label: 'Used Automatic Cars', query: 'Automatic' },
              ].map((search) => (
                <li key={search.label}>
                  <button
                    onClick={() => handleNav(`/cars?search=${search.query}`)}
                    className="hover:text-red-400 transition-colors flex items-center gap-1.5 group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-red-500 transition-colors" />
                    <span>{search.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* SHOWROOM CONTACT INFO */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 tracking-wide uppercase border-l-2 border-red-500 pl-2.5">
              Karol Bagh Showroom
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white text-slate-200 font-semibold">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white text-slate-300">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR & HIDDEN DISCREET ADMIN LINK */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Trusted Cars. All rights reserved. Karol Bagh, New Delhi.</p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('/about')} className="hover:text-slate-400">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('/contact')} className="hover:text-slate-400">
              Terms of Service
            </button>
            {/* Discreet Admin Portal Link */}
            <button
              onClick={() => handleNav('/admin/login')}
              className="text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors"
              title="Admin Access Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Dealer Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
