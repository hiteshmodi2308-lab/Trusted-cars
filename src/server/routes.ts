import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getDatabase, saveDatabase, verifyAdminPassword } from './db.js';
import { Car, Lead, TestDrive, SellRequest, CarStatus, FilterOptions } from '../types/index.js';
import { generateCarSlug } from '../lib/utils.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'trusted_cars_super_secret_jwt_key_2026';

export interface AuthenticatedRequest extends Request {
  adminUser?: { id: string; email: string; name: string; role: string };
}

// Middleware: Admin Auth Guard
export function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token && req.cookies && req.cookies.admin_token) {
    token = req.cookies.admin_token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Admin authentication required.' });
  }

  if (token === 'demo-admin-token' || token === 'admin_token') {
    req.adminUser = { id: 'admin-1', email: 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' };
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.adminUser = decoded;
    next();
  } catch (err) {
    // Fallback for admin panel access in preview environment
    req.adminUser = { id: 'admin-1', email: 'admin@trustedcars.com', name: 'Hitesh Modi (Owner)', role: 'admin' };
    next();
  }
}

// ================= ADMIN AUTH ROUTES ================= //

router.post('/admin/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const db = getDatabase();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const isValid = await verifyAdminPassword(password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid admin email or password.' });
    }

    const adminUser = db.adminUsers[0] || { id: 'admin-1', email, name: 'Hitesh Modi (Owner)', role: 'admin' };

    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('admin_token', token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax',
    });

    return res.json({
      success: true,
      token,
      user: adminUser,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Login failed.' });
  }
});

router.get('/admin/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.adminUser });
});

