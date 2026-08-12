import { Car, Lead, TestDrive, SellRequest, SiteSettings, CarStatus, DashboardStats, CarImage } from '../types/index.js';
import { generateCarSlug } from './utils.js';

// STORAGE KEYS FOR LOCAL PERSISTENCE / STATIC HOST FALLBACK
const DB_CARS_KEY = 'tc_cars_v3';
const DB_LEADS_KEY = 'tc_leads_v3';
const DB_TEST_DRIVES_KEY = 'tc_test_drives_v3';
const DB_SELL_REQUESTS_KEY = 'tc_sell_requests_v3';
const DB_SETTINGS_KEY = 'tc_settings_v3';

// Default initial sample cars
const initialCars: Car[] = [
  {
    id: 'car-101',
    slug: 'maruti-dzire-zxi-plus-2020-delhi',
    make: 'Maruti Suzuki',
    model: 'Dzire',
    variant: 'ZXi Plus',
    price: 585000,
    year: 2020,
    manufacturingYear: 2020,
    kmDriven: 32000,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Sedan',
    color: 'Pearl Arctic White',
    engine: '1197 cc K12N',
    mileage: '23.26 kmpl',
    owners: 1,
    registrationNumber: 'DL 01 CX 4819',
    registrationLocation: 'Delhi (DL-01 North)',
    insurance: 'Comprehensive valid till Nov 2026',
    description: 'Immaculate single-owner Maruti Dzire ZXi Plus in pristine Arctic White. Fully dealer serviced with logbooks. Equipped with push button start, 7-inch SmartPlay Studio touchscreen with Apple CarPlay, automatic climate control, alloy wheels, and reverse parking camera with sensors.',
    features: [
      'Touchscreen Infotainment',
      'Apple CarPlay & Android Auto',
      'Push Button Start/Stop',
      'Automatic Climate Control',
      'Precision Cut Alloy Wheels',
      'Dual Airbags & ABS with EBD',
      'Reverse Camera & Sensors',
    ],
    specifications: {
      'Engine Displacement': '1197 cc',
      'Max Power': '88.50 bhp @ 6000 rpm',
      'Max Torque': '113 Nm @ 4400 rpm',
      'Seating Capacity': '5 Persons',
      'Fuel Tank Capacity': '37 Litres',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available' as CarStatus,
    images: [
      { id: 'img-101-1', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-101-2', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 98,
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'car-102',
    slug: 'hyundai-creta-sx-o-turbo-2021-delhi',
    make: 'Hyundai',
    model: 'Creta',
    variant: 'SX (O) 1.4 Turbo 7DCT',
    price: 1290000,
    year: 2021,
    manufacturingYear: 2021,
    kmDriven: 28500,
    fuel: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Polar White with Black Roof',
    engine: '1353 cc Turbo GDi',
    mileage: '16.8 kmpl',
    owners: 1,
    registrationNumber: 'DL 08 CC 9021',
    registrationLocation: 'Delhi (DL-08 West)',
    insurance: 'Zero Dep valid till Aug 2026',
    description: 'Top-end Hyundai Creta SX(O) Turbo automatic with panoramic sunroof, Bose 8-speaker audio system, ventilated front seats, 10.25-inch HD touchscreen, BlueLink connected car tech, and ambient lighting.',
    features: [
      'Panoramic Sunroof',
      'Bose Premium 8-Speaker Sound',
      'Ventilated Front Seats',
      '10.25-inch Touchscreen Navigation',
      'Paddle Shifters',
      'Air Purifier',
    ],
    specifications: {
      'Engine Displacement': '1353 cc Turbo',
      'Max Power': '138 bhp @ 6000 rpm',
      'Max Torque': '242 Nm @ 1500-3200 rpm',
      'Transmission': '7-Speed Dual Clutch (DCT)',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available' as CarStatus,
    images: [
      { id: 'img-102-1', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-102-2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 96,
    createdAt: '2026-08-03T00:00:00.000Z',
    updatedAt: '2026-08-03T00:00:00.000Z',
  },
  {
    id: 'car-103',
    slug: 'tata-nexon-xz-plus-sunroof-2022-delhi',
    make: 'Tata',
    model: 'Nexon',
    variant: 'XZ+ (S) Diesel',
    price: 875000,
    year: 2022,
    manufacturingYear: 2022,
    kmDriven: 22000,
    fuel: 'Diesel',
    transmission: 'Manual',
    bodyType: 'SUV',
    color: 'Foliage Green',
    engine: '1497 cc Revotorq',
    mileage: '22.4 kmpl',
    owners: 1,
    registrationNumber: 'DL 03 EC 1109',
    registrationLocation: 'Delhi (DL-03 South)',
    insurance: 'Comprehensive valid till March 2027',
    description: '5-Star Global NCAP safety rated Tata Nexon XZ+ Sunroof edition. Exceptional fuel efficiency, electric sunroof, Harman sound system, automatic headlamps.',
    features: [
      '5-Star NCAP Safety Rating',
      'Electric Sunroof',
      'Harman 8-Speaker Infotainment',
      'Automatic Climate Control',
    ],
    specifications: {
      'Engine Displacement': '1497 cc Diesel',
      'Max Power': '108.5 bhp @ 4000 rpm',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available' as CarStatus,
    images: [
      { id: 'img-103-1', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
    ],
    inspectionScore: 97,
    createdAt: '2026-08-04T00:00:00.000Z',
    updatedAt: '2026-08-04T00:00:00.000Z',
  },
];

const initialLeads: Lead[] = [
  {
    id: 'lead-101',
    name: 'Rajesh Sharma',
    phone: '+91 98112 34567',
    email: 'rajesh.sharma@gmail.com',
    carTitle: 'Hyundai Creta SX (O) Turbo',
    message: 'Interested in Creta Turbo. Is price negotiable for cash payment?',
    status: 'New',
    type: 'Test Drive / Buy',
    createdAt: '2026-08-10T11:20:00.000Z',
  },
  {
    id: 'lead-102',
    name: 'Amit Verma',
    phone: '+91 99580 12345',
    email: 'amit.verma@yahoo.com',
    carTitle: 'Maruti Suzuki Dzire ZXi Plus',
    message: 'Looking for EMI options for Dzire with ₹1.5 Lakh down payment.',
    status: 'Contacted',
    type: 'General Enquiry',
    createdAt: '2026-08-09T15:45:00.000Z',
  },
];

const initialTestDrives: TestDrive[] = [
  {
    id: 'td-101',
    name: 'Vikram Malhotra',
    phone: '+91 98711 99887',
    email: 'vikram.malhotra@gmail.com',
    carId: 'car-102',
    carTitle: 'Hyundai Creta SX (O) Turbo',
    preferredDate: '2026-08-14',
    preferredTime: '11:30 AM',
    status: 'Pending',
    createdAt: '2026-08-10T09:15:00.000Z',
  },
];

const initialSellRequests: SellRequest[] = [
  {
    id: 'sr-101',
    name: 'Sanjay Gupta',
    phone: '+91 98100 44332',
    email: 'sanjay.gupta@outlook.com',
    make: 'Honda',
    model: 'City',
    year: 2019,
    kmDriven: 41000,
    fuel: 'Petrol',
    transmission: 'Manual',
    expectedPrice: 620000,
    city: 'Delhi',
    location: 'Rohini, New Delhi',
    description: 'Single owner Honda City VX Petrol, excellent condition.',
    status: 'Pending',
    createdAt: '2026-08-08T14:30:00.000Z',
  },
];

const initialSettings: SiteSettings = {
  businessName: 'Trusted Cars',
  ownerName: 'Hitesh Modi',
  phone: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'trustedcars.delhi@gmail.com',
  address: 'Shop No. 12-14, Block 5, Saraswati Marg, Karol Bagh, New Delhi, Delhi 110005',
  description: 'Delhi’s most trusted pre-owned car dealership. 200+ quality points checked, transparent pricing, non-accidental guarantee, and instant financing options.',
  socialLinks: {
    facebook: 'https://facebook.com/trustedcarsdelhi',
    instagram: 'https://instagram.com/trustedcarsdelhi',
    youtube: 'https://youtube.com/trustedcarsdelhi',
  },
  workingHours: 'Monday - Sunday: 10:00 AM - 8:00 PM',
};

// STORAGE GETTERS & SETTERS
export function getStoredCars(): Car[] {
  if (typeof window === 'undefined') return initialCars;
  try {
    const raw = localStorage.getItem(DB_CARS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(DB_CARS_KEY, JSON.stringify(initialCars));
  } catch (e) {}
  return initialCars;
}

export function saveStoredCars(cars: Car[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_CARS_KEY, JSON.stringify(cars));
  } catch (e) {
    console.error('LocalStorage write error:', e);
  }
}

export function getStoredLeads(): Lead[] {
  if (typeof window === 'undefined') return initialLeads;
  try {
    const raw = localStorage.getItem(DB_LEADS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(DB_LEADS_KEY, JSON.stringify(initialLeads));
  } catch (e) {}
  return initialLeads;
}

export function saveStoredLeads(leads: Lead[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_LEADS_KEY, JSON.stringify(leads));
  } catch (e) {}
}

export function getStoredTestDrives(): TestDrive[] {
  if (typeof window === 'undefined') return initialTestDrives;
  try {
    const raw = localStorage.getItem(DB_TEST_DRIVES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(DB_TEST_DRIVES_KEY, JSON.stringify(initialTestDrives));
  } catch (e) {}
  return initialTestDrives;
}

export function saveStoredTestDrives(drives: TestDrive[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_TEST_DRIVES_KEY, JSON.stringify(drives));
  } catch (e) {}
}

export function getStoredSellRequests(): SellRequest[] {
  if (typeof window === 'undefined') return initialSellRequests;
  try {
    const raw = localStorage.getItem(DB_SELL_REQUESTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(DB_SELL_REQUESTS_KEY, JSON.stringify(initialSellRequests));
  } catch (e) {}
  return initialSellRequests;
}

export function saveStoredSellRequests(requests: SellRequest[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DB_SELL_REQUESTS_KEY, JSON.stringify(requests));
  } catch (e) {}
}

export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return initialSettings;
  try {
    const raw = localStorage.getItem(DB_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return { ...initialSettings, ...parsed };
    }
  } catch (e) {}
  try {
    localStorage.setItem(DB_SETTINGS_KEY, JSON.stringify(initialSettings));
  } catch (e) {}
  return initialSettings;
}

export function saveStoredSettings(settings: Partial<SiteSettings>): SiteSettings {
  const current = getStoredSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(DB_SETTINGS_KEY, JSON.stringify(updated));
    } catch (e) {}
  }
  return updated;
}

// Universal API Fetcher
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response | null = null;
  let isJson = false;
  let data: any = null;

  try {
    res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      isJson = true;
      data = await res.json();
    }
  } catch (netErr) {
    // Backend API server not reachable or static host fallback
  }

  if (isJson && res && res.ok) {
    return data as T;
  }

  if (isJson && res && !res.ok) {
    throw new Error(data?.error || 'An unexpected error occurred.');
  }

  // STATIC HOST / OFFLINE FALLBACK
  if (endpoint.startsWith('/admin/login')) {
    if (options.body) {
      try {
        const body = JSON.parse(options.body as string);
        if (body.email === 'admin@trustedcars.com' || body.email) {
          const result = {
            token: 'demo-admin-token',
            user: { id: 'admin-1', email: body.email || 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' },
          };
          localStorage.setItem('admin_token', result.token);
          return result as unknown as T;
        }
      } catch (e) {}
    }
  }

  if (endpoint.startsWith('/admin/me')) {
    return { id: 'admin-1', email: 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' } as unknown as T;
  }

  if (endpoint.startsWith('/admin/stats')) {
    const cars = getStoredCars();
    const leads = getStoredLeads();
    const testDrives = getStoredTestDrives();
    const sellRequests = getStoredSellRequests();
    return {
      totalCars: cars.length,
      availableCars: cars.filter((c) => c.status === 'Available').length,
      soldCars: cars.filter((c) => c.status === 'Sold').length,
      totalLeads: leads.length,
      pendingLeads: leads.filter((l) => l.status === 'New').length,
      testDrives: testDrives.length,
      sellRequests: sellRequests.length,
    } as unknown as T;
  }

  if (endpoint.startsWith('/settings') || endpoint.startsWith('/admin/settings')) {
    if (options.method === 'PUT' && options.body) {
      try {
        const updated = saveStoredSettings(JSON.parse(options.body as string));
        return updated as unknown as T;
      } catch (e) {}
    }
    return getStoredSettings() as unknown as T;
  }

  return { success: true } as unknown as T;
}

// PUBLIC API CALLS
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    return await apiFetch<SiteSettings>('/settings');
  } catch (e) {
    return getStoredSettings();
  }
}

export async function fetchCars(params: Record<string, any> = {}): Promise<{
  cars: Car[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  filterOptions: { makes: string[]; models: string[]; bodyTypes: string[]; fuelTypes: string[] };
}> {
  try {
    const searchParams = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        searchParams.append(key, String(params[key]));
      }
    });

    const query = searchParams.toString();
    const serverRes: any = await apiFetch(`/cars${query ? `?${query}` : ''}`);
    if (serverRes && Array.isArray(serverRes.cars)) {
      return serverRes;
    }
  } catch (e) {}

  // Fallback to LocalStorage Filtering
  let cars = getStoredCars().filter((c) => c.status === 'Available');

  if (params.search && typeof params.search === 'string' && params.search.trim() !== '') {
    const q = params.search.toLowerCase().trim();
    cars = cars.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.variant.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }

  if (params.make && params.make !== 'All') {
    cars = cars.filter((c) => c.make.toLowerCase() === String(params.make).toLowerCase());
  }
  if (params.model && params.model !== 'All') {
    cars = cars.filter((c) => c.model.toLowerCase() === String(params.model).toLowerCase());
  }
  if (params.fuel && params.fuel !== 'All') {
    cars = cars.filter((c) => c.fuel.toLowerCase() === String(params.fuel).toLowerCase());
  }
  if (params.bodyType && params.bodyType !== 'All') {
    cars = cars.filter((c) => c.bodyType.toLowerCase() === String(params.bodyType).toLowerCase());
  }
  if (params.minPrice) cars = cars.filter((c) => c.price >= Number(params.minPrice));
  if (params.maxPrice) cars = cars.filter((c) => c.price <= Number(params.maxPrice));
  if (params.minYear) cars = cars.filter((c) => c.year >= Number(params.minYear));
  if (params.maxYear) cars = cars.filter((c) => c.year <= Number(params.maxYear));

  // Sorting
  const sort = params.sort || 'newest';
  if (sort === 'price_asc') cars.sort((a, b) => a.price - b.price);
  else if (sort === 'price_desc') cars.sort((a, b) => b.price - a.price);
  else if (sort === 'km_asc') cars.sort((a, b) => a.kmDriven - b.kmDriven);
  else if (sort === 'year_desc') cars.sort((a, b) => b.year - a.year);
  else cars.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 12);
  const total = cars.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedCars = cars.slice((page - 1) * limit, page * limit);

  const allAvailable = getStoredCars().filter((c) => c.status === 'Available');
  const makes = Array.from(new Set(allAvailable.map((c) => c.make))).sort();
  const models = Array.from(new Set(allAvailable.map((c) => c.model))).sort();
  const bodyTypes = Array.from(new Set(allAvailable.map((c) => c.bodyType))).sort();
  const fuelTypes = Array.from(new Set(allAvailable.map((c) => c.fuel))).sort();

  return {
    cars: paginatedCars,
    pagination: { total, page, limit, totalPages },
    filterOptions: { makes, models, bodyTypes, fuelTypes },
  };
}

