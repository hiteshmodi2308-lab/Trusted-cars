import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { EmiCalculator } from '../components/EmiCalculator.js';
import { EnquiryModal } from '../components/EnquiryModal.js';
import { TestDriveModal } from '../components/TestDriveModal.js';
import { ImageLightbox } from '../components/ImageLightbox.js';
import { CarCard } from '../components/CarCard.js';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection.js';
import { fetchCarBySlug, fetchCars } from '../lib/api.js';
import { Car } from '../types/index.js';
import { formatPrice, formatKm, getWhatsAppUrl, getCallUrl } from '../lib/utils.js';
import { useSettings } from '../context/SettingsContext.js';
import { addRecentlyViewedCarId } from '../lib/recentlyViewed.js';
import {
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  ChevronLeft,
  Zap,
  Award,
  Maximize2,
  Info,
  Car as CarIcon,
  Sparkles,
} from 'lucide-react';

interface CarDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const CarDetailPage: React.FC<CarDetailPageProps> = ({ slug, onNavigate }) => {
  const { settings } = useSettings();
  const [car, setCar] = useState<Car | null>(null);
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Gallery state
  const [selectedImgIdx, setSelectedImgIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Modals state
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadCar() {
      setLoading(true);
      setError('');
      try {
        const found = await fetchCarBySlug(slug);
        if (found) {
          setCar(found);
          addRecentlyViewedCarId(found.id);
          // Fetch similar make/price cars
          const sim = await fetchCars({ make: found.make, limit: 3 });
          setSimilarCars((sim?.cars || []).filter((c) => c.id !== found.id));
        } else {
          setError('Car not found or has been removed from inventory.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load car details.');
      } finally {
        setLoading(false);
      }
    }
    loadCar();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header currentPath="/cars" onNavigate={onNavigate} />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-400">Loading Vehicle Inspection Details...</p>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        <Header currentPath="/cars" onNavigate={onNavigate} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 max-w-md">
            <Info className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-black text-white mb-2">Vehicle Not Found</h2>
            <p className="text-xs text-slate-400 mb-6">{error || 'This car is no longer available in our Karol Bagh inventory.'}</p>
            <button
              onClick={() => onNavigate('/cars')}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 font-bold text-xs uppercase tracking-wider text-white"
            >
              Browse Available Inventory
            </button>
          </div>
        </div>
        <Footer onNavigate={onNavigate} />
      </div>
    );
  }

