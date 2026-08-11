import React, { useState } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { useSettings } from '../context/SettingsContext.js';
import { submitLead } from '../lib/api.js';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Send,
  CheckCircle2,
  Car as CarIcon,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitLead({
        name,
        phone,
        email,
        message,
        type: 'General Contact Enquiry',
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/contact" onNavigate={onNavigate} />

      {/* HERO SECTION */}
      <section className="relative py-16 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <MapPin className="w-4 h-4 text-red-500" />
            <span>Karol Bagh, New Delhi Showroom</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            Contact <span className="text-red-500">Trusted Cars</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-medium mt-3 leading-relaxed">
            Have questions about a car, test drive, financing, or selling your vehicle? Reach out to Hitesh Modi and team.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* SHOWROOM DETAILS (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <h2 className="text-2xl font-black text-white">Showroom Location</h2>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Karol Bagh Address</h4>
                    <p className="text-slate-300 mt-1 leading-relaxed">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Phone Numbers</h4>
                    <a href={`tel:${settings.phone}`} className="text-slate-200 hover:text-red-400 font-bold block mt-0.5">
                      {settings.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Working Hours</h4>
                    <p className="text-slate-300 mt-1">{settings.businessHours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-lg shadow-red-950"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Directions in Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* CONTACT FORM (7 COLS) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-20 h-20 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black text-white">Message Sent Successfully</h3>
                <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you <span className="font-bold text-white">{name}</span>. Our representative will get back to you at <span className="font-bold text-white">{phone}</span> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 font-bold text-xs uppercase tracking-wider text-white"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
                    Direct Inquiry Form
                  </span>
                  <h2 className="text-2xl font-black text-white">Send Us a Message</h2>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs font-medium">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Verma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. rahul@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your Message</label>
                    <textarea
                      rows={4}
                      placeholder="Tell us what vehicle you are looking for or any specific question..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-red-950 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? 'Sending...' : 'Send Direct Message'}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