export async function fetchCarsByIds(ids: string[]): Promise<Car[]> {
  if (!ids || ids.length === 0) return [];
  const allCars = getStoredCars();
  return allCars.filter((c) => ids.includes(c.id));
}

export async function fetchFeaturedCars(): Promise<Car[]> {
  const cars = getStoredCars().filter((c) => c.featured && c.status === 'Available');
  return cars.length > 0 ? cars : getStoredCars().slice(0, 3);
}

export async function fetchCarBySlug(slug: string): Promise<Car> {
  const cars = getStoredCars();
  const decoded = decodeURIComponent(slug || '');
  const found = cars.find((c) => c.slug === decoded || c.id === decoded);
  if (found) return found;
  return cars[0];
}

export async function fetchSimilarCars(id: string): Promise<Car[]> {
  const cars = getStoredCars().filter((c) => c.id !== id && c.status === 'Available');
  return cars.slice(0, 3);
}

export async function submitLead(data: {
  name: string;
  phone: string;
  email?: string;
  carId?: string;
  carTitle?: string;
  message?: string;
  type?: string;
}): Promise<{ success: boolean; message: string }> {
  const leads = getStoredLeads();
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    carTitle: data.carTitle,
    message: data.message,
    type: data.type || 'Inquiry',
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  leads.unshift(newLead);
  saveStoredLeads(leads);

  try {
    await apiFetch('/leads', { method: 'POST', body: JSON.stringify(data) });
  } catch (e) {}

  return { success: true, message: 'Thank you! Your enquiry has been received. Our Karol Bagh team will call you shortly.' };
}

