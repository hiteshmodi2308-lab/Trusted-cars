import React, { useState } from 'react';
import { X, Calendar, Clock, Phone, User, Mail, MessageSquare, CheckCircle2, Car as CarIcon } from 'lucide-react';
import { Car } from '../types/index.js';
import { submitTestDrive } from '../lib/api.js';

interface TestDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({ isOpen, onClose, car }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferredDate, setPreferredDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !car) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !preferredDate) {
      setError('Please provide your name, phone number, and preferred date.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitTestDrive({
        name,
        phone,
        email,
        carId: car.id,
        carTitle: `${car.year} ${car.make} ${car.model} ${car.variant}`,
        preferredDate,
        preferredTime,
        message,
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to book test drive. Please try again.');
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
            <h3 className="text-2xl font-black text-white">Test Drive Booked!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your test drive for <span className="font-bold text-white">{car.year} {car.make} {car.model}</span> is scheduled for <span className="font-bold text-red-400">{preferredDate} at {preferredTime}</span>.
            </p>
            <p className="text-xs text-slate-400">Our Karol Bagh showroom rep will call {phone} to confirm location.</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-sm text-white"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
                Free Showroom / Doorstep Test Drive
              </span>
              <h3 className="text-2xl font-black text-white">
                Book Test Drive
              </h3>
              <div className="mt-2 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                <CarIcon className="w-6 h-6 text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-white">{car.year} {car.make} {car.model} {car.variant}</p>
                  <p className="text-xs text-slate-400">{car.fuel} • {car.transmission} • Karol Bagh, Delhi</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Your Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Malhotra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Preferred Date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Preferred Time</label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                      <option value="07:00 PM">07:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Special Instructions (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Please bring vehicle to Rajendra Place / Karol Bagh location..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/50 uppercase tracking-wider disabled:opacity-50"
              >
                <span>{loading ? 'Booking...' : 'Confirm Test Drive Appointment'}</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
