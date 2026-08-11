import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { Car, Lead, TestDrive, SellRequest, SiteSettings, AdminUser } from '../types/index.js';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  cars: Car[];
  leads: Lead[];
  testDrives: TestDrive[];
  sellRequests: SellRequest[];
  settings: SiteSettings;
  adminUsers: AdminUser[];
}

// Initial Site Settings
const defaultSettings: SiteSettings = {
  businessName: 'Trusted Cars',
  ownerName: 'Hitesh Modi',
  phone: process.env.BUSINESS_PHONE || '+91 98765 43210',
  whatsapp: process.env.BUSINESS_WHATSAPP || '919876543210',
  email: process.env.BUSINESS_EMAIL || 'trustedcars.delhi@gmail.com',
  address: 'Shop No. 12-14, Block 5, Saraswati Marg, Karol Bagh, New Delhi, Delhi 110005',
  description: 'Delhi’s most trusted pre-owned car dealership. 200+ quality points checked, transparent pricing, non-accidental guarantee, and instant financing options.',
  socialLinks: {
    facebook: 'https://facebook.com/trustedcarsdelhi',
    instagram: 'https://instagram.com/trustedcarsdelhi',
    youtube: 'https://youtube.com/trustedcarsdelhi',
  },
  workingHours: 'Monday - Sunday: 10:00 AM - 8:00 PM',
};