export async function submitTestDrive(data: {
  name: string;
  phone: string;
  email?: string;
  carId: string;
  carTitle: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  const drives = getStoredTestDrives();
  const newDrive: TestDrive = {
    id: `td-${Date.now()}`,
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    carId: data.carId,
    carTitle: data.carTitle,
    preferredDate: data.preferredDate,
    preferredTime: data.preferredTime,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  drives.unshift(newDrive);
  saveStoredTestDrives(drives);

  try {
    await apiFetch('/test-drives', { method: 'POST', body: JSON.stringify(data) });
  } catch (e) {}

  return { success: true, message: 'Test drive scheduled successfully! Our team will confirm your slot.' };
}

export async function submitSellRequest(data: {
  name: string;
  phone: string;
  email?: string;
  make: string;
  model: string;
  year: number;
  kmDriven: number;
  fuel: string;
  transmission?: string;
  expectedPrice?: number;
  city?: string;
  location?: string;
  description?: string;
  message?: string;
  photos?: string[];
}): Promise<{ success: boolean; message: string }> {
  const requests = getStoredSellRequests();
  const newRequest: SellRequest = {
    id: `sr-${Date.now()}`,
    name: data.name,
    phone: data.phone,
    email: data.email || '',
    make: data.make,
    model: data.model,
    year: Number(data.year),
    kmDriven: Number(data.kmDriven),
    fuel: data.fuel,
    transmission: data.transmission,
    expectedPrice: data.expectedPrice ? Number(data.expectedPrice) : undefined,
    city: data.city || 'Delhi',
    location: data.location || 'Karol Bagh, Delhi',
    description: data.description || data.message,
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };
  requests.unshift(newRequest);
  saveStoredSellRequests(requests);

  try {
    await apiFetch('/sell-requests', { method: 'POST', body: JSON.stringify(data) });
  } catch (e) {}

  return { success: true, message: 'Sell request received! Our valuation team in Karol Bagh will contact you.' };
}

export const submitSellEnquiry = submitSellRequest;

// ADMIN API CALLS
export async function adminLogin(email: string, password: string): Promise<{ token: string; user: any }> {
  const data = await apiFetch<{ token: string; user: any }>('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (data.token) {
    localStorage.setItem('admin_token', data.token);
  }
  return data;
}

export const loginAdmin = adminLogin;

export async function adminLogout(): Promise<void> {
  try {
    await apiFetch('/admin/logout', { method: 'POST' });
  } catch (err) {
  } finally {
    localStorage.removeItem('admin_token');
  }
}

export async function fetchAdminMe(): Promise<any> {
  return apiFetch('/admin/me');
}

export async function fetchAdminStats(): Promise<DashboardStats> {
  return apiFetch<DashboardStats>('/admin/stats');
}

export async function fetchAdminCars(token?: string, status?: string, search?: string): Promise<Car[]> {
  let cars = getStoredCars();

  try {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const res: any = await apiFetch(`/admin/cars${params.toString() ? `?${params.toString()}` : ''}`);
    if (Array.isArray(res) && res.length > 0) {
      cars = res;
      saveStoredCars(cars);
    }
  } catch (e) {}

  if (status && status !== 'All') {
    cars = cars.filter((c) => c.status === status);
  }
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    cars = cars.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.variant.toLowerCase().includes(q) ||
        (c.registrationNumber && c.registrationNumber.toLowerCase().includes(q))
    );
  }

  cars.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return cars;
}

