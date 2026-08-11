import React, { useState, useEffect } from 'react';
import { Car } from '../types/index.js';
import { fetchCarsByIds } from '../lib/api.js';
import { getRecentlyViewedCarIds, clearRecentlyViewedCarIds } from '../lib/recentlyViewed.js';
import { CarCard } from './CarCard.js';
import { Clock, Trash2, ArrowRight, Eye } from 'lucide-react';

interface RecentlyViewedSectionProps {
  onNavigate: (path: string) => void;
  onEnquire?: (car: Car) => void;
  className?: string;
}

export const RecentlyViewedSection: React.FC<RecentlyViewedSectionProps> = ({
  onNavigate,
  onEnquire,
  className = '',
}) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRecentlyViewed = async () => {
    setLoading(true);
    try {
      const ids = getRecentlyViewedCarIds();
      if (ids.length === 0) {
        setCars([]);
        setLoading(false);
        return;
      }
      const fetched = await fetchCarsByIds(ids);
      setCars(fetched || []);
    } catch (err) {
      console.error('Error fetching recently viewed cars:', err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecentlyViewed();

    const handleStorageChange = () => {
      loadRecentlyViewed();
    };

    window.addEventListener('recentlyViewedChanged', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('recentlyViewedChanged', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleClear = () => {
    clearRecentlyViewedCarIds();
    setCars([]);
  };

  return (
    <section className={`py-16 bg-slate-900/40 border-y border-slate-800/80 ${className}`} id="recently-viewed-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 block mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-red-500" /> Personalized Browsing History
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Recently Viewed Cars</span>
              {cars.length > 0 && (
                <span className="text-xs font-extrabold bg-red-950 border border-red-800 text-red-400 px-2.5 py-0.5 rounded-full">
                  {cars.length} {cars.length === 1 ? 'vehicle' : 'vehicles'}
                </span>
              )}
            </h2>
          </div>

          {cars.length > 0 && (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors shrink-0 self-start sm:self-auto"
              title="Clear browsing history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-80 bg-slate-900/80 rounded-2xl border border-slate-800" />
            ))}
          </div>
        ) : cars.length > 0 ? (
          /* CARS GRID (Max 5 items) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {cars.slice(0, 5).map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={(slug) => onNavigate(`/cars/${slug}`)}
                onEnquire={onEnquire}
              />
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-8 sm:p-10 text-center max-w-xl mx-auto space-y-4 shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Eye className="w-6 h-6 text-slate-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">No Recently Viewed Cars</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                As you explore our inventory, vehicles you view will automatically appear here for quick access and comparison.
              </p>
            </div>
            <button
              onClick={() => onNavigate('/cars')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-950/50"
            >
              <span>Explore All Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
