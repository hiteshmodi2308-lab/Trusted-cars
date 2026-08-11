import React, { useState } from 'react';
import { X, Send, Phone, User, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Car } from '../types/index.js';
import { submitLead } from '../lib/api.js';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  car?: Car | null;
  type?: string;
  initialMessage?: string;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({ isOpen, onClose, car, type = 'Car Enquiry', initialMessage = '' }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(initialMessage || (car ? `Hi, I am interested in the ${car.year} ${car.make} ${car.model} ${car.variant}. Please contact me with vehicle details.` : ''));
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        carId: car?.id,
        carTitle: car ? `${car.year} ${car.make} ${car.model} ${car.variant}` : undefined,
        message,
        type,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Enquiry Submitted!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you {name}. Our sales executive at Trusted Cars, Karol Bagh will call you on <span className="font-bold text-white">{phone}</span> shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-sm text-white"
            >
              Close Window
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
                Direct Dealer Inquiry
              </span>
              <h3 className="text-2xl font-black text-white">
                {car ? `Enquire About ${car.make} ${car.model}` : 'Contact Trusted Cars'}
              </h3>
              {car && (
                <p className="text-xs font-semibold text-slate-400 mt-1">
                  {car.variant} ({car.year}) • <span className="text-red-400">₹{(car.price / 100000).toFixed(2)} Lakhs</span>
                </p>
              )}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Email Address (Optional)</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="e.g. rajesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Message</label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Ask about inspection report, test drive, price negotiation, or finance options..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/50 uppercase tracking-wider disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Send Direct Enquiry'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