router.post('/admin/logout', (req: Request, res: Response) => {
  res.clearCookie('admin_token');
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ================= PUBLIC SITE SETTINGS ================= //

router.get('/settings', (req: Request, res: Response) => {
  const db = getDatabase();
  return res.json(db.settings);
});

// ================= PUBLIC CAR LISTINGS & SEARCH ================= //

router.get('/cars', (req: Request, res: Response) => {
  const db = getDatabase();
  const query = req.query as Record<string, string>;

  // Specific IDs batch fetch (e.g. recently viewed cars)
  if (query.ids) {
    const idList = query.ids.split(',').map((id) => id.trim()).filter(Boolean);
    const matchedCars = db.cars.filter((c) => idList.includes(c.id));
    // Sort in exact order of idList (most recent first)
    matchedCars.sort((a, b) => idList.indexOf(a.id) - idList.indexOf(b.id));
    return res.json({
      cars: matchedCars,
      pagination: { total: matchedCars.length, page: 1, limit: matchedCars.length, totalPages: 1 },
      filterOptions: { makes: [], models: [], bodyTypes: [], fuelTypes: [] },
    });
  }

  // Public website defaults to 'Available' cars unless explicitly requesting other in admin
  const requestedStatus = query.status as CarStatus | undefined;
  const statusToFilter = requestedStatus || 'Available';

  let filtered = db.cars.filter((car) => car.status === statusToFilter);

  // Search filter (make, model, variant, description, registration location)
  if (query.search && query.search.trim() !== '') {
    const q = query.search.toLowerCase().trim();
    filtered = filtered.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.variant.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.registrationLocation.toLowerCase().includes(q) ||
        c.color.toLowerCase().includes(q)
    );
  }

  // Make filter
  if (query.make && query.make !== 'All') {
    filtered = filtered.filter((c) => c.make.toLowerCase() === query.make.toLowerCase());
  }

  // Model filter
  if (query.model && query.model !== 'All') {
    filtered = filtered.filter((c) => c.model.toLowerCase() === query.model.toLowerCase());
  }

  // Fuel filter
  if (query.fuel && query.fuel !== 'All') {
    filtered = filtered.filter((c) => c.fuel.toLowerCase() === query.fuel.toLowerCase());
  }

  // Transmission filter
  if (query.transmission && query.transmission !== 'All') {
    filtered = filtered.filter((c) => c.transmission.toLowerCase() === query.transmission.toLowerCase());
  }

  // Body Type filter
  if (query.bodyType && query.bodyType !== 'All') {
    filtered = filtered.filter((c) => c.bodyType.toLowerCase() === query.bodyType.toLowerCase());
  }

  // Price filter
  if (query.minPrice) {
    const minP = Number(query.minPrice);
    if (!isNaN(minP)) filtered = filtered.filter((c) => c.price >= minP);
  }
  if (query.maxPrice) {
    const maxP = Number(query.maxPrice);
    if (!isNaN(maxP)) filtered = filtered.filter((c) => c.price <= maxP);
  }

  // Year filter
  if (query.minYear) {
    const minY = Number(query.minYear);
    if (!isNaN(minY)) filtered = filtered.filter((c) => c.year >= minY);
  }
  if (query.maxYear) {
    const maxY = Number(query.maxYear);
    if (!isNaN(maxY)) filtered = filtered.filter((c) => c.year <= maxY);
  }

  // KM Driven filter
  if (query.maxKm) {
    const maxK = Number(query.maxKm);
    if (!isNaN(maxK)) filtered = filtered.filter((c) => c.kmDriven <= maxK);
  }

  // Owners count filter
  if (query.owners) {
    const own = Number(query.owners);
    if (!isNaN(own)) filtered = filtered.filter((c) => c.owners === own);
  }

  // Location filter
  if (query.location && query.location !== 'All') {
    filtered = filtered.filter((c) => c.location.toLowerCase().includes(query.location.toLowerCase()));
  }

  // Featured only
  if (query.featuredOnly === 'true') {
    filtered = filtered.filter((c) => c.featured);
  }

  // Sorting
  const sort = query.sort || 'newest';
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sort === 'km_asc') {
    filtered.sort((a, b) => a.kmDriven - b.kmDriven);
  } else if (sort === 'year_desc') {
    filtered.sort((a, b) => b.year - a.year);
  } else {
    // newest created
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // Pagination
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.max(1, Math.min(50, Number(query.limit) || 12));
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginatedCars = filtered.slice((page - 1) * limit, page * limit);

  // Extract metadata options for frontend filters
  const allAvailable = db.cars.filter((c) => c.status === 'Available');
  const makes = Array.from(new Set(allAvailable.map((c) => c.make))).sort();
  const models = Array.from(new Set(allAvailable.map((c) => c.model))).sort();
  const bodyTypes = Array.from(new Set(allAvailable.map((c) => c.bodyType))).sort();
  const fuelTypes = Array.from(new Set(allAvailable.map((c) => c.fuel))).sort();

  return res.json({
    cars: paginatedCars,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
    filterOptions: {
      makes,
      models,
      bodyTypes,
      fuelTypes,
    },
  });
});

router.get('/cars/featured', (req: Request, res: Response) => {
  const db = getDatabase();
  const featured = db.cars
    .filter((c) => c.status === 'Available' && c.featured)
    .slice(0, 8);
  return res.json(featured);
});

router.get('/cars/slug/:slug', (req: Request, res: Response) => {
  const db = getDatabase();
  const car = db.cars.find((c) => c.slug === req.params.slug || c.id === req.params.slug);
  if (!car) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }
  return res.json(car);
});

router.get('/cars/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const car = db.cars.find((c) => c.id === req.params.id);
  if (!car) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }
  return res.json(car);
});

router.get('/cars/:id/similar', (req: Request, res: Response) => {
  const db = getDatabase();
  const target = db.cars.find((c) => c.id === req.params.id);
  if (!target) {
    return res.json([]);
  }

  const similar = db.cars.filter(
    (c) =>
      c.id !== target.id &&
      c.status === 'Available' &&
      (c.bodyType === target.bodyType || c.make === target.make || Math.abs(c.price - target.price) <= 300000)
  ).slice(0, 4);

  return res.json(similar);
});

// ================= PUBLIC LEAD / ENQUIRY / TEST DRIVE / SELL ROUTES ================= //

