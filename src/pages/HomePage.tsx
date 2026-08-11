import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { CarCard } from '../components/CarCard.js';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection.js';
import { EmiCalculator } from '../components/EmiCalculator.js';
import { EnquiryModal } from '../components/EnquiryModal.js';
import { fetchFeaturedCars, fetchCars } from '../lib/api.js';
import { Car } from '../types/index.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Car as CarIcon,
  Phone,
  MessageSquare,
  ArrowRight,
  ChevronDown,
  Award,
  Sparkles,
  Zap,
  TrendingUp,
  MapPin,
  Star,
  Users,
  DollarSign,
  HelpCircle,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { settings } = useSettings();
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [recentCars, setRecentCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  // Quick Search state
  const [searchMake, setSearchMake] = useState('All');
  const [searchBudget, setSearchBudget] = useState('');
  const [searchFuel, setSearchFuel] = useState('All');

  // Modal State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [feat, rec] = await Promise.all([
          fetchFeaturedCars(),
          fetchCars({ limit: 6, sort: 'newest' }),
        ]);
        setFeaturedCars(feat || []);
        setRecentCars(rec?.cars || []);
      } catch (err) {
        console.error('Failed to load cars for homepage:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchMake !== 'All') params.append('make', searchMake);
    if (searchBudget) params.append('maxPrice', searchBudget);
    if (searchFuel !== 'All') params.append('fuel', searchFuel);
    onNavigate(`/cars?${params.toString()}`);
  };

  const handleApplyLoanFromEmi = (emiData: any) => {
    setSelectedCar(null);
    setEnquiryModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 1. HEADER */}
      <Header currentPath="/" onNavigate={onNavigate} />

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/30 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider shadow-md">
              <ShieldCheck className="w-4 h-4 text-red-500" />
              <span>Karol Bagh's #1 Certified Pre-Owned Dealership</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Find Your Perfect <br />
              <span className="bg-gradient-to-r from-red-500 via-red-400 to-amber-400 bg-clip-text text-transparent">
                Pre-Owned Car
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto">
              Quality Checked Cars. Transparent Pricing. Trusted Service.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/cars')}
                id="hero-browse-btn"
                className="px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm transition-all shadow-xl shadow-red-950/60 uppercase tracking-wider flex items-center gap-2"
              >
                <CarIcon className="w-4 h-4" />
                <span>Browse Cars</span>
              </button>

              <button
                onClick={() => onNavigate('/sell')}
                id="hero-sell-btn"
                className="px-7 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-sm transition-all shadow-md uppercase tracking-wider flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Sell Your Car</span>
              </button>

              <button
                onClick={() => onNavigate('/contact')}
                id="hero-contact-btn"
                className="px-7 py-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 font-bold text-sm transition-all uppercase tracking-wider"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. QUICK SEARCH CARS BAR */}
      <section className="-mt-10 relative z-20 max-w-5xl mx-auto px-4 w-full">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Select Make
              </label>
              <select
                value={searchMake}
                onChange={(e) => setSearchMake(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
              >
                <option value="All">All Brands</option>
                <option value="Maruti Suzuki">Maruti Suzuki</option>
                <option value="Hyundai">Hyundai</option>
                <option value="Honda">Honda</option>
                <option value="Tata">Tata</option>
                <option value="Kia">Kia</option>
                <option value="Toyota">Toyota</option>
                <option value="Mahindra">Mahindra</option>
                <option value="BMW">BMW</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Max Budget
              </label>
              <select
                value={searchBudget}
                onChange={(e) => setSearchBudget(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
              >
                <option value="">Any Budget</option>
                <option value="500000">Under ₹5 Lakhs</option>
                <option value="800000">Under ₹8 Lakhs</option>
                <option value="1200000">Under ₹12 Lakhs</option>
                <option value="1800000">Under ₹18 Lakhs</option>
                <option value="2500000">Under ₹25 Lakhs</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Fuel Type
              </label>
              <select
                value={searchFuel}
                onChange={(e) => setSearchFuel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white text-sm font-semibold rounded-xl px-4 py-3 focus:outline-none focus:border-red-500"
              >
                <option value="All">All Fuel Types</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-950/60 uppercase tracking-wider"
            >
              <Search className="w-4 h-4" />
              <span>Search Inventory</span>
            </button>
          </form>
        </div>
      </section>

      {/* 4. FEATURED CARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
              Handpicked Showroom Selection
            </span>
            <h2 className="text-3xl font-black text-white">Featured Cars in Karol Bagh</h2>
            <p className="text-sm text-slate-400 mt-1">
              Pristine condition, verified service history, and ready for instant delivery.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/cars')}
            className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 uppercase tracking-wider group"
          >
            <span>View All Inventory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 bg-slate-900 rounded-2xl border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={(slug) => onNavigate(`/cars/${slug}`)}
                onEnquire={(car) => {
                  setSelectedCar(car);
                  setEnquiryModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>

      {/* 5. RECENTLY ADDED CARS */}
      <section className="py-16 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 block mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Fresh Arrivals
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Recently Added Vehicles</h2>
            </div>
            <button
              onClick={() => onNavigate('/cars?sort=newest')}
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <span>See Latest</span>
              <ArrowRight className="w-4 h-4 text-red-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentCars.slice(0, 3).map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={(slug) => onNavigate(`/cars/${slug}`)}
                onEnquire={(car) => {
                  setSelectedCar(car);
                  setEnquiryModalOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* RECENTLY VIEWED CARS */}
      <RecentlyViewedSection
        onNavigate={onNavigate}
        onEnquire={(car) => {
          setSelectedCar(car);
          setEnquiryModalOpen(true);
        }}
      />

      {/* 6. WHY TRUSTED CARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
            The Trusted Cars Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Why Buy From Trusted Cars?</h2>
          <p className="text-sm text-slate-400 mt-2">
            Founded by Hitesh Modi in Karol Bagh, we eliminate the uncertainty of buying pre-owned vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: '200-Point Inspection',
              desc: 'Engine, transmission, electricals, structure, and cosmetics rigorously tested by certified engineers.',
            },
            {
              icon: CheckCircle2,
              title: 'Non-Accidental Guarantee',
              desc: 'Zero chassis damage, flood damage, or meter tampering. Full legal document verification.',
            },
            {
              icon: Zap,
              title: 'Instant Loan Approval',
              desc: 'Paperless financing approvals with leading banks starting at 8.9% interest rate.',
            },
            {
              icon: Award,
              title: '7-Day Moneyback',
              desc: 'Complete peace of mind. Drive for 7 days, if you do not love it, return for a full refund.',
            },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800 text-red-500 flex items-center justify-center mb-5 shadow-lg">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section className="py-20 bg-slate-900/80 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-black text-white">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Find Your Car', desc: 'Browse our curated online inventory of certified cars with high-res photos & specs.' },
              { num: '02', title: 'Book Test Drive', desc: 'Schedule a free test drive at our Karol Bagh showroom or at your doorstep.' },
              { num: '03', title: 'Paperless Finance', desc: 'Get instant loan pre-approval with minimal documentation in 30 minutes.' },
              { num: '04', title: 'Drive Home Happy', desc: 'Complete RTO transfer and drive home your quality pre-owned car!' },
            ].map((step, idx) => (
              <div key={idx} className="relative bg-slate-950 border border-slate-800 p-6 rounded-2xl">
                <span className="text-3xl font-black text-red-500/80 block mb-3 font-mono">{step.num}</span>
                <h3 className="text-base font-bold text-white mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. EMI / FINANCE CALCULATOR */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <EmiCalculator onApplyLoan={handleApplyLoanFromEmi} />
      </section>

      {/* 9. SELL YOUR CAR CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-red-950 via-slate-900 to-slate-950 border-y border-red-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800/80 px-3 py-1 rounded-full inline-block">
              Instant Valuation
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Want To Sell Your Car in Delhi?</h2>
            <p className="text-sm text-slate-300 max-w-xl">
              Get the best price for your used vehicle. Same-day inspection at Karol Bagh, instant payment, and hassle-free RTO transfer.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/sell')}
            className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-red-950 flex items-center gap-2 shrink-0"
          >
            <span>Get Instant Car Valuation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* 10. CUSTOMER REVIEWS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
            Verified Customer Stories
          </span>
          <h2 className="text-3xl font-black text-white">Trusted By 2,500+ Buyers in Delhi</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Amitabh Saxena',
              loc: 'Rajendra Nagar, Delhi',
              car: 'Bought Honda City (2020)',
              review: 'Hitesh Modi ji at Trusted Cars made the process seamless. The car condition matched 100% with the inspection report. Financing was done within 2 hours.',
            },
            {
              name: 'Pooja Aggarwal',
              loc: 'Model Town, Delhi',
              car: 'Bought Hyundai Creta (2021)',
              review: 'Best pre-owned dealership experience in Karol Bagh! No pushy sales staff, clean paperwork, and non-accidental guarantee gave me total confidence.',
            },
            {
              name: 'Rohan Oberoi',
              loc: 'Gurgaon',
              car: 'Bought Maruti Baleno (2022)',
              review: 'Transparent pricing with zero hidden handling fees. RC transfer was completed on time. Highly recommended for pre-owned cars!',
            },
          ].map((rev, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex text-amber-400 gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic mb-4">"{rev.review}"</p>
              </div>
              <div className="pt-4 border-t border-slate-800">
                <h4 className="text-sm font-bold text-white">{rev.name}</h4>
                <p className="text-[11px] text-slate-400">{rev.loc} • <span className="text-red-400 font-semibold">{rev.car}</span></p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. FAQ ACCORDION */}
      <section className="py-20 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-2">
              Common Questions
            </span>
            <h2 className="text-3xl font-black text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Where is Trusted Cars showroom located in Delhi?',
                a: 'Our flagship showroom is located at Shop No. 12-14, Block 5, Saraswati Marg, Karol Bagh, New Delhi 110005.',
              },
              {
                q: 'How do you verify car quality and non-accidental status?',
                a: 'Every vehicle undergoes a thorough 200-point inspection covering engine health, chassis geometry, paint depth, electricals, and RTO meter reading history.',
              },
              {
                q: 'What documents are provided with the car purchase?',
                a: 'You receive the Original RC, Insurance policy, NOC (if applicable), Service records, 2 keys, and official invoice with RTO transfer guarantee.',
              },
              {
                q: 'Can I get a loan on a pre-owned car?',
                a: 'Yes! We have official tie-ups with HDFC Bank, ICICI Bank, Axis Bank, and SBI for up to 85%-90% loan funding with flexible tenures up to 7 years.',
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-white flex items-center justify-between gap-4"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-red-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. SHOWROOM CONTACT */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 block">
              Visit Showroom Today
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Trusted Cars Showroom
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Walk in for a hot cup of coffee and a hassle-free test drive experience. Meet our owner Hitesh Modi and sales team in Karol Bagh.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span className="text-slate-200">{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="font-bold text-white hover:text-red-400">
                  {settings.phone}
                </a>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => onNavigate('/contact')}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Get Location & Hours
              </button>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Send Direct Showroom Enquiry</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSelectedCar(null);
                setEnquiryModalOpen(true);
              }}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Your Name"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-500"
              />
              <input
                type="tel"
                placeholder="Your Phone Number"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:border-red-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Request Callback
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 13. FOOTER */}
      <Footer onNavigate={onNavigate} />

      {/* ENQUIRY MODAL */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        car={selectedCar}
      />
    </div>
  );
};
