import React from 'react';
import { Car } from '../types/index.js';
import { formatPrice, formatKm, calculateEmi, getWhatsAppUrl, getCallUrl } from '../lib/utils.js';
import { useSettings } from '../context/SettingsContext.js';
import { ShieldCheck, MapPin, Fuel, Gauge, Calendar, MessageSquare, Phone, ChevronRight, Sparkles } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onViewDetails: (slug: string) => void;
  onEnquire?: (car: Car) => void;
}

export const CarCard: React.FC<CarCardProps> = ({ car, onViewDetails, onEnquire }) => {
  const { settings } = useSettings();

  // Primary Image URL
  const primaryImg = car.images?.find((img) => img.isPrimary)?.url || car.images?.[0]?.url || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80';

  // Calculate starting EMI estimate (assuming 20% down payment, 9.5% interest, 5 years)
  const downPayment = car.price * 0.2;
  const loanAmount = car.price - downPayment;
  const emiData = calculateEmi(loanAmount, 9.5, 5);

  const whatsappMessage = `Hi ${settings.businessName}, I am interested in the ${car.year} ${car.make} ${car.model} ${car.variant} listed for ${formatPrice(car.price, 'lakh')}. Please share photos and inspection report.`;
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, whatsappMessage);
  const callUrl = getCallUrl(settings.phone);

  const isSold = car.status === 'Sold';
  const isReserved = car.status === 'Reserved';

  return (
    <div
      className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-slate-700 transition-all duration-300 flex flex-col justify-between"
      id={`car-card-${car.id}`}
    >
      <div>
        {/* IMAGE CONTAINER WITH BADGES */}
        <div 
          onClick={() => onViewDetails(car.slug)} 
          className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer"
        >
          <img
            src={primaryImg}
            alt={`${car.year} ${car.make} ${car.model} ${car.variant}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* TOP BADGES */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            {car.featured && !isSold && (
              <span className="bg-red-600 text-white text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300" /> Featured
              </span>
            )}
            {isSold && (
              <span className="bg-slate-900/90 text-red-500 border border-red-800 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-md">
                SOLD
              </span>
            )}
            {isReserved && (
              <span className="bg-amber-600/90 text-white text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-md">
                RESERVED
              </span>
            )}
            {car.inspectionScore && (
              <span className="ml-auto bg-slate-950/80 backdrop-blur-sm text-emerald-400 border border-emerald-800/80 text-[11px] font-bold px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> {car.inspectionScore}/100 Inspected
              </span>
            )}
          </div>

          {/* BOTTOM OVERLAY INFO */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">
              <MapPin className="w-3 h-3 text-red-400" /> {car.location || 'Karol Bagh, Delhi'}
            </span>
            <span className="bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-semibold text-slate-200">
              {car.owners === 1 ? '1st Owner' : `${car.owners} Owners`}
            </span>
          </div>
        </div>

        {/* CARD CONTENT */}
        <div className="p-5">
          {/* TITLE */}
          <div 
            onClick={() => onViewDetails(car.slug)} 
            className="cursor-pointer group/title mb-3"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-red-400 mb-0.5">
              {car.make} • {car.year}
            </p>
            <h3 className="text-lg font-bold text-white group-hover/title:text-red-400 transition-colors line-clamp-1">
              {car.make} {car.model}
            </h3>
            <p className="text-xs text-slate-400 line-clamp-1">{car.variant}</p>
          </div>

          {/* KEY SPECS GRID */}
          <div className="grid grid-cols-3 gap-2 py-2.5 my-3 border-y border-slate-800 text-slate-300 text-xs">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <Gauge className="w-3 h-3 text-red-400" /> KM Driven
              </span>
              <span className="font-bold text-slate-200">{formatKm(car.kmDriven)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <Fuel className="w-3 h-3 text-red-400" /> Fuel
              </span>
              <span className="font-bold text-slate-200">{car.fuel}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase text-slate-500 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-red-400" /> Trans.
              </span>
              <span className="font-bold text-slate-200">{car.transmission}</span>
            </div>
          </div>

          {/* PRICE & STARTING EMI */}
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-2xl font-black text-white tracking-tight">
                {formatPrice(car.price, 'lakh')}
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Fixed Price Guarantee</p>
            </div>
            <div className="text-right bg-red-950/40 border border-red-900/60 px-2.5 py-1 rounded-lg">
              <span className="text-[10px] font-semibold text-red-300 block">Starting EMI</span>
              <span className="text-xs font-bold text-red-400">
                ₹{emiData.monthlyEmi.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD BUTTONS */}
      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          title="Inquire on WhatsApp"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => onViewDetails(car.slug)}
          className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-md shadow-red-950/40"
        >
          <span>View Details</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
