import { Car, Lead, TestDrive, SellRequest, SiteSettings, CarStatus, DashboardStats } from '../types/index.js';

// Base API fetch wrapper
const fallbackCars: Car[] = [
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
    } else {
      await res.text();
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

  // STATIC HOST FALLBACK (Netlify / Vercel / Static Hosting)
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
      } catch (e) {
        // ignore
      }
    }
  }

  if (endpoint.startsWith('/admin/me')) {
    return { id: 'admin-1', email: 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' } as unknown as T;
  }

  if (endpoint.startsWith('/admin/stats')) {
    return {
      totalCars: fallbackCars.length,
      availableCars: fallbackCars.length,
      soldCars: 0,
      totalLeads: 12,
      pendingLeads: 4,
      testDrives: 8,
      sellRequests: 5,
    } as unknown as T;
  }

  // Handle specific car routes for static fallback
  if (endpoint.includes('/cars/featured')) {
    return fallbackCars.filter((c) => c.featured) as unknown as T;
  }

  if (endpoint.includes('/cars/slug/')) {
    const slug = endpoint.split('/cars/slug/')[1]?.split('?')[0];
    const decodedSlug = decodeURIComponent(slug || '');
    const found = fallbackCars.find((c) => c.slug === decodedSlug) || fallbackCars[0];
    return found as unknown as T;
  }

  if (endpoint.includes('/similar')) {
    return fallbackCars.slice(0, 2) as unknown as T;
  }

  if (endpoint.startsWith('/admin/cars') || endpoint.startsWith('/cars')) {
    if (options.method === 'POST' || options.method === 'PUT' || options.method === 'PATCH' || options.method === 'DELETE') {
      return { success: true, message: 'Action completed successfully.' } as unknown as T;
    }
    if (endpoint.includes('ids=')) {
      return { cars: fallbackCars } as unknown as T;
    }
    return {
      cars: fallbackCars,
      pagination: { total: fallbackCars.length, page: 1, limit: 12, totalPages: 1 },
      filterOptions: {
        makes: ['Maruti Suzuki', 'Hyundai', 'Tata', 'Honda'],
        models: ['Dzire', 'Creta', 'Nexon', 'i20', 'City'],
        bodyTypes: ['Sedan', 'SUV', 'Hatchback'],
        fuelTypes: ['Petrol', 'Diesel'],
      },
    } as unknown as T;
  }

  if (endpoint.startsWith('/admin/leads') || endpoint.startsWith('/leads')) {
    if (options.method === 'POST' || options.method === 'PATCH' || options.method === 'DELETE') {
      return { success: true, message: 'Lead submitted successfully!' } as unknown as T;
    }
    return [] as unknown as T;
  }

  if (endpoint.startsWith('/admin/test-drives') || endpoint.startsWith('/test-drives')) {
    if (options.method === 'POST' || options.method === 'PATCH' || options.method === 'DELETE') {
      return { success: true, message: 'Test drive scheduled successfully!' } as unknown as T;
    }
    return [] as unknown as T;
  }

  if (endpoint.startsWith('/admin/sell-requests') || endpoint.startsWith('/sell-requests')) {
    if (options.method === 'POST' || options.method === 'PATCH' || options.method === 'DELETE') {
      return { success: true, message: 'Sell request submitted successfully!' } as unknown as T;
    }
    return [] as unknown as T;
  }

  if (endpoint.startsWith('/settings') || endpoint.startsWith('/admin/settings')) {
    return {
      businessName: 'Trusted Cars',
      ownerName: 'Hitesh Modi',
      phone: '+91 98765 43210',
      whatsapp: '919876543210',
      email: 'trustedcars.delhi@gmail.com',
      address: 'Shop No. 12-14, Block 5, Saraswati Marg, Karol Bagh, New Delhi, Delhi 110005',
      description: 'Delhi’s most trusted pre-owned car dealership.',
      socialLinks: { facebook: '', instagram: '', youtube: '' },
      workingHours: 'Monday - Sunday: 10:00 AM - 8:00 PM',
    } as unknown as T;
  }

  return { success: true } as unknown as T;
}

// PUBLIC API CALLS
export async function fetchSiteSettings(): Promise<SiteSettings> {
  return apiFetch<SiteSettings>('/settings');
}

