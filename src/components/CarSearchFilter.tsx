import React from 'react';
import { Search, Filter, RotateCcw, X, ChevronDown } from 'lucide-react';

interface CarSearchFilterProps {
  filterOptions: {
    makes: string[];
    models: string[];
    bodyTypes: string[];
    fuelTypes: string[];
  };
  filters: Record<string, any>;
  onFilterChange: (key: string, value: any) => void;
  onResetFilters: () => void;
  totalResults?: number;
}

export const CarSearchFilter: React.FC<CarSearchFilterProps> = ({
  filterOptions,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults,
}) => {
  const makes = filterOptions.makes || ['Maruti Suzuki', 'Hyundai', 'Honda', 'Tata', 'Kia', 'Toyota', 'Mahindra', 'BMW'];
  const bodyTypes = filterOptions.bodyTypes || ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury'];
  const fuelTypes = filterOptions.fuelTypes || ['Petrol', 'Diesel', 'CNG', 'Electric'];

  const hasActiveFilters = Object.keys(filters).some((k) => {
    if (k === 'page' || k === 'limit' || k === 'status') return false;
    const v = filters[k];
    return v !== '' && v !== 'All' && v !== undefined && v !== null;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl mb-8">
      {/* SEARCH BAR & HEADER */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="relative w-full lg:max-w-xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by make, model, variant e.g. Creta, Dzire..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between w-full lg:w-auto gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Sort By:</span>
            <select
              value={filters.sort || 'newest'}
              onChange={(e) => onFilterChange('sort', e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500"
            >
              <option value="newest">Newest Listed</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="km_asc">KM: Low to High</option>
              <option value="year_desc">Model Year: Newest</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1 py-2 px-3 rounded-lg bg-red-950/40 border border-red-900/60 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER DROPDOWNS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-5">
        {/* MAKE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Make</label>
          <select
            value={filters.make || 'All'}
            onChange={(e) => onFilterChange('make', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="All">All Makes</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* FUEL TYPE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Fuel</label>
          <select
            value={filters.fuel || 'All'}
            onChange={(e) => onFilterChange('fuel', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="All">All Fuel Types</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* TRANSMISSION */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Transmission</label>
          <select
            value={filters.transmission || 'All'}
            onChange={(e) => onFilterChange('transmission', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="All">All Transmissions</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        {/* BODY TYPE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Body Type</label>
          <select
            value={filters.bodyType || 'All'}
            onChange={(e) => onFilterChange('bodyType', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="All">All Body Types</option>
            {bodyTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* MAX PRICE */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Max Price</label>
          <select
            value={filters.maxPrice || ''}
            onChange={(e) => onFilterChange('maxPrice', e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="">Any Budget</option>
            <option value="500000">Under ₹5 Lakhs</option>
            <option value="800000">Under ₹8 Lakhs</option>
            <option value="1200000">Under ₹12 Lakhs</option>
            <option value="1800000">Under ₹18 Lakhs</option>
            <option value="2500000">Under ₹25 Lakhs</option>
          </select>
        </div>

        {/* MODEL YEAR */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Min Year</label>
          <select
            value={filters.minYear || ''}
            onChange={(e) => onFilterChange('minYear', e.target.value ? Number(e.target.value) : '')}
            className="w-full bg-slate-950 border border-slate-800 text-white text-xs font-medium rounded-xl px-3 py-2 focus:outline-none focus:border-red-500"
          >
            <option value="">Any Year</option>
            <option value="2022">2022 & Newer</option>
            <option value="2020">2020 & Newer</option>
            <option value="2018">2018 & Newer</option>
          </select>
        </div>
      </div>

      {/* ACTIVE TAGS */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-slate-800 text-xs">
          <span className="text-slate-500 font-medium">Active Filters:</span>
          {filters.make && filters.make !== 'All' && (
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              Make: {filters.make}
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-white" onClick={() => onFilterChange('make', 'All')} />
            </span>
          )}
          {filters.fuel && filters.fuel !== 'All' && (
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              Fuel: {filters.fuel}
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-white" onClick={() => onFilterChange('fuel', 'All')} />
            </span>
          )}
          {filters.transmission && filters.transmission !== 'All' && (
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              {filters.transmission}
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-white" onClick={() => onFilterChange('transmission', 'All')} />
            </span>
          )}
          {filters.maxPrice && (
            <span className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              Max: ₹{(filters.maxPrice / 100000).toFixed(1)} L
              <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-white" onClick={() => onFilterChange('maxPrice', '')} />
            </span>
          )}
        </div>
      )}
    </div>
  );
};
