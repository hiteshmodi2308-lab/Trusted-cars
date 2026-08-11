import React, { useState } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { submitSellEnquiry } from '../lib/api.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  Tag,
  CheckCircle2,
  Phone,
  User,
  Car as CarIcon,
  Calendar,
  Gauge,
  Fuel,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowRight,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

interface SellCarPageProps {
  onNavigate: (path: string) => void;
}

export const SellCarPage: React.FC<SellCarPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [make, setMake] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2020);
  const [kmDriven, setKmDriven] = useState(45000);
  const [fuel, setFuel] = useState('Petrol');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !model.trim()) {
      setError('Please fill in your name, phone number, and car model.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitSellEnquiry({
        name,
        phone,
        make,
        model,
        year,
        kmDriven,
        fuel,
        expectedPrice: expectedPrice ? Number(expectedPrice) : undefined,
        city,
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit valuation request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/sell" onNavigate={onNavigate} />

      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Instant Cash Payment in 60 Minutes</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Sell Your Car at <br />
            <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
              The Best Price in Delhi
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-3 leading-relaxed">
            Hassle-free evaluation at your doorstep or Karol Bagh showroom. Same-day payment & guaranteed RTO transfer.
          </p>
        </div>
      </section>

      {/* FORM & ADVANTAGES SECTION */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-white">Valuation Request Received!</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you <span className="font-bold text-white">{name}</span>. Our car evaluation specialist from Trusted Cars Karol Bagh will review your <span className="font-bold text-red-400">{year} {make} {model}</span> and call you at <span className="font-bold text-white">{phone}</span> within 30 minutes with an offer.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setModel('');
                    setExpectedPrice('');
                  }}
                  className="mt-4 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs uppercase tracking-wider text-white"
                >
                  Submit Another Car
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
                    Direct Dealership Valuation
                  </span>
                  <h2 className="text-2xl font-black text-white">Enter Your Vehicle Details</h2>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Brand / Make *</label>
                      <select
                        value={make}
                        onChange={(e) => setMake(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        <option value="Maruti Suzuki">Maruti Suzuki</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Honda">Honda</option>
                        <option value="Tata">Tata</option>
                        <option value="Kia">Kia</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Mahindra">Mahindra</option>
                        <option value="BMW">BMW</option>
                        <option value="Mercedes-Benz">Mercedes-Benz</option>
                        <option value="Volkswagen">Volkswagen</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Model Name & Variant *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Swift ZXi / Creta SX / City V"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Registration Year</label>
                      <select
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        {[2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">KM Driven</label>
                      <input
                        type="number"
                        placeholder="e.g. 45000"
                        value={kmDriven}
                        onChange={(e) => setKmDriven(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Fuel Type</label>
                      <select
                        value={fuel}
                        onChange={(e) => setFuel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      >
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="CNG">CNG</option>
                        <option value="Electric">Electric</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Expected Price (₹ Lakhs)</label>
                      <input
                        type="number"
                        placeholder="e.g. 6.5"
                        value={expectedPrice}
                        onChange={(e) => setExpectedPrice(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your City / Location</label>
                      <input
                        type="text"
                        placeholder="e.g. Karol Bagh / West Delhi / Gurgaon"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Hitesh Modi"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-950 disabled:opacity-50"
                  >
                    <span>{loading ? 'Evaluating...' : 'Get Instant Cash Offer'}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* ADVANTAGES SIDEBAR (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-red-500" />
                <span>Why Sell To Trusted Cars?</span>
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Best Price Offer</h4>
                    <p className="text-slate-400 mt-0.5">We beat market aggregator quotes by up to 10% because of direct Karol Bagh retail buyer demand.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Instant Payment</h4>
                    <p className="text-slate-400 mt-0.5">Instant IMPS/RTGS bank transfer right at the time of vehicle pick up. Zero delay.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Free RC Transfer</h4>
                    <p className="text-slate-400 mt-0.5">100% legal responsibility for RTO ownership transfer and buyer documentation.</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <p className="text-xs font-semibold text-slate-400 mb-2">Prefer calling directly?</p>
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>Call Hitesh Modi: {settings.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