  const images = car.images && car.images.length > 0
    ? car.images
    : [{ id: '1', carId: car.id, url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', isPrimary: true, displayOrder: 0 }];

  const primaryImg = images[selectedImgIdx] || images[0];

  const whatsappMessage = `Hi ${settings.businessName}, I am interested in buying the ${car.year} ${car.make} ${car.model} ${car.variant} listed for ${formatPrice(car.price, 'lakh')}. Please send inspection details.`;
  const whatsappUrl = getWhatsAppUrl(settings.whatsapp, whatsappMessage);
  const callUrl = getCallUrl(settings.phone);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.year} ${car.make} ${car.model}`,
        text: `Check out this certified ${car.year} ${car.make} ${car.model} ${car.variant} at Trusted Cars Karol Bagh!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/cars" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* BACK BUTTON & BREADCRUMB */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('/cars')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-red-500" /> Back to Inventory
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-red-400" />
            <span>{copiedLink ? 'Link Copied!' : 'Share Vehicle'}</span>
          </button>
        </div>

        {/* CAR HEADER TITLE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded">
                {car.year} Model
              </span>
              <span className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" /> {car.location || 'Karol Bagh, New Delhi'}
              </span>
              {car.inspectionScore && (
                <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> {car.inspectionScore}/100 Score
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {car.make} {car.model}
            </h1>
            <p className="text-sm font-semibold text-slate-400 mt-1">{car.variant}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-6 py-3 rounded-2xl flex items-baseline gap-2 shrink-0 shadow-xl">
            <span className="text-xs uppercase font-bold text-slate-400">Fixed Price:</span>
            <span className="text-3xl font-black text-white">{formatPrice(car.price, 'full')}</span>
          </div>
        </div>

        {/* MAIN GRID: GALLERY & PURCHASE ACTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          
          {/* LEFT 7 COLS: PHOTO GALLERY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[16/10] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group">
              <img
                src={primaryImg.url}
                alt={`${car.make} ${car.model}`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              <button
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-4 right-4 px-4 py-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-bold text-white flex items-center gap-2 hover:bg-slate-900 transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-red-500" />
                <span>View Fullscreen ({images.length} Photos)</span>
              </button>
            </div>

            {/* THUMBNAIL GRID */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImgIdx(idx)}
                    className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImgIdx === idx ? 'border-red-500 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT 5 COLS: KEY HIGHLIGHTS & CTA */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              
              {/* ADVANTAGE BADGE */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 text-red-500 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-white">200-Point Quality Certified</h4>
                  <p className="text-[11px] text-slate-400">Non-accidental guarantee • RTO verified documents</p>
                </div>
              </div>

              {/* SPEC GRID SUMMARY */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Kilometers</span>
                  <span className="text-sm font-black text-white">{formatKm(car.kmDriven)}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Fuel Type</span>
                  <span className="text-sm font-black text-white">{car.fuel}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Transmission</span>
                  <span className="text-sm font-black text-white">{car.transmission}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Ownership</span>
                  <span className="text-sm font-black text-white">{car.owners === 1 ? '1st Owner' : `${car.owners} Owners`}</span>
                </div>
              </div>

              {/* LOCATION & SHOWROOM AVAILABILITY */}
              <div className="text-xs text-slate-300 space-y-1">
                <p><span className="font-bold text-white">Showroom:</span> Karol Bagh, New Delhi</p>
                <p><span className="font-bold text-white">Reg. State:</span> {car.regState || 'DL (Delhi)'}</p>
                <p><span className="font-bold text-white">Insurance:</span> {car.insuranceValid || 'Valid Insurance'}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <button
                onClick={() => setTestDriveModalOpen(true)}
                className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-950 flex items-center justify-center gap-2"
              >
                <CarIcon className="w-5 h-5" />
                <span>Book Free Test Drive</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Dealer</span>
                </a>

                <button
                  onClick={() => setEnquiryModalOpen(true)}
                  className="py-3 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-red-500" />
                  <span>Send Enquiry</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED SPECIFICATIONS TABLE */}
        <section className="mb-12 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
          <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <span>Complete Vehicle Specifications</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-red-400 text-[11px]">Overview & Registration</h4>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Brand & Model:</span><span className="font-bold text-white">{car.make} {car.model}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Variant:</span><span className="font-bold text-white">{car.variant}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Mfg Year:</span><span className="font-bold text-white">{car.year}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Body Type:</span><span className="font-bold text-white">{car.bodyType}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Reg State:</span><span className="font-bold text-white">{car.regState || 'DL'}</span></div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-red-400 text-[11px]">Engine & Mechanicals</h4>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Fuel Type:</span><span className="font-bold text-white">{car.fuel}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Transmission:</span><span className="font-bold text-white">{car.transmission}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Engine Capacity:</span><span className="font-bold text-white">{car.engineCc ? `${car.engineCc} cc` : 'N/A'}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Mileage:</span><span className="font-bold text-white">{car.mileage ? `${car.mileage} km/l` : '18.5 km/l'}</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Color:</span><span className="font-bold text-white">{car.color || 'Standard'}</span></div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-red-400 text-[11px]">Condition & History</h4>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">RTO Kilometer:</span><span className="font-bold text-white">{formatKm(car.kmDriven)}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Previous Owners:</span><span className="font-bold text-white">{car.owners}</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Accident History:</span><span className="font-bold text-emerald-400">Clean / Zero Accident</span></div>
              <div className="flex justify-between py-1 border-b border-slate-900"><span className="text-slate-400">Flood Damage:</span><span className="font-bold text-emerald-400">None</span></div>
              <div className="flex justify-between py-1"><span className="text-slate-400">Keys Included:</span><span className="font-bold text-white">2 Keys</span></div>
            </div>
          </div>
        </section>

        {/* EMI CALCULATOR EMBED */}
        <section className="mb-12">
          <EmiCalculator initialPrice={car.price} onApplyLoan={() => setEnquiryModalOpen(true)} />
        </section>

        {/* SIMILAR CARS */}
        {similarCars.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-black text-white mb-6">Similar Cars You May Like</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarCars.map((simCar) => (
                <CarCard
                  key={simCar.id}
                  car={simCar}
                  onViewDetails={(s) => onNavigate(`/cars/${s}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* RECENTLY VIEWED CARS */}
        <RecentlyViewedSection
          onNavigate={onNavigate}
          onEnquire={(c) => {
            setCar(c);
            setEnquiryModalOpen(true);
          }}
          className="rounded-3xl border border-slate-800 my-8"
        />
      </main>

      <Footer onNavigate={onNavigate} />

      {/* MODALS & LIGHTBOX */}
      <ImageLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        images={images}
        initialIndex={selectedImgIdx}
        carTitle={`${car.year} ${car.make} ${car.model}`}
      />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        car={car}
      />

      <TestDriveModal
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
        car={car}
      />
    </div>
  );
};
