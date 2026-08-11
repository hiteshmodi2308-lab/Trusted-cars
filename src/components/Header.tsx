import React, { useState } from 'react';
import { ShieldCheck, Phone, MessageSquare, Menu, X, Car, Calculator, Tag, Info, Mail } from 'lucide-react';
import { useSettings } from '../context/SettingsContext.js';
import { getWhatsAppUrl, getCallUrl } from '../lib/utils.js';

interface HeaderProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath = '/', onNavigate }) => {
  const { settings } = useSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.hash = path;
    }
  };

  const whatsappMsg = `Hi ${settings.businessName}, I am visiting your website and would like to inquire about pre-owned cars in Karol Bagh.`;
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, whatsappMsg);
  const callUrl = getCallUrl(settings.phone);

  const navItems = [
    { label: 'Buy Cars', path: '/cars', icon: Car },
    { label: 'Sell Your Car', path: '/sell', icon: Tag },
    { label: 'Finance & EMI', path: '/finance', icon: Calculator },
    { label: 'About Us', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO BRANDING */}
          <div 
            onClick={() => handleNav('/')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            id="brand-logo"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-red-900/30 group-hover:scale-105 transition-transform">
              <Car className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  TRUSTED <span className="text-red-500">CARS</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold bg-red-950/80 text-red-400 border border-red-800/60 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-red-500" /> Delhi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                Karol Bagh • New Delhi
              </p>
            </div>
          </div>

          {/* DESKTOP NAV LINKS */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  id={`nav-link-${item.path.replace('/', '') || 'home'}`}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-red-600 text-white shadow-sm shadow-red-900/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* QUICK CONTACT ACTION BUTTONS */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleNav('/admin/dashboard')}
              id="header-admin-button"
              className="px-3 py-2 rounded-lg bg-red-950/90 hover:bg-red-900 text-red-300 border border-red-800/80 text-xs font-bold flex items-center gap-1.5 transition-all"
              title="Dealer Control Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
              <span>Admin Portal</span>
            </button>

            <a
              href={callUrl}
              id="header-call-button"
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{settings.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="header-whatsapp-button"
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-950/40"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>

          {/* MOBILE HAMBURGER MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-toggle"
            className="lg:hidden p-2.5 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER MENU */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-1.5">
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors ${
                    isActive ? 'bg-red-600 text-white' : 'text-slate-300 bg-slate-900/60 hover:bg-slate-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
            <a
              href={callUrl}
              className="w-full py-3 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 text-xs font-bold flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-red-500" />
              <span>Call Dealer</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