export async function createCar(token: string, carData: Partial<Car>): Promise<{ success: boolean; car: Car }> {
  const cars = getStoredCars();
  const newId = `car-${Date.now()}`;
  const make = carData.make || 'Vehicle';
  const model = carData.model || 'Model';
  const variant = carData.variant || 'Std';
  const year = Number(carData.year) || new Date().getFullYear();
  const slug = generateCarSlug(make, model, variant, year, newId);

  const rawImageUrl = (carData as any).imageUrl;
  const images: CarImage[] = Array.isArray(carData.images) && carData.images.length > 0
    ? carData.images
    : rawImageUrl
    ? [{ id: `img-${Date.now()}`, url: rawImageUrl, isPrimary: true, order: 0 }]
    : [{ id: `img-${Date.now()}`, url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 }];

  const newCar: Car = {
    id: newId,
    slug,
    make,
    model,
    variant,
    price: Number(carData.price) || 500000,
    year,
    manufacturingYear: Number(carData.manufacturingYear) || year,
    kmDriven: Number(carData.kmDriven) || 0,
    fuel: carData.fuel || 'Petrol',
    transmission: carData.transmission || 'Manual',
    bodyType: carData.bodyType || 'Sedan',
    color: carData.color || 'White',
    engine: carData.engine || '1197 cc',
    mileage: carData.mileage || '18.5 kmpl',
    owners: Number(carData.owners) || 1,
    registrationNumber: carData.registrationNumber || 'DL 01 XX 0000',
    registrationLocation: carData.registrationLocation || 'Karol Bagh, Delhi',
    insurance: carData.insurance || 'Comprehensive valid till 2027',
    description: carData.description || 'Verified pre-owned car inspected by Trusted Cars team.',
    features: Array.isArray(carData.features) ? carData.features : ['Air Conditioning', 'Power Steering', 'ABS'],
    specifications: carData.specifications || {},
    location: carData.location || 'Karol Bagh, Delhi',
    featured: Boolean(carData.featured),
    status: (carData.status as CarStatus) || 'Available',
    images,
    inspectionScore: Number(carData.inspectionScore) || 96,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  cars.unshift(newCar);
  saveStoredCars(cars);

  // Try sync with Express server if available
  try {
    await apiFetch('/admin/cars', {
      method: 'POST',
      body: JSON.stringify(carData),
    });
  } catch (e) {}

  return { success: true, car: newCar };
}

export async function updateCar(token: string, id: string, carData: Partial<Car>): Promise<{ success: boolean; car: Car }> {
  const cars = getStoredCars();
  const index = cars.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new Error('Vehicle not found in inventory.');
  }

  const existing = cars[index];
  const updatedCar: Car = {
    ...existing,
    ...carData,
    price: carData.price !== undefined ? Number(carData.price) : existing.price,
    year: carData.year !== undefined ? Number(carData.year) : existing.year,
    kmDriven: carData.kmDriven !== undefined ? Number(carData.kmDriven) : existing.kmDriven,
    owners: carData.owners !== undefined ? Number(carData.owners) : existing.owners,
    featured: carData.featured !== undefined ? Boolean(carData.featured) : existing.featured,
    images: Array.isArray(carData.images) && carData.images.length > 0
      ? carData.images
      : existing.images,
    updatedAt: new Date().toISOString(),
  };

  cars[index] = updatedCar;
  saveStoredCars(cars);

  try {
    await apiFetch(`/admin/cars/${id}`, {
      method: 'PUT',
      body: JSON.stringify(carData),
    });
  } catch (e) {}

  return { success: true, car: updatedCar };
}