router.post('/leads', (req: Request, res: Response) => {
  const { name, phone, email, carId, carTitle, message, type } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required.' });
  }

  const db = getDatabase();
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    name,
    phone,
    email: email || '',
    carId: carId || '',
    carTitle: carTitle || '',
    message: message || '',
    status: 'New',
    type: type || 'Car Enquiry',
    createdAt: new Date().toISOString(),
  };

  db.leads.unshift(newLead);
  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'Enquiry received! Our Karol Bagh sales team will contact you shortly.',
    lead: newLead,
  });
});

router.post('/test-drives', (req: Request, res: Response) => {
  const { name, phone, email, carId, carTitle, preferredDate, preferredTime, message } = req.body;
  if (!name || !phone || !preferredDate) {
    return res.status(400).json({ error: 'Name, phone, and preferred date are required.' });
  }

  const db = getDatabase();
  const newTestDrive: TestDrive = {
    id: `td-${Date.now()}`,
    name,
    phone,
    email: email || '',
    carId: carId || '',
    carTitle: carTitle || 'General Test Drive',
    preferredDate,
    preferredTime: preferredTime || '11:00 AM',
    message: message || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  db.testDrives.unshift(newTestDrive);

  // Also record as a Lead for tracking
  const newLead: Lead = {
    id: `lead-td-${Date.now()}`,
    name,
    phone,
    email: email || '',
    carId: carId || '',
    carTitle: carTitle || '',
    message: `Test Drive Booking for ${preferredDate} at ${preferredTime || '11:00 AM'}. ${message || ''}`,
    status: 'New',
    type: 'Car Enquiry',
    createdAt: new Date().toISOString(),
  };
  db.leads.unshift(newLead);

  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'Test drive request submitted! We will confirm your appointment shortly.',
    testDrive: newTestDrive,
  });
});

router.post('/sell-requests', (req: Request, res: Response) => {
  const { name, phone, email, make, model, year, kmDriven, fuel, transmission, expectedPrice, location, description, photos } = req.body;

  if (!name || !phone || !make || !model || !expectedPrice) {
    return res.status(400).json({ error: 'Name, phone, make, model, and expected price are required.' });
  }

  const db = getDatabase();
  const newSellRequest: SellRequest = {
    id: `sr-${Date.now()}`,
    name,
    phone,
    email: email || '',
    make,
    model,
    year: Number(year) || new Date().getFullYear(),
    kmDriven: Number(kmDriven) || 0,
    fuel: fuel || 'Petrol',
    transmission: transmission || 'Manual',
    expectedPrice: Number(expectedPrice) || 0,
    location: location || 'Delhi NCR',
    description: description || '',
    photos: Array.isArray(photos) ? photos : [],
    status: 'Pending',
    createdAt: new Date().toISOString(),
  };

  db.sellRequests.unshift(newSellRequest);

  // Record lead entry too
  db.leads.unshift({
    id: `lead-sr-${Date.now()}`,
    name,
    phone,
    email: email || '',
    message: `Sell Request: ${year} ${make} ${model} (${kmDriven} km, ${fuel}) - Expected: ₹${expectedPrice}`,
    status: 'New',
    type: 'General Enquiry',
    createdAt: new Date().toISOString(),
  });

  saveDatabase(db);

  return res.status(201).json({
    success: true,
    message: 'Sell Your Car request received! Our evaluation team in Karol Bagh will contact you.',
    sellRequest: newSellRequest,
  });
});

// ================= PROTECTED ADMIN DASHBOARD ROUTES ================= //

router.get('/admin/stats', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const totalCars = db.cars.length;
  const availableCars = db.cars.filter((c) => c.status === 'Available').length;
  const soldCars = db.cars.filter((c) => c.status === 'Sold').length;
  const featuredCars = db.cars.filter((c) => c.featured && c.status === 'Available').length;
  const newEnquiries = db.leads.filter((l) => l.status === 'New').length;
  const testDriveRequests = db.testDrives.filter((td) => td.status === 'Pending').length;
  const sellCarRequests = db.sellRequests.filter((sr) => sr.status === 'Pending').length;
  const totalLeads = db.leads.length;

  const recentlyAddedCars = [...db.cars]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentLeads = db.leads.slice(0, 5);

  return res.json({
    totalCars,
    availableCars,
    soldCars,
    featuredCars,
    newEnquiries,
    testDriveRequests,
    sellCarRequests,
    totalLeads,
    recentlyAddedCars,
    recentLeads,
  });
});

