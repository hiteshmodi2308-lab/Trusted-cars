import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header.js';
import { Footer } from '../components/Footer.js';
import {
  fetchAdminCars,
  createCar,
  updateCar,
  deleteCar,
  markCarAsSold,
  restoreCarToAvailable,
  fetchLeads,
  fetchSellEnquiries,
  fetchTestDrives,
  updateLeadStatus,
} from '../lib/api.js';
import { Car, Lead, SellEnquiry, TestDrive, CarImage } from '../types/index.js';
import { formatPrice, formatKm } from '../lib/utils.js';
import { useSettings } from '../context/SettingsContext.js';
import {
  Car as CarIcon,
  Users,
  Tag,
  Calendar,
  Settings as SettingsIcon,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Search,
  Sparkles,
  LogOut,
  Image as ImageIcon,
  Upload,
  Star,
} from 'lucide-react';

interface AdminDashboardPageProps {
  token: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ token, onNavigate, onLogout }) => {
  const { settings, updateSettings } = useSettings();

  const [activeTab, setActiveTab] = useState<'inventory' | 'leads' | 'sellRequests' | 'testDrives' | 'settings'>('inventory');

  // Data States
  const [cars, setCars] = useState<Car[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sellRequests, setSellRequests] = useState<SellEnquiry[]>([]);
  const [testDrives, setTestDrives] = useState<TestDrive[]>([]);
  const [loading, setLoading] = useState(true);

  // Car Modal State
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);

  // Car Form State
  const [make, setMake] = useState('Maruti Suzuki');
  const [model, setModel] = useState('');
  const [variant, setVariant] = useState('');
  const [year, setYear] = useState(2021);
  const [price, setPrice] = useState(650000);
  const [kmDriven, setKmDriven] = useState(35000);
  const [fuel, setFuel] = useState('Petrol');
  const [transmission, setTransmission] = useState('Manual');
  const [bodyType, setBodyType] = useState('Hatchback');
  const [owners, setOwners] = useState(1);
  const [color, setColor] = useState('White');
  const [status, setStatus] = useState<'Available' | 'Reserved' | 'Sold'>('Available');
  const [featured, setFeatured] = useState(false);
  const [inspectionScore, setInspectionScore] = useState(92);
  const [imageUrl, setImageUrl] = useState('');
  const [carImages, setCarImages] = useState<CarImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Gallery File Upload Handler
  const handleGalleryFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingImage(true);

    const fileArray = Array.from(files);
    const newImagesPromises = fileArray.map((file, idx) => {
      return new Promise<CarImage>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          resolve({
            id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            url,
            isPrimary: carImages.length === 0 && idx === 0,
            order: carImages.length + idx,
          });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises)
      .then((newImgs) => {
        setCarImages((prev) => {
          const combined = [...prev, ...newImgs];
          if (!combined.some((img) => img.isPrimary) && combined.length > 0) {
            combined[0].isPrimary = true;
          }
          return combined;
        });
      })
      .catch((err) => {
        console.error('File upload error:', err);
        alert('Failed to process image files.');
      })
      .finally(() => {
        setUploadingImage(false);
      });
  };

  const handleSetPrimaryImage = (id: string) => {
    setCarImages((prev) =>
      prev.map((img) => ({
        ...img,
        isPrimary: img.id === id,
      }))
    );
  };

  const handleRemoveImage = (id: string) => {
    setCarImages((prev) => {
      const filtered = prev.filter((img) => img.id !== id);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // Settings Form State
  const [businessPhone, setBusinessPhone] = useState(settings.phone);
  const [businessWhatsapp, setBusinessWhatsapp] = useState(settings.whatsapp);
  const [businessAddress, setBusinessAddress] = useState(settings.address);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [c, l, s, t] = await Promise.all([
        fetchAdminCars(token),
        fetchLeads(token),
        fetchSellEnquiries(token),
        fetchTestDrives(token),
      ]);
      setCars(Array.isArray(c) ? c : (c && Array.isArray((c as any).cars) ? (c as any).cars : []));
      setLeads(Array.isArray(l) ? l : []);
      setSellRequests(Array.isArray(s) ? s : []);
      setTestDrives(Array.isArray(t) ? t : []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
      setCars([]);
      setLeads([]);
      setSellRequests([]);
      setTestDrives([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      onNavigate('/admin/login');
      return;
    }
    loadAdminData();
  }, [token]);

  const handleOpenNewCarModal = () => {
    setEditingCar(null);
    setMake('Maruti Suzuki');
    setModel('');
    setVariant('');
    setYear(2021);
    setPrice(650000);
    setKmDriven(35000);
    setFuel('Petrol');
    setTransmission('Manual');
    setBodyType('Hatchback');
    setOwners(1);
    setColor('White');
    setStatus('Available');
    setFeatured(false);
    setInspectionScore(92);
    setImageUrl('');
    setCarImages([
      {
        id: `img-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1200&q=80',
        isPrimary: true,
        order: 0,
      },
    ]);
    setCarModalOpen(true);
  };

  const handleOpenEditCarModal = (car: Car) => {
    setEditingCar(car);
    setMake(car.make);
    setModel(car.model);
    setVariant(car.variant);
    setYear(car.year);
    setPrice(car.price);
    setKmDriven(car.kmDriven);
    setFuel(car.fuel);
    setTransmission(car.transmission);
    setBodyType(car.bodyType);
    setOwners(car.owners);
    setColor(car.color || '');
    setStatus(car.status);
    setFeatured(car.featured);
    setInspectionScore(car.inspectionScore || 90);
    setImageUrl(car.images?.[0]?.url || '');
    setCarImages(car.images && car.images.length > 0 ? car.images : []);
    setCarModalOpen(true);
  };

  const handleSaveCar = async (e: React.FormEvent) => {
    e.preventDefault();

    let finalImages = [...carImages];
    if (imageUrl.trim() !== '' && !finalImages.some((img) => img.url === imageUrl.trim())) {
      finalImages.unshift({
        id: `img-${Date.now()}`,
        url: imageUrl.trim(),
        isPrimary: finalImages.length === 0,
        order: 0,
      });
    }
    if (finalImages.length > 0 && !finalImages.some((img) => img.isPrimary)) {
      finalImages[0].isPrimary = true;
    }

    const primaryImgUrl = finalImages.find((img) => img.isPrimary)?.url || finalImages[0]?.url || imageUrl;

    const carData = {
      make,
      model,
      variant,
      year: Number(year),
      price: Number(price),
      kmDriven: Number(kmDriven),
      fuel,
      transmission,
      bodyType,
      owners: Number(owners),
      color,
      status,
      featured,
      inspectionScore: Number(inspectionScore),
      imageUrl: primaryImgUrl || undefined,
      images: finalImages,
    };

    try {
      if (editingCar) {
        await updateCar(token, editingCar.id, carData);
      } else {
        await createCar(token, carData);
      }
      setCarModalOpen(false);
      loadAdminData();
    } catch (err: any) {
      alert(err.message || 'Failed to save car');
    }
  };

  const handleDeleteCar = (car: Car) => {
    setCarToDelete(car);
  };

  const confirmDeleteCar = async () => {
    if (!carToDelete) return;
    const targetId = carToDelete.id;
    // Optimistic remove from local state immediately
    setCars((prev) => prev.filter((c) => c.id !== targetId));
    setCarToDelete(null);

    try {
      await deleteCar(token, targetId);
    } catch (err: any) {
      console.error('Delete car error:', err);
      // Reload in case of error
      loadAdminData();
    }
  };

  const handleToggleStatus = async (car: Car) => {
    const nextStatus = car.status === 'Available' ? 'Sold' : 'Available';
    setCars((prev) => prev.map((c) => (c.id === car.id ? { ...c, status: nextStatus } : c)));
    try {
      if (nextStatus === 'Sold') {
        await markCarAsSold(car.id);
      } else {
        await restoreCarToAvailable(car.id);
      }
    } catch (err: any) {
      console.error('Status toggle error:', err);
      loadAdminData();
    }
  };

  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      await updateLeadStatus(token, id, newStatus);
      setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l)));
    } catch (err: any) {
      alert(err.message || 'Failed to update lead status');
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      phone: businessPhone,
      whatsapp: businessWhatsapp,
      address: businessAddress,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ADMIN HEADER BAR */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black">
            TC
          </div>
          <div>
            <h1 className="text-lg font-black text-white">Dealership Control Portal</h1>
            <p className="text-[11px] text-slate-400">Trusted Cars • Karol Bagh, New Delhi</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/')}
            className="px-3.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold"
          >
            View Live Site
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex overflow-x-auto gap-2 py-3">
          {[
            { id: 'inventory', label: 'Car Inventory', count: cars.length, icon: CarIcon },
            { id: 'leads', label: 'Buyer Leads', count: leads.length, icon: Users },
            { id: 'sellRequests', label: 'Sell Enquiries', count: sellRequests.length, icon: Tag },
            { id: 'testDrives', label: 'Test Drives', count: testDrives.length, icon: Calendar },
            { id: 'settings', label: 'Dealer Settings', icon: SettingsIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-950'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-950 text-[10px] font-extrabold text-slate-200">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN BODY CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
        {loading ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-400">Loading Dashboard Records...</p>
          </div>
        ) : (
          <div>
            {/* 1. CAR INVENTORY TAB */}
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-white">Car Inventory ({cars.length})</h2>
                    <p className="text-xs text-slate-400">Manage vehicles, prices, photos, and availability status.</p>
                  </div>

                  <button
                    onClick={handleOpenNewCarModal}
                    className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-red-950"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Vehicle</span>
                  </button>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-4">Car Details</th>
                          <th className="p-4">Year & KM</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Fuel / Trans</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {cars.map((car) => (
                          <tr key={car.id} className="hover:bg-slate-950/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={car.images?.[0]?.url || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=200&q=80'}
                                  alt={car.model}
                                  className="w-12 h-9 object-cover rounded-lg border border-slate-800"
                                  referrerPolicy="no-referrer"
                                />
                                <div>
                                  <p className="font-bold text-white text-sm">{car.make} {car.model}</p>
                                  <p className="text-[10px] text-slate-400">{car.variant}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 font-semibold text-slate-300">
                              {car.year} • {formatKm(car.kmDriven)}
                            </td>
                            <td className="p-4 font-black text-white text-sm">
                              {formatPrice(car.price, 'full')}
                            </td>
                            <td className="p-4 text-slate-300 font-semibold">
                              {car.fuel} • {car.transmission}
                            </td>
                            <td className="p-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                  car.status === 'Available'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : car.status === 'Reserved'
                                    ? 'bg-amber-950 text-amber-400 border border-amber-800'
                                    : 'bg-red-950 text-red-400 border border-red-800'
                                }`}
                              >
                                {car.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2 whitespace-nowrap">
                              <button
                                onClick={() => handleToggleStatus(car)}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-colors border ${
                                  car.status === 'Available'
                                    ? 'bg-amber-950/60 hover:bg-amber-900 text-amber-300 border-amber-800'
                                    : 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                                }`}
                                title={car.status === 'Available' ? 'Mark vehicle as Sold' : 'Mark vehicle as Available'}
                              >
                                {car.status === 'Available' ? 'Mark Sold' : 'Make Available'}
                              </button>
                              <button
                                onClick={() => handleOpenEditCarModal(car)}
                                className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 inline-flex items-center"
                                title="Edit Car"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteCar(car)}
                                className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800 inline-flex items-center"
                                title="Remove / Delete Car from Stock"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. LEADS TAB */}
            {activeTab === 'leads' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Buyer Leads ({leads.length})</h2>
                  <p className="text-xs text-slate-400">Direct inquiries submitted by buyers looking for cars in Karol Bagh.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {leads.map((lead) => (
                    <div key={lead.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{lead.name}</h4>
                          <p className="text-xs font-mono text-red-400">{lead.phone}</p>
                        </div>
                        <select
                          value={lead.status || 'New'}
                          onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[10px] font-bold text-slate-200 rounded-lg px-2 py-1"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>

                      {lead.carTitle && (
                        <div className="p-2.5 bg-slate-950 rounded-xl text-xs font-semibold text-slate-300">
                          Inquiry Vehicle: <span className="text-white font-bold">{lead.carTitle}</span>
                        </div>
                      )}

                      {lead.message && (
                        <p className="text-xs text-slate-400 italic">"{lead.message}"</p>
                      )}

                      <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                        Received: {new Date(lead.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. SELL REQUESTS TAB */}
            {activeTab === 'sellRequests' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Car Valuation Requests ({sellRequests.length})</h2>
                  <p className="text-xs text-slate-400">Requests from users wanting to sell their used vehicles.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sellRequests.map((req) => (
                    <div key={req.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-base">{req.year} {req.make} {req.model}</h4>
                          <p className="text-xs font-mono text-red-400 font-bold">{req.phone} • {req.name}</p>
                        </div>
                        {req.expectedPrice && (
                          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-black px-2.5 py-1 rounded-lg">
                            Expected: ₹{req.expectedPrice} L
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] bg-slate-950 p-2.5 rounded-xl text-slate-300">
                        <div><span className="text-slate-500 block text-[9px] uppercase">KM</span>{formatKm(req.kmDriven)}</div>
                        <div><span className="text-slate-500 block text-[9px] uppercase">Fuel</span>{req.fuel}</div>
                        <div><span className="text-slate-500 block text-[9px] uppercase">City</span>{req.city || 'Delhi'}</div>
                      </div>

                      <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                        Submitted: {new Date(req.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. TEST DRIVES TAB */}
            {activeTab === 'testDrives' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Test Drive Appointments ({testDrives.length})</h2>
                  <p className="text-xs text-slate-400">Scheduled showroom & doorstep test drives.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testDrives.map((td) => (
                    <div key={td.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-white text-sm">{td.carTitle}</h4>
                          <p className="text-xs text-slate-300 font-semibold">{td.name} ({td.phone})</p>
                        </div>
                        <span className="bg-red-950 text-red-400 border border-red-800 text-xs font-bold px-2.5 py-1 rounded-lg">
                          {td.preferredDate} @ {td.preferredTime}
                        </span>
                      </div>

                      {td.message && (
                        <p className="text-xs text-slate-400 italic bg-slate-950 p-2.5 rounded-xl">"{td.message}"</p>
                      )}

                      <p className="text-[10px] text-slate-500 pt-2 border-t border-slate-800">
                        Booked: {new Date(td.createdAt).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. DEALER SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-white">Dealership Info Settings</h2>
                  <p className="text-xs text-slate-400">Update phone, WhatsApp, and showroom address displayed on the website.</p>
                </div>

                {settingsSaved && (
                  <div className="p-3 bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Settings Saved Successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={businessPhone}
                      onChange={(e) => setBusinessPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      value={businessWhatsapp}
                      onChange={(e) => setBusinessWhatsapp(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Showroom Address</label>
                    <textarea
                      rows={3}
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-semibold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider"
                  >
                    Save Dealership Settings
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* CAR MODAL */}
      {carModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-white">
            <button
              onClick={() => setCarModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-black text-white mb-6">
              {editingCar ? 'Edit Vehicle Details' : 'Add New Vehicle To Inventory'}
            </h3>

            <form onSubmit={handleSaveCar} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Variant</label>
                  <input
                    type="text"
                    required
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">KM Driven</label>
                  <input
                    type="number"
                    value={kmDriven}
                    onChange={(e) => setKmDriven(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Inspection Score</label>
                  <input
                    type="number"
                    value={inspectionScore}
                    onChange={(e) => setInspectionScore(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Fuel Type</label>
                  <select
                    value={fuel}
                    onChange={(e) => setFuel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="CNG">CNG</option>
                    <option value="Electric">Electric</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="Available">Available</option>
                    <option value="Reserved">Reserved</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>

              {/* DIRECT GALLERY PHOTO UPLOADER */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-red-500" />
                    <span>Car Photos ({carImages.length} uploaded)</span>
                  </label>
                  <span className="text-[11px] text-red-400 font-semibold">Direct Gallery & Camera Upload</span>
                </div>

                {/* DROPZONE / FILE SELECTOR */}
                <input
                  type="file"
                  id="gallery-file-input"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleGalleryFileUpload(e.target.files)}
                />
                <label
                  htmlFor="gallery-file-input"
                  className="cursor-pointer border-2 border-dashed border-red-800/80 hover:border-red-500 bg-red-950/20 hover:bg-red-950/40 p-5 rounded-2xl flex flex-col items-center justify-center text-center transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-900/40 border border-red-700/50 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform mb-2">
                    <Upload className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="text-sm font-extrabold text-white">
                    {uploadingImage ? 'Processing Photos...' : 'Tap / Click to Upload Photos from Gallery'}
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Select one or multiple car photos directly from your phone gallery or computer. No image URL needed!
                  </span>
                </label>

                {/* IMAGE THUMBNAIL GRID */}
                {carImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                    {carImages.map((img) => (
                      <div
                        key={img.id}
                        className={`relative group aspect-video rounded-xl overflow-hidden border-2 transition-all bg-slate-950 ${
                          img.isPrimary ? 'border-red-500 ring-2 ring-red-500/30' : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img src={img.url} alt="Vehicle preview" className="w-full h-full object-cover" />

                        {/* BADGES & CONTROLS */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-90 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            {img.isPrimary ? (
                              <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1 shadow-md">
                                <Star className="w-3 h-3 fill-white" /> Main Photo
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(img.id)}
                                className="bg-slate-900/90 hover:bg-red-600 text-slate-300 hover:text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
                              >
                                Set as Main
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoveImage(img.id)}
                              className="p-1 rounded-md bg-slate-950/80 hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {!img.isPrimary && (
                            <span className="text-[9px] text-slate-400 italic">Click "Set as Main" to use as primary thumbnail</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* OPTIONAL URL FALLBACK */}
                <div className="pt-2">
                  <details className="text-xs text-slate-400">
                    <summary className="cursor-pointer hover:text-slate-200 font-medium">Or paste an image web link (optional)</summary>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white mt-2"
                    />
                  </details>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-red-600 rounded"
                />
                <label htmlFor="featured-check" className="text-xs font-bold text-white">
                  Mark as Featured Car on Homepage
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider"
              >
                {editingCar ? 'Update Car Details' : 'Save To Inventory'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {carToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setCarToDelete(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-950 border border-slate-800"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-950/80 border border-red-800/80 text-red-500 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Remove Vehicle from Stock?</h3>
                <p className="text-xs text-slate-400">This action will delete the car permanently from your inventory.</p>
              </div>
            </div>

            {/* VEHICLE PREVIEW CARD */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center gap-3">
              <img
                src={carToDelete.images?.[0]?.url || 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=200&q=80'}
                alt={carToDelete.model}
                className="w-16 h-12 object-cover rounded-xl border border-slate-800 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-white text-sm truncate">{carToDelete.year} {carToDelete.make} {carToDelete.model}</p>
                <p className="text-xs font-mono font-bold text-red-400">{formatPrice(carToDelete.price, 'full')}</p>
                <p className="text-[10px] text-slate-400">{carToDelete.variant} • {formatKm(carToDelete.kmDriven)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCarToDelete(null)}
                className="flex-1 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCar}
                className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-red-950/60 flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Yes, Remove Car</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
    </div>
  );
};
