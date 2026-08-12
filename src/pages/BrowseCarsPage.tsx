import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import { CarCard } from '../components/CarCard.js';
import { CarSearchFilter } from '../components/CarSearchFilter.js';
import { RecentlyViewedSection } from '../components/RecentlyViewedSection.js';
import { EnquiryModal } from '../components/EnquiryModal.js';
import { fetchCars } from '../lib/api.js';
import { Car } from '../types/index.js';
import { Car as CarIcon, AlertCircle, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

interface BrowseCarsPageProps {
  onNavigate: (path: string) => void;
  initialQuery?: string;
}

export const BrowseCarsPage: React.FC<BrowseCarsPageProps> = ({ onNavigate, initialQuery = '' }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [filterOptions, setFilterOptions] = useState({
    makes: [],
    models: [],
    bodyTypes: [],
    fuelTypes: [],
  });

  // Filter state
  const [filters, setFilters] = useState<Record<string, any>>(() => {
    const params = new URLSearchParams(initialQuery || (typeof window !== 'undefined' ? window.location.search : ''));
    return {
      search: params.get('search') || '',
      make: params.get('make') || 'All',
      model: params.get('model') || 'All',
      fuel: params.get('fuel') || 'All',
      transmission: params.get('transmission') || 'All',
      bodyType: params.get('bodyType') || 'All',
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : '',
      minYear: params.get('minYear') ? Number(params.get('minYear')) : '',
      sort: params.get('sort') || 'newest',
      page: Number(params.get('page')) || 1,
    };
  });

  // Modal State
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  const loadCarsData = async (currentFilters: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await fetchCars(currentFilters);
      if (res) {
        setCars(Array.isArray(res.cars) ? res.cars : []);
        if (res.pagination) {
          setPagination({
            page: res.pagination.page,
            totalPages: res.pagination.totalPages,
            total: res.pagination.total,
          });
        }
        if (res.filterOptions) {
          setFilterOptions(res.filterOptions as any);
        }
      }
    } catch (err) {
      console.error('Failed to load cars inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCarsData(filters);

    // Sync URL params without page reload for shareability
    const searchParams = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== '' && filters[key] !== 'All' && filters[key] !== undefined && filters[key] !== null) {
        searchParams.set(key, String(filters[key]));
      }
    });

    const newQuery = searchParams.toString();
    const newRelativePathQuery = window.location.pathname + (newQuery ? `?${newQuery}` : '');
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [filters]);

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key === 'page' ? value : 1, // reset page on filter change
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      make: 'All',
      model: 'All',
      fuel: 'All',
      transmission: 'All',
      bodyType: 'All',
      maxPrice: '',
      minYear: '',
      sort: 'newest',
      page: 1,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header currentPath="/cars" onNavigate={onNavigate} />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* PAGE TITLE */}
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500 block mb-1">
            Certified Inventory • Karol Bagh, Delhi
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white">Pre-Owned Cars For Sale</h1>
            <p className="text-sm text-slate-400 font-semibold">
              Showing <span className="text-white font-bold">{pagination.total}</span> Quality Certified Vehicles
            </p>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <CarSearchFilter
          filterOptions={filterOptions}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          totalResults={pagination.total}
        />

        {/* CARS GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-96 bg-slate-900 rounded-2xl border border-slate-800" />
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center my-8">
            <AlertCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No Cars Matched Your Criteria</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Try adjusting your price range, fuel type, or brand filters to see available inventory in Delhi.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                onViewDetails={(slug) => onNavigate(`/cars/${slug}`)}
                onEnquire={(c) => {
                  setSelectedCar(c);
                  setEnquiryModalOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 my-12">
            <button
              disabled={pagination.page <= 1}
              onClick={() => handleFilterChange('page', pagination.page - 1)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {[...Array(pagination.totalPages)].map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => handleFilterChange('page', p)}
                  className={`w-10 h-10 rounded-xl font-bold text-xs transition-all ${
                    pagination.page === p
                      ? 'bg-red-600 text-white shadow-md shadow-red-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              );
            })}

            <button
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => handleFilterChange('page', pagination.page + 1)}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* RECENTLY VIEWED CARS */}
        <RecentlyViewedSection
          onNavigate={onNavigate}
          onEnquire={(car) => {
            setSelectedCar(car);
            setEnquiryModalOpen(true);
          }}
          className="mt-12 rounded-3xl border border-slate-800"
        />
      </main>

      <Footer onNavigate={onNavigate} />

      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        car={selectedCar}
      />
    </div>
  );
};