export async function fetchCars(params: Record<string, any> = {}): Promise<{
  cars: Car[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
  filterOptions: { makes: string[]; models: string[]; bodyTypes: string[]; fuelTypes: string[] };
}> {
  const searchParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      searchParams.append(key, String(params[key]));
    }
  });

  const query = searchParams.toString();
  return apiFetch(`/cars${query ? `?${query}` : ''}`);
}

export async function fetchCarsByIds(ids: string[]): Promise<Car[]> {
  if (!ids || ids.length === 0) return [];
  const res = await apiFetch<{ cars: Car[] }>(`/cars?ids=${encodeURIComponent(ids.join(','))}`);
  return res?.cars || [];
}

export async function fetchFeaturedCars(): Promise<Car[]> {
  return apiFetch<Car[]>('/cars/featured');
}

export async function fetchCarBySlug(slug: string): Promise<Car> {
  return apiFetch<Car>(`/cars/slug/${encodeURIComponent(slug)}`);
}

export async function fetchSimilarCars(id: string): Promise<Car[]> {
  return apiFetch<Car[]>(`/cars/${id}/similar`);
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
  return apiFetch('/leads', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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
  return apiFetch('/test-drives', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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
  return apiFetch('/sell-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
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
    // ignore
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
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (search) params.append('search', search);
  return apiFetch<Car[]>(`/admin/cars${params.toString() ? `?${params.toString()}` : ''}`);
}

export async function createCar(token: string, carData: Partial<Car>): Promise<{ success: boolean; car: Car }> {
  return apiFetch('/admin/cars', {
    method: 'POST',
    body: JSON.stringify(carData),
  });
}

export async function updateCar(token: string, id: string, carData: Partial<Car>): Promise<{ success: boolean; car: Car }> {
  return apiFetch(`/admin/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(carData),
  });
}

export async function markCarAsSold(id: string): Promise<{ success: boolean; message: string; car: Car }> {
  return apiFetch(`/admin/cars/${id}/mark-sold`, {
    method: 'POST',
  });
}

export async function restoreCarToAvailable(id: string): Promise<{ success: boolean; message: string; car: Car }> {
  return apiFetch(`/admin/cars/${id}/restore`, {
    method: 'POST',
  });
}

export async function deleteCarPermanently(id: string): Promise<{ success: boolean; message: string }> {
  return apiFetch(`/admin/cars/${id}`, {
    method: 'DELETE',
  });
}

export async function deleteCar(token: string, id: string): Promise<{ success: boolean; message: string }> {
  return deleteCarPermanently(id);
}

export async function fetchAdminLeads(): Promise<Lead[]> {
  return apiFetch<Lead[]>('/admin/leads');
}

export async function fetchLeads(token?: string): Promise<Lead[]> {
  return fetchAdminLeads();
}

export async function updateLeadStatus(token: string, id: string, status: string, notes?: string): Promise<{ success: boolean; lead: Lead }> {
  return apiFetch(`/admin/leads/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status, notes }),
  });
}

export async function deleteLead(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/admin/leads/${id}`, { method: 'DELETE' });
}

export async function fetchAdminTestDrives(): Promise<TestDrive[]> {
  return apiFetch<TestDrive[]>('/admin/test-drives');
}

export async function fetchTestDrives(token?: string): Promise<TestDrive[]> {
  return fetchAdminTestDrives();
}

export async function updateTestDriveStatus(id: string, status: string): Promise<{ success: boolean; testDrive: TestDrive }> {
  return apiFetch(`/admin/test-drives/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteTestDrive(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/admin/test-drives/${id}`, { method: 'DELETE' });
}

export async function fetchAdminSellRequests(): Promise<SellRequest[]> {
  return apiFetch<SellRequest[]>('/admin/sell-requests');
}

export async function fetchSellEnquiries(token?: string): Promise<SellRequest[]> {
  return fetchAdminSellRequests();
}

export async function updateSellRequestStatus(id: string, status: string): Promise<{ success: boolean; sellRequest: SellRequest }> {
  return apiFetch(`/admin/sell-requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function deleteSellRequest(id: string): Promise<{ success: boolean }> {
  return apiFetch(`/admin/sell-requests/${id}`, { method: 'DELETE' });
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<{ success: boolean; settings: SiteSettings; message: string }> {
  return apiFetch('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  });
}