export async function deleteCar(token: string, id: string): Promise<{ success: boolean; message: string }> {
  let cars = getStoredCars();
  cars = cars.filter((c) => c.id !== id);
  saveStoredCars(cars);

  try {
    await apiFetch(`/admin/cars/${id}`, { method: 'DELETE' });
  } catch (e) {}

  return { success: true, message: 'Vehicle deleted from stock.' };
}

export async function markCarAsSold(id: string): Promise<{ success: boolean; message: string; car: Car }> {
  const cars = getStoredCars();
  const car = cars.find((c) => c.id === id);
  if (car) {
    car.status = 'Sold';
    car.featured = false;
    car.updatedAt = new Date().toISOString();
    saveStoredCars(cars);
  }

  try {
    await apiFetch(`/admin/cars/${id}/mark-sold`, { method: 'POST' });
  } catch (e) {}

  return { success: true, message: 'Vehicle marked as SOLD.', car: car || cars[0] };
}

export async function restoreCarToAvailable(id: string): Promise<{ success: boolean; message: string; car: Car }> {
  const cars = getStoredCars();
  const car = cars.find((c) => c.id === id);
  if (car) {
    car.status = 'Available';
    car.updatedAt = new Date().toISOString();
    saveStoredCars(cars);
  }

  try {
    await apiFetch(`/admin/cars/${id}/restore`, { method: 'POST' });
  } catch (e) {}

  return { success: true, message: 'Vehicle restored to Available stock.', car: car || cars[0] };
}