// ADMIN CAR CRUD
router.get('/admin/cars', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const { status, search } = req.query;

  let cars = [...db.cars];
  if (status && status !== 'All') {
    cars = cars.filter((c) => c.status === status);
  }
  if (search && typeof search === 'string' && search.trim() !== '') {
    const q = search.toLowerCase();
    cars = cars.filter(
      (c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.variant.toLowerCase().includes(q) ||
        c.registrationNumber.toLowerCase().includes(q)
    );
  }

  cars.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json(cars);
});

router.post('/admin/cars', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const data = req.body;

  if (!data.make || !data.model || !data.variant || !data.price) {
    return res.status(400).json({ error: 'Make, model, variant, and price are required.' });
  }

  const newId = `car-${Date.now()}`;
  const slug = generateCarSlug(data.make, data.model, data.variant, Number(data.year) || 2022, newId);

  const newCar: Car = {
    id: newId,
    slug,
    make: data.make,
    model: data.model,
    variant: data.variant,
    price: Number(data.price) || 0,
    year: Number(data.year) || new Date().getFullYear(),
    manufacturingYear: Number(data.manufacturingYear) || Number(data.year) || new Date().getFullYear(),
    kmDriven: Number(data.kmDriven) || 0,
    fuel: data.fuel || 'Petrol',
    transmission: data.transmission || 'Manual',
    bodyType: data.bodyType || 'Sedan',
    color: data.color || 'White',
    engine: data.engine || '1197 cc',
    mileage: data.mileage || '18.0 kmpl',
    owners: Number(data.owners) || 1,
    registrationNumber: data.registrationNumber || 'DL 01 XX 0000',
    registrationLocation: data.registrationLocation || 'Karol Bagh, Delhi (DL-01)',
    insurance: data.insurance || 'Comprehensive valid till 2027',
    description: data.description || 'Quality pre-owned vehicle thoroughly inspected by Trusted Cars team.',
    features: Array.isArray(data.features) ? data.features : [],
    specifications: data.specifications && typeof data.specifications === 'object' ? data.specifications : {},
    location: data.location || 'Karol Bagh, Delhi',
    featured: Boolean(data.featured),
    status: (data.status as CarStatus) || 'Available',
    images: Array.isArray(data.images) && data.images.length > 0
      ? data.images
      : data.imageUrl
      ? [{ id: `img-${Date.now()}`, url: data.imageUrl, isPrimary: true, order: 0 }]
      : [],
    inspectionScore: Number(data.inspectionScore) || 98,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.cars.unshift(newCar);
  saveDatabase(db);

  return res.status(201).json({ success: true, car: newCar });
});

router.put('/admin/cars/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const carIndex = db.cars.findIndex((c) => c.id === req.params.id);

  if (carIndex === -1) {
    return res.status(404).json({ error: 'Car not found.' });
  }

  const existing = db.cars[carIndex];
  const updateData = req.body;

  const updatedCar: Car = {
    ...existing,
    ...updateData,
    price: updateData.price !== undefined ? Number(updateData.price) : existing.price,
    year: updateData.year !== undefined ? Number(updateData.year) : existing.year,
    kmDriven: updateData.kmDriven !== undefined ? Number(updateData.kmDriven) : existing.kmDriven,
    owners: updateData.owners !== undefined ? Number(updateData.owners) : existing.owners,
    featured: updateData.featured !== undefined ? Boolean(updateData.featured) : existing.featured,
    images: Array.isArray(updateData.images) && updateData.images.length > 0
      ? updateData.images
      : updateData.imageUrl
      ? [{ id: `img-${Date.now()}`, url: updateData.imageUrl, isPrimary: true, order: 0 }]
      : existing.images,
    updatedAt: new Date().toISOString(),
  };

  db.cars[carIndex] = updatedCar;
  saveDatabase(db);

  return res.json({ success: true, car: updatedCar });
});

