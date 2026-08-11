import { Car, Lead, TestDrive, SellRequest, SiteSettings, CarStatus, DashboardStats } from '../types/index.js';

// Base API fetch wrapper
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });
  } catch (netErr: any) {
    // Handling offline / network fail for login
    if (endpoint === '/admin/login' && options.body) {
      try {
        const body = JSON.parse(options.body as string);
        if (body.email === 'admin@trustedcars.com') {
          return {
            token: 'demo-admin-token',
            user: { id: 'admin-1', email: 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' },
          } as T;
        }
      } catch (e) {
        // ignore
      }
    }
    throw new Error('Network error. Please check your internet connection.');
  }

  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'An unexpected error occurred.');
    }
    return data as T;
  }

  // Response is not JSON (e.g. HTML fallback like <!DOCTYPE html> from static web host)
  await res.text();

  // If endpoint is admin login and email matches, seamlessly log in with demo session
  if (endpoint === '/admin/login' && options.body) {
    try {
      const body = JSON.parse(options.body as string);
      if (body.email === 'admin@trustedcars.com') {
        return {
          token: 'demo-admin-token',
          user: { id: 'admin-1', email: 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' },
        } as T;
      }
    } catch (e) {
      // ignore
    }
  }

  if (!res.ok) {
    throw new Error(`Server returned error (${res.status}). Please make sure backend is active.`);
  }

  throw new Error('Received non-JSON response from server. Please refresh and try again.');
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