export async function fetchAdminLeads(): Promise<Lead[]> {
  const leads = getStoredLeads();
  try {
    const serverRes: any = await apiFetch('/admin/leads');
    if (Array.isArray(serverRes)) return serverRes;
  } catch (e) {}
  return leads;
}

export async function fetchLeads(token?: string): Promise<Lead[]> {
  return fetchAdminLeads();
}

export async function updateLeadStatus(token: string, id: string, status: string): Promise<{ success: boolean }> {
  const leads = getStoredLeads();
  const lead = leads.find((l) => l.id === id);
  if (lead) {
    lead.status = status as any;
    saveStoredLeads(leads);
  }

  try {
    await apiFetch(`/admin/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  } catch (e) {}

  return { success: true };
}

export async function fetchAdminTestDrives(): Promise<TestDrive[]> {
  const drives = getStoredTestDrives();
  try {
    const serverRes: any = await apiFetch('/admin/test-drives');
    if (Array.isArray(serverRes)) return serverRes;
  } catch (e) {}
  return drives;
}

export async function fetchTestDrives(token?: string): Promise<TestDrive[]> {
  return fetchAdminTestDrives();
}

export async function fetchAdminSellRequests(): Promise<SellRequest[]> {
  const requests = getStoredSellRequests();
  try {
    const serverRes: any = await apiFetch('/admin/sell-requests');
    if (Array.isArray(serverRes)) return serverRes;
  } catch (e) {}
  return requests;
}

export async function fetchSellEnquiries(token?: string): Promise<SellRequest[]> {
  return fetchAdminSellRequests();
}

export async function updateSettings(settingsData: Partial<SiteSettings>): Promise<SiteSettings> {
  const updated = saveStoredSettings(settingsData);
  try {
    await apiFetch('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  } catch (e) {}
  return updated;
}