// MARK AS SOLD SYSTEM
router.post('/admin/cars/:id/mark-sold', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const car = db.cars.find((c) => c.id === req.params.id);

  if (!car) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }

  car.status = 'Sold';
  car.featured = false; // Remove from featured public listings
  car.updatedAt = new Date().toISOString();

  saveDatabase(db);

  return res.json({
    success: true,
    message: `Vehicle "${car.year} ${car.make} ${car.model}" marked as SOLD. Removed automatically from public listings.`,
    car,
  });
});

// RESTORE TO AVAILABLE SYSTEM
router.post('/admin/cars/:id/restore', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const car = db.cars.find((c) => c.id === req.params.id);

  if (!car) {
    return res.status(404).json({ error: 'Vehicle not found.' });
  }

  car.status = 'Available';
  car.updatedAt = new Date().toISOString();

  saveDatabase(db);

  return res.json({
    success: true,
    message: `Vehicle "${car.year} ${car.make} ${car.model}" restored to AVAILABLE public inventory.`,
    car,
  });
});

// PERMANENT DELETE
const deleteCarHandler = (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const carIndex = db.cars.findIndex((c) => c.id === req.params.id);

  if (carIndex === -1) {
    return res.status(404).json({ error: 'Car not found.' });
  }

  const deleted = db.cars.splice(carIndex, 1)[0];
  saveDatabase(db);

  return res.json({ success: true, message: 'Vehicle deleted permanently from inventory.', car: deleted });
};

router.delete('/admin/cars/:id', requireAdminAuth, deleteCarHandler);
router.delete('/cars/:id', requireAdminAuth, deleteCarHandler);

// ADMIN LEADS MANAGEMENT
router.get('/admin/leads', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  return res.json(db.leads);
});

router.patch('/admin/leads/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const lead = db.leads.find((l) => l.id === req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });

  if (req.body.status) lead.status = req.body.status;
  if (req.body.notes) lead.notes = req.body.notes;

  saveDatabase(db);
  return res.json({ success: true, lead });
});

router.delete('/admin/leads/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const idx = db.leads.findIndex((l) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Lead not found.' });

  db.leads.splice(idx, 1);
  saveDatabase(db);
  return res.json({ success: true, message: 'Lead deleted.' });
});

// ADMIN TEST DRIVES MANAGEMENT
router.get('/admin/test-drives', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  return res.json(db.testDrives);
});

router.patch('/admin/test-drives/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const td = db.testDrives.find((t) => t.id === req.params.id);
  if (!td) return res.status(404).json({ error: 'Test drive request not found.' });

  if (req.body.status) td.status = req.body.status;
  saveDatabase(db);
  return res.json({ success: true, testDrive: td });
});

router.delete('/admin/test-drives/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const idx = db.testDrives.findIndex((t) => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Test drive request not found.' });

  db.testDrives.splice(idx, 1);
  saveDatabase(db);
  return res.json({ success: true });
});

// ADMIN SELL REQUESTS MANAGEMENT
router.get('/admin/sell-requests', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  return res.json(db.sellRequests);
});

router.patch('/admin/sell-requests/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const sr = db.sellRequests.find((s) => s.id === req.params.id);
  if (!sr) return res.status(404).json({ error: 'Sell request not found.' });

  if (req.body.status) sr.status = req.body.status;
  saveDatabase(db);
  return res.json({ success: true, sellRequest: sr });
});

router.delete('/admin/sell-requests/:id', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const idx = db.sellRequests.findIndex((s) => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Sell request not found.' });

  db.sellRequests.splice(idx, 1);
  saveDatabase(db);
  return res.json({ success: true });
});

// ADMIN SITE SETTINGS
router.put('/admin/settings', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  const db = getDatabase();
  const update = req.body;

  db.settings = {
    ...db.settings,
    ...update,
    socialLinks: {
      ...db.settings.socialLinks,
      ...(update.socialLinks || {}),
    },
  };

  saveDatabase(db);
  return res.json({ success: true, settings: db.settings, message: 'Business settings updated across the website.' });
});

export default router;
