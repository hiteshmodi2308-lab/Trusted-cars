export type CarStatus = 'Available' | 'Reserved' | 'Sold' | 'Draft';

export type FuelType = 'Petrol' | 'Diesel' | 'CNG' | 'Electric' | 'Hybrid';

export type Transmission = 'Manual' | 'Automatic';

export type BodyType = 'Hatchback' | 'Sedan' | 'SUV' | 'MUV' | 'Luxury' | 'Coupe';

export type LeadStatus = 'New' | 'Contacted' | 'Interested' | 'Test Drive' | 'Converted' | 'Closed';

export type TestDriveStatus = 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';

export type SellRequestStatus = 'Pending' | 'Inspected' | 'Offer Made' | 'Purchased' | 'Rejected';

export interface CarImage {
  id: string;
  url: string;
  isPrimary: boolean;
  order: number;
}

export interface Car {
  id: string;
  slug: string;
  make: string;
  model: string;
  variant: string;
  price: number; // in INR
  year: number; // Registration year
  manufacturingYear?: number;
  kmDriven: number;
  fuel: FuelType | string;
  transmission: Transmission | string;
  bodyType: BodyType | string;
  color?: string;
  engine?: string; // e.g. "1197 cc"
  engineCc?: number;
  mileage?: string; // e.g. "21.21 kmpl"
  owners: number; // 1, 2, 3
  registrationNumber?: string; // e.g. "DL 01 AB 1234"
  registrationLocation?: string; // e.g. "Delhi (DL-01)"
  regState?: string;
  insurance?: string; // e.g. "Comprehensive till Dec 2026"
  insuranceValid?: string;
  description?: string;
  features?: string[]; // e.g. ["Touchscreen Display", "Sunroof", "Alloy Wheels", "Reverse Camera"]
  specifications?: Record<string, string>; // e.g. {"Seating Capacity": "5", "Transmission": "5-Speed"}
  location?: string; // Default: "Karol Bagh, Delhi"
  featured: boolean;
  status: CarStatus;
  images: CarImage[];
  inspectionScore?: number; // e.g. 98 out of 100
  createdAt?: string;
  updatedAt?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  carId?: string;
  carTitle?: string;
  message?: string;
  status: LeadStatus | string;
  type?: 'General Enquiry' | 'Car Enquiry' | 'WhatsApp Callback' | 'Call Request' | string;
  createdAt: string;
  notes?: string;
}

export interface TestDrive {
  id: string;
  name: string;
  phone: string;
  email?: string;
  carId: string;
  carTitle: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: TestDriveStatus | string;
  createdAt: string;
}

export interface SellRequest {
  id: string;
  name: string;
  phone: string;
  email?: string;
  make: string;
  model: string;
  year: number;
  kmDriven: number;
  fuel: FuelType | string;
  transmission?: Transmission | string;
  expectedPrice?: number;
  city?: string;
  location?: string;
  description?: string;
  photos?: string[];
  status?: SellRequestStatus | string;
  createdAt: string;
}

export type SellEnquiry = SellRequest;

export interface SiteSettings {
  businessName: string;
  ownerName: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  description: string;
  socialLinks?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  workingHours?: string;
  businessHours?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | string;
}

export interface FilterOptions {
  search?: string;
  make?: string;
  model?: string;
  minPrice?: number;
  maxPrice?: number;
  fuel?: FuelType | string;
  transmission?: Transmission | string;
  minYear?: number;
  maxYear?: number;
  maxKm?: number;
  bodyType?: BodyType | string;
  owners?: number;
  location?: string;
  status?: CarStatus;
  featuredOnly?: boolean;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'km_asc' | 'year_desc';
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  totalCars: number;
  availableCars: number;
  soldCars: number;
  featuredCars: number;
  newEnquiries: number;
  testDriveRequests: number;
  totalLeads: number;
  sellCarRequests: number;
  recentlyAddedCars: Car[];
  recentLeads: Lead[];
}