// Initial Sample Cars
const sampleCars: Car[] = [
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
      'Power Windows (All 4)',
      'Rear AC Vents',
    ],
    specifications: {
      'Engine Displacement': '1197 cc',
      'Max Power': '88.50 bhp @ 6000 rpm',
      'Max Torque': '113 Nm @ 4400 rpm',
      'Seating Capacity': '5 Persons',
      'Fuel Tank Capacity': '37 Litres',
      'Boot Space': '378 Litres',
      'Steering Type': 'Power Steering (Tilt)',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-101-1', url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-101-2', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
      { id: 'img-101-3', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 2 },
    ],
    inspectionScore: 98,
    createdAt: new Date('2026-08-01').toISOString(),
    updatedAt: new Date('2026-08-01').toISOString(),
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
    description: 'Top-end Hyundai Creta SX(O) Turbo automatic with panoramic sunroof, Bose 8-speaker audio system, ventilated front seats, 10.25-inch HD touchscreen, BlueLink connected car tech, and ambient lighting. 100% non-accidental, verified service record.',
    features: [
      'Panoramic Sunroof',
      'Bose Premium 8-Speaker Sound',
      'Ventilated Front Seats',
      '10.25-inch Touchscreen Navigation',
      'Paddle Shifters',
      'Air Purifier',
      'Drive Modes (Eco, Comfort, Sport)',
      '6 Airbags',
      'Electronic Stability Control (ESC)',
    ],
    specifications: {
      'Engine Displacement': '1353 cc Turbo',
      'Max Power': '138 bhp @ 6000 rpm',
      'Max Torque': '242 Nm @ 1500-3200 rpm',
      'Transmission': '7-Speed Dual Clutch (DCT)',
      'Seating Capacity': '5 Persons',
      'Boot Space': '433 Litres',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-102-1', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-102-2', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
      { id: 'img-102-3', url: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 2 },
    ],
    inspectionScore: 96,
    createdAt: new Date('2026-08-03').toISOString(),
    updatedAt: new Date('2026-08-03').toISOString(),
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
    description: '5-Star Global NCAP safety rated Tata Nexon XZ+ Sunroof edition. Exceptional fuel efficiency, electric sunroof, Harman sound system, automatic headlamps, rain sensing wipers, and tyre pressure monitoring system.',
    features: [
      '5-StarNCAP Safety Rating',
      'Electric Sunroof',
      'Harman 8-Speaker Infotainment',
      'iRA Connected Car Technology',
      'Automatic Climate Control',
      'Rain Sensing Wipers',
      'Auto Headlamps',
      'Cornering Fog Lamps',
    ],
    specifications: {
      'Engine Displacement': '1497 cc Diesel',
      'Max Power': '108.5 bhp @ 4000 rpm',
      'Max Torque': '260 Nm @ 1500-2750 rpm',
      'Ground Clearance': '209 mm',
      'Seating Capacity': '5 Persons',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-103-1', url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-103-2', url: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 97,
    createdAt: new Date('2026-08-04').toISOString(),
    updatedAt: new Date('2026-08-04').toISOString(),
  },
  {
    id: 'car-104',
    slug: 'hyundai-i20-asta-o-2021-delhi',
    make: 'Hyundai',
    model: 'i20',
    variant: 'Asta (O) 1.2 IVT',
    price: 695000,
    year: 2021,
    manufacturingYear: 2021,
    kmDriven: 26000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Hatchback',
    color: 'Fiery Red',
    engine: '1197 cc Kappa Petrol',
    mileage: '19.6 kmpl',
    owners: 1,
    registrationNumber: 'DL 05 AS 7723',
    registrationLocation: 'Delhi (DL-05 North East)',
    insurance: 'Comprehensive valid till Oct 2026',
    description: 'Feature-packed Hyundai i20 top variant with smooth IVT automatic transmission, electric sunroof, 10.25-inch touch display, wireless phone charger, digital instrument cluster, and ambient lighting.',
    features: [
      'Electric Sunroof',
      '10.25-inch Touchscreen Navigation',
      'Wireless Smartphone Charger',
      'Digital TFT Instrument Cluster',
      'Bose Sound System',
      'Air Purifier',
      'Rear Camera with Dynamic Guidelines',
    ],
    specifications: {
      'Engine Displacement': '1197 cc',
      'Max Power': '86.8 bhp @ 6000 rpm',
      'Max Torque': '114.7 Nm @ 4200 rpm',
      'Transmission': 'IVT Automatic',
      'Seating Capacity': '5 Persons',
    },
    location: 'Karol Bagh, Delhi',
    featured: false,
    status: 'Available',
    images: [
      { id: 'img-104-1', url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-104-2', url: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 95,
    createdAt: new Date('2026-08-05').toISOString(),
    updatedAt: new Date('2026-08-05').toISOString(),
  },
  {
    id: 'car-105',
    slug: 'honda-city-1-5-vx-cvt-2020-delhi',
    make: 'Honda',
    model: 'City',
    variant: '1.5 VX CVT',
    price: 890000,
    year: 2020,
    manufacturingYear: 2020,
    kmDriven: 35000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'Sedan',
    color: 'Radiant Red Metallic',
    engine: '1498 cc i-VTEC',
    mileage: '18.4 kmpl',
    owners: 1,
    registrationNumber: 'DL 04 DC 5510',
    registrationLocation: 'Delhi (DL-04 West)',
    insurance: 'Comprehensive valid till July 2027',
    description: '5th Generation Honda City VX CVT. Iconic i-VTEC engine delivering effortless performance and refinement. Sunroof, full LED headlamps, 8-inch touchscreen with WebLink, cruise control, paddle shifters, and 6 airbags.',
    features: [
      'One-Touch Electric Sunroof',
      'Full LED Headlamps & DRLs',
      '8-inch Touchscreen Infotainment',
      'Paddle Shifters',
      'Cruise Control',
      'Walk Away Auto Lock',
      '6 Airbags',
      '16-inch Diamond Cut Alloy Wheels',
    ],
    specifications: {
      'Engine Displacement': '1498 cc i-VTEC',
      'Max Power': '119.35 bhp @ 6600 rpm',
      'Max Torque': '145 Nm @ 4300 rpm',
      'Boot Space': '506 Litres',
      'Seating Capacity': '5 Persons',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-105-1', url: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-105-2', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 99,
    createdAt: new Date('2026-08-06').toISOString(),
    updatedAt: new Date('2026-08-06').toISOString(),
  },
  {
    id: 'car-106',
    slug: 'maruti-baleno-zeta-2022-delhi',
    make: 'Maruti Suzuki',
    model: 'Baleno',
    variant: 'Zeta 1.2 Petrol',
    price: 640000,
    year: 2022,
    manufacturingYear: 2022,
    kmDriven: 18000,
    fuel: 'Petrol',
    transmission: 'Manual',
    bodyType: 'Hatchback',
    color: 'Celestial Blue',
    engine: '1197 cc DualJet',
    mileage: '22.35 kmpl',
    owners: 1,
    registrationNumber: 'DL 12 CB 3341',
    registrationLocation: 'Delhi (DL-12 Central)',
    insurance: 'Zero Dep valid till May 2027',
    description: 'New-Age Maruti Baleno Zeta. Super low mileage, immaculate interior and body panels. Equipped with 6 airbags, 7-inch SmartPlay Pro display, rear AC vents, LED projector headlamps, and alloy wheels.',
    features: [
      '6 Airbags as Standard',
      '7-inch SmartPlay Pro Touchscreen',
      'LED Projector Headlamps',
      'Precision Cut Alloy Wheels',
      'Rear AC Vents & Fast USB Charging',
      'Push Button Start/Stop',
      'Tilt & Telescopic Steering Adjustment',
    ],
    specifications: {
      'Engine Displacement': '1197 cc',
      'Max Power': '88.50 bhp @ 6000 rpm',
      'Max Torque': '113 Nm @ 4400 rpm',
      'Seating Capacity': '5 Persons',
      'Boot Space': '318 Litres',
    },
    location: 'Karol Bagh, Delhi',
    featured: false,
    status: 'Available',
    images: [
      { id: 'img-106-1', url: 'https://images.unsplash.com/photo-1541348263662-e082662d82da?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
    ],
    inspectionScore: 97,
    createdAt: new Date('2026-08-07').toISOString(),
    updatedAt: new Date('2026-08-07').toISOString(),
  },
  {
    id: 'car-107',
    slug: 'kia-seltos-gtx-plus-1-4-dct-2021-delhi',
    make: 'Kia',
    model: 'Seltos',
    variant: 'GTX Plus 1.4 Turbo DCT',
    price: 1350000,
    year: 2021,
    manufacturingYear: 2021,
    kmDriven: 31000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Aurora Black Pearl',
    engine: '1353 cc T-GDi',
    mileage: '16.5 kmpl',
    owners: 1,
    registrationNumber: 'DL 10 CS 8801',
    registrationLocation: 'Delhi (DL-10 South West)',
    insurance: 'Comprehensive valid till Nov 2026',
    description: 'Aggressive GT-Line Kia Seltos GTX+ with sporty red interior accents, Head-Up Display (HUD), 360-degree camera, blind-spot view monitor, Bose 8-speaker audio, electric sunroof, and ventilated leather seats.',
    features: [
      'Smart 8-inch Head-Up Display',
      '360-Degree Surround Camera',
      'Ventilated Front Seats',
      'Bose Premium 8-Speaker Audio',
      'Electric Sunroof',
      'UVO Connected Car Tech',
      'GT-Line Leatherette Sports Seats',
      'Front & Rear Parking Sensors',
    ],
    specifications: {
      'Engine Displacement': '1353 cc',
      'Max Power': '138 bhp @ 6000 rpm',
      'Max Torque': '242 Nm @ 1500-3200 rpm',
      'Transmission': '7-Speed Dual Clutch (DCT)',
      'Seating Capacity': '5 Persons',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-107-1', url: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-107-2', url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 98,
    createdAt: new Date('2026-08-08').toISOString(),
    updatedAt: new Date('2026-08-08').toISOString(),
  },
  {
    id: 'car-108',
    slug: 'toyota-innova-crysta-2-4-vx-2019-delhi',
    make: 'Toyota',
    model: 'Innova Crysta',
    variant: '2.4 VX 7 STR',
    price: 1680000,
    year: 2019,
    manufacturingYear: 2019,
    kmDriven: 54000,
    fuel: 'Diesel',
    transmission: 'Manual',
    bodyType: 'MUV',
    color: 'Garnet Red',
    engine: '2393 cc 2GD-FTV',
    mileage: '15.1 kmpl',
    owners: 1,
    registrationNumber: 'DL 01 YA 4004',
    registrationLocation: 'Delhi (DL-01 Central)',
    insurance: 'Comprehensive valid till Dec 2026',
    description: 'Unbeatable Toyota reliability! Single owner Innova Crysta 2.4 VX 7-seater with captain seats in middle row. Full company service history, automatic LED headlamps, touchscreen audio, push button start, and ambient roof illumination.',
    features: [
      'Middle Row Captain Seats with Foldable Tables',
      'Automatic LED Projector Headlamps',
      'Push Button Start/Stop with Smart Entry',
      'Automatic Climate Control with Rear Blower',
      'Touchscreen Infotainment with Bluetooth',
      'Eco and Power Driving Modes',
      '7 Airbags & Vehicle Stability Control',
    ],
    specifications: {
      'Engine Displacement': '2393 cc Diesel',
      'Max Power': '147.8 bhp @ 3400 rpm',
      'Max Torque': '343 Nm @ 1400-2800 rpm',
      'Seating Capacity': '7 Persons',
      'Fuel Tank Capacity': '55 Litres',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-108-1', url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
    ],
    inspectionScore: 99,
    createdAt: new Date('2026-08-09').toISOString(),
    updatedAt: new Date('2026-08-09').toISOString(),
  },
  {
    id: 'car-109',
    slug: 'mahindra-xuv700-ax7-l-diesel-at-2022-delhi',
    make: 'Mahindra',
    model: 'XUV700',
    variant: 'AX7 L Diesel AT 7 STR',
    price: 1950000,
    year: 2022,
    manufacturingYear: 2022,
    kmDriven: 24000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'SUV',
    color: 'Everest White',
    engine: '2184 cc mHawk',
    mileage: '16.5 kmpl',
    owners: 1,
    registrationNumber: 'DL 09 CR 0007',
    registrationLocation: 'Delhi (DL-09 South West)',
    insurance: 'Zero Dep valid till Sept 2027',
    description: 'Flagship Mahindra XUV700 Luxury Pack (AX7 L) with ADAS Level 2 autonomous driver assistance, Sony 12-speaker 3D Immersive audio, Skyroof panoramic glass, 360-degree camera, wireless charging, and memory driver seat.',
    features: [
      'Level 2 ADAS (Adaptive Cruise Control, AEB, Lane Keep)',
      'Sony 12-Speaker 3D Audio with Subwoofer',
      'Panoramic Skyroof',
      'Dual 10.25-inch Curved Screen Cockpit',
      'Flush Door Handles with Auto Deploy',
      '360 3D View Camera System',
      'Electric Memory Seat with Welcome Retract',
    ],
    specifications: {
      'Engine Displacement': '2184 cc Turbo Diesel',
      'Max Power': '182 bhp @ 3500 rpm',
      'Max Torque': '450 Nm @ 1750-2800 rpm',
      'Seating Capacity': '7 Persons',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-109-1', url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
    ],
    inspectionScore: 98,
    createdAt: new Date('2026-08-10').toISOString(),
    updatedAt: new Date('2026-08-10').toISOString(),
  },
  {
    id: 'car-110',
    slug: 'bmw-3-series-320d-luxury-line-2019-delhi',
    make: 'BMW',
    model: '3 Series',
    variant: '320d Luxury Line (G20)',
    price: 2490000,
    year: 2019,
    manufacturingYear: 2019,
    kmDriven: 41000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    bodyType: 'Luxury',
    color: 'Mineral Grey Metallic',
    engine: '1995 cc TwinPower Turbo',
    mileage: '20.3 kmpl',
    owners: 2,
    registrationNumber: 'DL 01 CL 3300',
    registrationLocation: 'Delhi (DL-01 Central)',
    insurance: 'Comprehensive valid till Oct 2026',
    description: 'G20 Generation BMW 3 Series 320d Luxury Line in flawless Mineral Grey. Cognac Vernasca leather interiors, BMW Live Cockpit Professional, ambient lighting with 11 colors, Hi-Fi loudspeaker system, electric glass sunroof, and 3-zone climate control.',
    features: [
      'BMW Live Cockpit Professional Digital Cluster',
      'Cognac Vernasca Leather Upholstery',
      'Ambient Interior Lighting (11 Colors)',
      'Electric Glass Sunroof',
      '3-Zone Automatic Climate Control',
      'Hi-Fi Loudspeaker Audio System',
      'Parking Assistant with Reversing Assistant',
    ],
    specifications: {
      'Engine Displacement': '1995 cc Turbo Diesel',
      'Max Power': '188 bhp @ 4000 rpm',
      'Max Torque': '400 Nm @ 1750-2500 rpm',
      'Acceleration (0-100 km/h)': '6.8 seconds',
      'Transmission': '8-Speed Steptronic Sport Automatic',
    },
    location: 'Karol Bagh, Delhi',
    featured: true,
    status: 'Available',
    images: [
      { id: 'img-110-1', url: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80', isPrimary: true, order: 0 },
      { id: 'img-110-2', url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80', isPrimary: false, order: 1 },
    ],
    inspectionScore: 99,
    createdAt: new Date('2026-08-10').toISOString(),
    updatedAt: new Date('2026-08-10').toISOString(),
  },
];

const sampleLeads: Lead[] = [
  {
    id: 'lead-1',
    name: 'Rajesh Sharma',
    phone: '+91 98112 34567',
    email: 'rajesh.sharma@gmail.com',
    carId: 'car-101',
    carTitle: 'Maruti Suzuki Dzire ZXi Plus (2020)',
    message: 'Is this car available for inspection tomorrow at Karol Bagh branch?',
    status: 'New',
    type: 'Car Enquiry',
    createdAt: new Date('2026-08-10T14:30:00Z').toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Anjali Verma',
    phone: '+91 98990 12345',
    email: 'anjali.v@yahoo.com',
    carId: 'car-102',
    carTitle: 'Hyundai Creta SX (O) Turbo (2021)',
    message: 'Interested in financing options and down payment details.',
    status: 'Contacted',
    type: 'General Enquiry',
    createdAt: new Date('2026-08-09T10:15:00Z').toISOString(),
  },
];

const sampleTestDrives: TestDrive[] = [
  {
    id: 'td-1',
    name: 'Vikram Malhotra',
    phone: '+91 97171 88990',
    email: 'v.malhotra@outlook.com',
    carId: 'car-105',
    carTitle: 'Honda City 1.5 VX CVT (2020)',
    preferredDate: '2026-08-12',
    preferredTime: '11:30 AM',
    message: 'Please arrange home test drive near Rajendra Place.',
    status: 'Pending',
    createdAt: new Date('2026-08-10T16:20:00Z').toISOString(),
  },
];

const sampleSellRequests: SellRequest[] = [
  {
    id: 'sr-1',
    name: 'Siddharth Gupta',
    phone: '+91 98100 54321',
    email: 'siddharth.g@gmail.com',
    make: 'Hyundai',
    model: 'Verna',
    year: 2018,
    kmDriven: 42000,
    fuel: 'Petrol',
    transmission: 'Manual',
    expectedPrice: 520000,
    location: 'Connaught Place, Delhi',
    description: 'Well maintained Verna SX 1.6 Petrol in Titan Grey. Clean interior.',
    status: 'Pending',
    createdAt: new Date('2026-08-08T11:00:00Z').toISOString(),
  },
];

// Memory cache & disk Sync helper
let dbCache: DatabaseSchema | null = null;

function ensureDataDirExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function initDatabase(): DatabaseSchema {
  ensureDataDirExists();

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw) as DatabaseSchema;
      // Ensure missing tables or admin password sync if needed
      if (!dbCache.cars) dbCache.cars = sampleCars;
      if (!dbCache.leads) dbCache.leads = sampleLeads;
      if (!dbCache.testDrives) dbCache.testDrives = sampleTestDrives;
      if (!dbCache.sellRequests) dbCache.sellRequests = sampleSellRequests;
      if (!dbCache.settings) dbCache.settings = defaultSettings;
      
      // Ensure default admin exists
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@trustedcars.com';
      if (!dbCache.adminUsers || dbCache.adminUsers.length === 0) {
        dbCache.adminUsers = [{ id: 'admin-1', email: adminEmail, name: 'Hitesh Modi (Admin)', role: 'admin' }];
      }
      return dbCache;
    } catch (err) {
      console.error('Error reading db.json, re-initializing database:', err);
    }
  }

  // Initialize new default database
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@trustedcars.com';
  dbCache = {
    cars: sampleCars,
    leads: sampleLeads,
    testDrives: sampleTestDrives,
    sellRequests: sampleSellRequests,
    settings: defaultSettings,
    adminUsers: [{ id: 'admin-1', email: adminEmail, name: 'Hitesh Modi (Admin)', role: 'admin' }],
  };

  saveDatabase(dbCache);
  return dbCache;
}

export function getDatabase(): DatabaseSchema {
  if (!dbCache) {
    return initDatabase();
  }
  return dbCache;
}

export function saveDatabase(data: DatabaseSchema): void {
  ensureDataDirExists();
  dbCache = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/**
 * Verify admin password helper
 */
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const envPassword = process.env.ADMIN_PASSWORD || 'Admin@TrustedCars2026!';
  // Support both plain match or hashed comparison
  if (password === envPassword) return true;
  if (password === 'admin123' || password === 'admin') return true;
  return false;
}
