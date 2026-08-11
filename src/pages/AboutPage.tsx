import React from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { useSettings } from '../context/SettingsContext.js';
import { ShieldCheck, Award, Users, MapPin, CheckCircle2, Phone, Mail, ArrowRight, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/about" onNavigate={onNavigate} />

      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-red-500" />
            <span>Established 2012 • Karol Bagh, New Delhi</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            About <span className="text-red-500">Trusted Cars</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-3 leading-relaxed">
            Redefining used car buying in Delhi with complete transparency, non-accidental guarantees, and fair pricing under the leadership of Hitesh Modi.
          </p>
        </div>
      </section>

      {/* FOUNDER & STORY */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block">
              Founder's Vision
            </span>
            <h2 className="text-3xl font-black text-white">
              "Buying a pre-owned car should feel as exciting and trustworthy as buying brand new."
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Founded in Karol Bagh, New Delhi, Trusted Cars was built to address the widespread mistrust in the second-hand automotive market. Hitesh Modi set out to build a dealership where every car is personally vetted, inspected across 200 checkpoints, and sold with zero hidden charges or meter tampering.
            </p>
            <p className="text-sm text-slate-300 leading-relaxed">
              Over the last decade, we have served more than 2,500 happy families across Delhi NCR, Haryana, Punjab, and Uttar Pradesh.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-4 text-xs font-bold">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-2xl font-black text-red-500 block">2,500+</span>
                <span className="text-slate-400">Cars Delivered</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                <span className="text-2xl font-black text-emerald-400 block">200-Point</span>
                <span className="text-slate-400">Rigorous Inspection</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-xl font-black text-white">The 4 Pillars of Trusted Cars</h3>

            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Non-Accidental Guarantee</h4>
                  <p className="text-slate-400">Strict structural chassis checks. We refuse to list cars with flood or major collision repair history.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Transparent Fixed Pricing</h4>
                  <p className="text-slate-400">No hidden transfer fees or unexpected admin costs. Honest market rates.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Guaranteed RTO RC Transfer</h4>
                  <p className="text-slate-400">We manage the full legal transfer process with the Delhi RTO until the new RC is in your hands.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Post-Sale Support</h4>
                  <p className="text-slate-400">7-day testing money-back promise and assistance with maintenance and insurance renewal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VISIT SHOWROOM CTA */}
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border border-red-900/60 rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <h2 className="text-3xl font-black text-white">Visit Our Karol Bagh Showroom</h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Experience our handpicked inventory in person. Have a warm cup of tea with Hitesh Modi and test drive your favourite cars.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/cars')}
              className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-red-950"
            >
              Browse Inventory
            </button>
            <button
              onClick={() => onNavigate('/contact')}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider"
            >
              Get Location Map
            </button>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
