import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Calendar,
  Clock,
  Package,
  Plus,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertCircle,
  Truck,
  ChevronRight,
  User,
  X,
  ShoppingBag,
  SlidersHorizontal,
  Search,
  IndianRupee,
  Navigation,
  Phone,
  Video,
  LogOut,
  MapPin,
  Sparkles,
  Send,
  Pill,
  Check
} from 'lucide-react';
import api from '../api';
import CartDrawer from './CartDrawer';

// Initial authentic Indian pets dataset (Jamshedpur)
const INITIAL_PETS = [
  {
    id: 1,
    pet_name: 'Sheru',
    species: 'Dog',
    breed: 'Indie / Desi Dog',
    age: 3,
    weight_kg: 18.5,
    status: 'Healthy',
    image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
    owner_name: 'Pooja Sharma',
  },
  {
    id: 2,
    pet_name: 'Bruno',
    species: 'Dog',
    breed: 'Golden Retriever',
    age: 4,
    weight_kg: 31.2,
    status: 'Checkup Due',
    image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    owner_name: 'Pooja Sharma',
  },
  {
    id: 3,
    pet_name: 'Rani',
    species: 'Cat',
    breed: 'Indian Domestic Shorthair',
    age: 2,
    weight_kg: 3.8,
    status: 'Healthy',
    image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    owner_name: 'Pooja Sharma',
  }
];

// Fallback Indian veterinary medicines catalog
const FALLBACK_MEDICINES = [
  {
    id: 1,
    name: 'Melonex Pet Oral Suspension (Meloxicam 1.5mg/ml)',
    category: 'First Aid',
    price_inr: 145.00,
    stock: 42,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
    description: 'Fast-acting anti-inflammatory & pain relief oral suspension for acute musculoskeletal pain.'
  },
  {
    id: 2,
    name: 'Savavet Kiwof Plus Broad Spectrum Dewormer',
    category: 'Antibiotics',
    price_inr: 210.00,
    stock: 35,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400',
    description: 'Praziquantel & Pyrantel embonate chewable tablets for broad-spectrum roundworms & tapeworms.'
  },
  {
    id: 3,
    name: 'Bravecto Chewable Fluralaner Tablet (10-20 kg)',
    category: 'Supplements',
    price_inr: 1850.00,
    stock: 18,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
    description: 'Sustained 12-week chewable protection against ticks and fleas in canines.'
  },
  {
    id: 4,
    name: 'Pet Derm Medicated Chlorhexidine Shampoo (200ml)',
    category: 'Grooming',
    price_inr: 395.00,
    stock: 24,
    image_url: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400',
    description: 'Antifungal and antimicrobial therapeutic cleansing wash for dermatitis & itchy coat.'
  },
  {
    id: 5,
    name: 'Himalaya Liv.52 Pet Liver Support Tonic (110ml)',
    category: 'Supplements',
    price_inr: 175.00,
    stock: 60,
    image_url: 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&q=80&w=400',
    description: 'Natural herbal hepatoprotective supplement promoting appetite and liver tissue repair.'
  },
  {
    id: 6,
    name: 'Ceff Pet (Cephalexin 300mg Strip of 6)',
    category: 'Antibiotics',
    price_inr: 240.00,
    stock: 28,
    image_url: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400',
    description: 'Potent cephalosporin antibiotic prescribed for bacterial skin and soft-tissue infections.'
  },
  {
    id: 7,
    name: 'EarKleen Otic Cleanser with Tea Tree Oil (50ml)',
    category: 'First Aid',
    price_inr: 280.00,
    stock: 15,
    image_url: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
    description: 'Soothing antiseptic ear drops that eliminate wax buildup and deodorize infected ear canals.'
  },
  {
    id: 8,
    name: 'Vivaldis Samolin Gut Probiotics Sachets (10s)',
    category: 'Nutrition',
    price_inr: 360.00,
    stock: 8,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
    description: 'Live gut probiotics and prebiotics restoring stool balance during antibiotic therapy.'
  }
];

// Initial appointments
const INITIAL_APPOINTMENTS = [
  {
    id: 1,
    petName: 'Sheru',
    vetName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
    clinic: 'Bistupur Companion Animal Clinic',
    type: 'Telehealth Video',
    date: 'Today',
    time: '10:30 AM',
    status: 'Waiting',
    reason: 'Loss of appetite since 2 days, mild dry cough and lethargy.'
  },
  {
    id: 2,
    petName: 'Bruno',
    vetName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
    clinic: 'Bistupur Companion Animal Clinic',
    type: 'In-Clinic Checkup',
    date: 'Tomorrow',
    time: '11:15 AM',
    status: 'In Consultation',
    reason: 'Frequent ear scratching and foul odor from right ear.'
  }
];

// Initial active deliveries in Jamshedpur zones
const INITIAL_DELIVERIES = [
  {
    orderId: 'ORD-JSR-7712',
    date: 'Today, 04:15 PM',
    items: ['Melonex Pet 10ml', 'Savavet Kiwof Plus x 2'],
    total: 565.00,
    status: 'Out for Delivery',
    step: 3, // 1: Placed, 2: Packed, 3: Out for Delivery, 4: Delivered
    deliveryZone: 'Bistupur Hub -> Kadma -> Sakchi -> Mango Route',
    destinationAddress: '14/B, Contractors Area, Main Road, Bistupur, Jamshedpur',
    rider: {
      name: 'Ramesh Yadav',
      phone: '+91 98351 90211',
      vehicle: 'Hero Electric Optima (Cold Box Insulated)',
      eta: '18 mins away',
    }
  },
  {
    orderId: 'ORD-JSR-6590',
    date: 'Yesterday',
    items: ['Himalaya Liv.52 Pet Liver Tonic (110ml)'],
    total: 175.00,
    status: 'Delivered',
    step: 4,
    deliveryZone: 'Mango Dimna Road Route',
    destinationAddress: 'Block 3, Dimna Chowk, Mango, Jamshedpur',
    rider: {
      name: 'Suraj Singh',
      phone: '+91 97712 34567',
      vehicle: 'Bajaj Pulsar 150',
      eta: 'Delivered at 02:40 PM',
    }
  }
];

const CATEGORIES = ['All', 'Supplements', 'First Aid', 'Antibiotics', 'Grooming', 'Nutrition'];

export default function OwnerDashboard({ onLogout, onOpenBookModal }) {
  // Navigation tabs: 'overview' | 'pets' | 'telehealth' | 'pharmacy' | 'tracker'
  const [activeTab, setActiveTab] = useState('overview');

  // Pets state
  const [pets, setPets] = useState(INITIAL_PETS);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [newPet, setNewPet] = useState({
    pet_name: '',
    species: 'Dog',
    breed: '',
    age: '2',
    weight_kg: '15'
  });

  // Appointments state
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [newBooking, setNewBooking] = useState({
    pet: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:30 AM',
    type: 'Telehealth Video',
    reason: ''
  });
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  // Pharmacy & Cart state
  const [medicines, setMedicines] = useState(FALLBACK_MEDICINES);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState(2500);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState(null);

  // Deliveries state
  const [deliveries, setDeliveries] = useState(INITIAL_DELIVERIES);

  // Video call modal state
  const [activeVideoCall, setActiveVideoCall] = useState(null);

  // Fetch data from Django backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const petsRes = await api.get('pets/');
        const petsData = petsRes.data.results || petsRes.data;
        if (Array.isArray(petsData) && petsData.length > 0) {
          setPets(petsData);
        }
      } catch (err) {
        console.warn('Backend pets API unreachable, using local Jamshedpur dataset:', err);
      }

      try {
        const medsRes = await api.get('medicines/');
        const medsData = medsRes.data.results || medsRes.data;
        if (Array.isArray(medsData) && medsData.length > 0) {
          setMedicines(medsData);
        }
      } catch (err) {
        console.warn('Backend medicines API unreachable, using local Jamshedpur catalog:', err);
      }

      try {
        const aptsRes = await api.get('appointments/');
        const aptsData = aptsRes.data.results || aptsRes.data;
        if (Array.isArray(aptsData) && aptsData.length > 0) {
          const formatted = aptsData.map((a) => ({
            id: a.id,
            petName: a.pet_name || 'Pet',
            vetName: a.vet_name || 'Dr. Anjali Sharma (B.V.Sc & A.H)',
            clinic: 'Bistupur Companion Animal Clinic',
            type: 'Telehealth Video',
            date: a.date,
            time: a.time,
            status: a.status,
            reason: a.reason_for_visit,
          }));
          setAppointments(formatted);
        }
      } catch (err) {
        console.warn('Backend appointments API unreachable, using local appointments:', err);
      }
    };

    fetchData();
  }, []);

  // Filter medicines by search query, category, and price slider
  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.description && m.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCat =
        selectedCategory === 'All' || m.category?.toLowerCase() === selectedCategory.toLowerCase();
      const price = Number(m.price_inr || m.price) || 0;
      const matchesPrice = price <= priceMax;
      return matchesSearch && matchesCat && matchesPrice;
    });
  }, [medicines, searchQuery, selectedCategory, priceMax]);

  // Cart Handlers
  const handleAddToCart = (med) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === med.id);
      if (existing) {
        return prev.map((item) =>
          item.id === med.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...med, quantity: 1 }];
    });

    setAddedItemNotice(med.name);
    setTimeout(() => setAddedItemNotice(null), 2000);
  };

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleOrderSuccess = (order) => {
    const newDelivery = {
      orderId: order.orderId,
      date: 'Just Now',
      items: order.items.map((i) => `${i.name} (x${i.quantity})`),
      total: order.totalAmount,
      status: 'Dispatched',
      step: 2,
      deliveryZone: 'Bistupur Hub -> Sakchi Market Express',
      destinationAddress: 'Main Road, Bistupur, Jamshedpur',
      rider: {
        name: 'Ramesh Yadav',
        phone: '+91 98351 90211',
        vehicle: 'Hero Electric Optima (Cold Box Insulated)',
        eta: '25 mins away',
      }
    };
    setDeliveries([newDelivery, ...deliveries]);
    setCartItems([]);
    setActiveTab('tracker');
  };

  // Add Pet Handler
  const handleAddPet = async (e) => {
    e.preventDefault();
    if (!newPet.pet_name.trim()) return;

    const petPayload = {
      pet_name: newPet.pet_name,
      species: newPet.species,
      breed: newPet.breed || (newPet.species === 'Dog' ? 'Indie' : 'Domestic Shorthair'),
      age: parseInt(newPet.age, 10) || 1,
      weight_kg: parseFloat(newPet.weight_kg) || 10.0,
      image_url:
        newPet.species === 'Dog'
          ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
      owner_name: 'Pooja Sharma',
    };

    try {
      const res = await api.post('pets/', petPayload);
      setPets([res.data, ...pets]);
    } catch (err) {
      const localPet = { ...petPayload, id: Date.now(), status: 'Healthy' };
      setPets([localPet, ...pets]);
    }

    setNewPet({ pet_name: '', species: 'Dog', breed: '', age: '2', weight_kg: '15' });
    setIsAddPetOpen(false);
  };

  // Telehealth Booking Handler
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    if (!newBooking.reason.trim()) return;

    const selectedPetObj = pets.find((p) => p.id.toString() === newBooking.pet) || pets[0];
    const newApt = {
      id: Date.now(),
      petName: selectedPetObj ? selectedPetObj.pet_name : 'Sheru',
      vetName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
      clinic: 'Bistupur Companion Animal Clinic',
      type: newBooking.type,
      date: newBooking.date,
      time: newBooking.time,
      status: 'Waiting',
      reason: newBooking.reason,
    };

    try {
      await api.post('appointments/', {
        pet: selectedPetObj ? selectedPetObj.id : 1,
        date: newBooking.date,
        time: '10:30:00',
        reason_for_visit: newBooking.reason,
        status: 'Waiting',
      });
    } catch (err) {
      console.warn('Booking saved locally:', err);
    }

    setAppointments([newApt, ...appointments]);
    setBookingSuccessMsg(`Consultation confirmed for ${newApt.petName} with Dr. Anjali Sharma!`);
    setNewBooking({
      pet: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:30 AM',
      type: 'Telehealth Video',
      reason: ''
    });

    setTimeout(() => setBookingSuccessMsg(''), 4000);
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + (i.quantity || 1), 0);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-24 md:pb-12 text-left selection:bg-teal-500/20">
      
      {/* ========================================================================= */}
      {/* 1. TOP RESPONSIVE HEADER BAR                                              */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-700 to-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md shadow-teal-700/20">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-base tracking-tight">PawCare Jamshedpur</span>
                <span className="text-[10px] font-bold uppercase bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" />
                <span>Bistupur Hub • Jharkhand</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'pets', label: 'My Pets', icon: Heart },
              { id: 'telehealth', label: 'Telehealth Booking', icon: Calendar },
              { id: 'pharmacy', label: 'Pharmacy & Cart', icon: Pill },
              { id: 'tracker', label: 'Delivery Tracker', icon: Truck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-h-[38px] px-3.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Top Actions: Cart Drawer Trigger + User Profile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-800 transition-colors cursor-pointer border border-teal-200"
              title="Open Medicine Cart"
            >
              <ShoppingBag className="w-5 h-5 text-teal-700" />
              {totalCartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-sm"
                >
                  {totalCartCount}
                </motion.span>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block leading-tight">Pooja Sharma</span>
                <span className="text-[11px] text-teal-700 font-medium">Pet Parent (Bistupur)</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                PS
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Item Added Toast Feedback */}
      <AnimatePresence>
        {addedItemNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-teal-800 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold"
          >
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Added to Basket: {addedItemNotice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT BODY                                                      */}
      {/* ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 space-y-8">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-2.5 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Jamshedpur Veterinary Telehealth & Express Pharmacy
            </span>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Namaste, Pooja & Fur Family 🐾
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 leading-relaxed">
              Dr. Anjali Sharma is on duty at Bistupur Clinic. Your active order is moving through local delivery routes.
            </p>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* MODULE 1: MY PETS GRID                                                  */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === 'overview' || activeTab === 'pets') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                  <span>My Pets</span>
                </h2>
                <p className="text-xs text-slate-500">Registered companion animals & digital health passports</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPetOpen(true)}
                className="min-h-[40px] px-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-700/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register Pet</span>
              </button>
            </div>

            {/* Pets Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <motion.div
                  key={pet.id}
                  whileHover={{ y: -3 }}
                  className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <img
                          src={pet.image_url || (pet.species === 'Dog'
                            ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'
                            : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400')}
                          alt={pet.pet_name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
                        />
                        <span className="absolute -bottom-1 -right-1 text-base">
                          {pet.species === 'Dog' ? '🐶' : '🐱'}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          pet.status === 'Healthy'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {pet.status || 'Active'}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-base font-extrabold text-slate-900">{pet.pet_name}</h3>
                      <p className="text-xs font-semibold text-teal-700">{pet.breed}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Age</span>
                        <span className="font-bold text-slate-800">{pet.age} {typeof pet.age === 'number' ? 'yrs' : ''}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">Weight</span>
                        <span className="font-bold text-slate-800">{pet.weight_kg ? `${pet.weight_kg} kg` : '18.5 kg'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Vaccine Passport: <strong className="text-emerald-700">Verified</strong></span>
                    <button
                      type="button"
                      onClick={() => {
                        setNewBooking((prev) => ({ ...prev, pet: pet.id.toString() }));
                        setActiveTab('telehealth');
                      }}
                      className="text-teal-700 font-bold hover:underline inline-flex items-center gap-1"
                    >
                      Book Visit <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* MODULE 2: TELEHEALTH BOOKING FORM & ACTIVE QUEUE                        */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === 'overview' || activeTab === 'telehealth') && (
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  <span>Telehealth & In-Clinic Booking</span>
                </h2>
                <p className="text-xs text-slate-500">Book direct consultations with verified veterinarians in Jamshedpur</p>
              </div>
            </div>

            {/* Success alert */}
            {bookingSuccessMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{bookingSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Telehealth Booking Form */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold">
                    👨‍⚕️
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Dr. Anjali Sharma (B.V.Sc & A.H)</h3>
                    <p className="text-[11px] text-slate-400">VCI Reg: JH-VCI-2018-4491 • Bistupur Clinic</p>
                  </div>
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-4">
                  {/* Select Pet */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Companion</label>
                    <select
                      value={newBooking.pet}
                      onChange={(e) => setNewBooking({ ...newBooking, pet: e.target.value })}
                      required
                      className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                    >
                      <option value="">Select registered pet...</option>
                      {pets.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.pet_name} ({p.species} - {p.breed})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Visit Mode */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Telehealth Video', 'In-Clinic Visit'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewBooking({ ...newBooking, type })}
                          className={`min-h-[40px] px-3 rounded-xl border text-xs font-bold transition-colors ${
                            newBooking.type === type
                              ? 'border-teal-700 bg-teal-50 text-teal-900'
                              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {type === 'Telehealth Video' ? '📹 Video Consult' : '🏥 Clinic Visit'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={newBooking.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                        required
                        className="w-full min-h-[42px] px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Time Slot</label>
                      <select
                        value={newBooking.time}
                        onChange={(e) => setNewBooking({ ...newBooking, time: e.target.value })}
                        className="w-full min-h-[42px] px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                      >
                        <option value="10:30 AM">10:30 AM (Morning)</option>
                        <option value="11:45 AM">11:45 AM (Morning)</option>
                        <option value="02:30 PM">02:30 PM (Afternoon)</option>
                        <option value="04:00 PM">04:00 PM (Evening)</option>
                        <option value="05:30 PM">05:30 PM (Evening)</option>
                      </select>
                    </div>
                  </div>

                  {/* Clinical Reason */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Chief Complaints / Symptoms</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Loss of appetite since 2 days, itching ears, vomiting yellow bile..."
                      value={newBooking.reason}
                      onChange={(e) => setNewBooking({ ...newBooking, reason: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full min-h-[44px] py-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-bold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Confirm Slot (₹400 Consultation Fee)</span>
                  </button>
                </form>
              </div>

              {/* Scheduled Consultations Timeline */}
              <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Your Booked Sessions</h3>
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm shrink-0">
                            {apt.type.includes('Video') ? <Video className="w-5 h-5 text-teal-700" /> : <MapPin className="w-5 h-5 text-teal-700" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{apt.petName}</h4>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                  apt.status === 'Waiting'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : apt.status === 'In Consultation'
                                    ? 'bg-cyan-50 text-cyan-700 border-cyan-200 animate-pulse'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                {apt.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{apt.vetName}</p>
                            <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">Note: {apt.reason}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                          <span className="text-[11px] font-bold text-slate-700">{apt.date} • {apt.time}</span>
                          {apt.type.includes('Video') && (
                            <button
                              type="button"
                              onClick={() => setActiveVideoCall(apt)}
                              className="px-3 py-1.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-[11px] shadow-xs cursor-pointer"
                            >
                              Join Call
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-3 bg-teal-50/60 rounded-2xl border border-teal-200/60 text-[11px] text-teal-800">
                  ⚡ <strong>Emergency Vet Line (Jamshedpur 24x7):</strong> +91 657 242 1100 (Bistupur Hub)
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* MODULE 3: PHARMACY & MEDICINE CATALOG (WITH PRICE SLIDER & CART)        */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === 'overview' || activeTab === 'pharmacy') && (
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>Pharmacy & Medicine Catalog</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Certified Indian veterinary pharmaceuticals with price filters and express local delivery
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="self-start sm:self-auto min-h-[40px] px-4 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white text-xs font-bold shadow-md shadow-teal-700/20 flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>View Basket ({totalCartCount})</span>
              </button>
            </div>

            {/* Filter Bar: Category Chips, Price Slider, Search */}
            <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Search */}
                <div className="md:col-span-7 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search medicines (e.g. Melonex, Bravecto, Liv.52, Dewormer)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full min-h-[42px] pl-10 pr-4 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>

                {/* Price Slider */}
                <div className="md:col-span-5 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1">
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                      <span>Max Price: ₹{priceMax}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Up to ₹3,000</span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="3000"
                    step="50"
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                  />
                </div>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`min-h-[34px] px-3.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredMedicines.map((med) => {
                const price = Number(med.price_inr || med.price) || 0;
                return (
                  <motion.div
                    key={med.id}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-full h-36 rounded-2xl bg-slate-100 overflow-hidden mb-3 relative">
                        <img
                          src={med.image_url}
                          alt={med.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400';
                          }}
                        />
                        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-teal-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-slate-200">
                          {med.category}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {med.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                        {med.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">Price</span>
                        <span className="text-base font-black text-teal-800">
                          ₹{price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddToCart(med)}
                        className="min-h-[38px] px-3.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* ----------------------------------------------------------------------- */}
        {/* MODULE 4: DELIVERY TRACKER (JAMSHEDPUR LOCAL ZONES)                     */}
        {/* ----------------------------------------------------------------------- */}
        {(activeTab === 'overview' || activeTab === 'tracker') && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-teal-600" />
                  <span>Jamshedpur Local Delivery Tracker</span>
                </h2>
                <p className="text-xs text-slate-500">Live order status moving through Bistupur, Sakchi, Kadma, and Sonari routes</p>
              </div>
            </div>

            <div className="space-y-4">
              {deliveries.map((del) => (
                <div
                  key={del.orderId}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
                >
                  {/* Top Order Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{del.orderId}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            del.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-teal-50 text-teal-800 border-teal-200 animate-pulse'
                          }`}
                        >
                          {del.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Route: <strong>{del.deliveryZone}</strong></p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">{del.date}</span>
                      <span className="text-sm font-extrabold text-teal-800">₹{del.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Live Stepper Tracker */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs relative">
                      {[
                        { title: 'Order Confirmed', sub: 'Bistupur Hub', stepNum: 1 },
                        { title: 'Cold-Box Sealed', sub: 'Dispensary', stepNum: 2 },
                        { title: 'Out on Route', sub: 'Rider Dispatched', stepNum: 3 },
                        { title: 'Delivered', sub: 'Doorstep', stepNum: 4 },
                      ].map((s) => {
                        const isDone = del.step >= s.stepNum;
                        const isCurrent = del.step === s.stepNum;
                        return (
                          <div key={s.title} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                                isDone
                                  ? 'bg-teal-700 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-teal-500/20' : ''}`}
                            >
                              {isDone ? <Check className="w-4 h-4" /> : s.stepNum}
                            </div>
                            <span className={`text-[11px] font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                              {s.title}
                            </span>
                            <span className="text-[10px] text-slate-400 hidden sm:block">{s.sub}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rider Card & Destination */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                        🛵
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{del.rider.name}</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                            {del.rider.eta}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{del.rider.vehicle} • {del.rider.phone}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 sm:text-right">
                      <span className="text-slate-400 block text-[10px] uppercase">Destination</span>
                      <span>{del.destinationAddress}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION (Strictly Mobile-First)                       */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-2 z-40 flex items-center justify-around shadow-lg">
        {[
          { id: 'overview', label: 'Home', icon: Activity },
          { id: 'pets', label: 'Pets', icon: Heart },
          { id: 'telehealth', label: 'Consult', icon: Calendar },
          { id: 'pharmacy', label: 'Pharmacy', icon: Pill },
          { id: 'tracker', label: 'Delivery', icon: Truck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[54px] rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-teal-700 font-extrabold' : 'text-slate-500'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-teal-700 scale-110' : ''}`} />
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. SLIDING CART DRAWER (With Razorpay Checkout Placeholder)               */}
      {/* ========================================================================= */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* ========================================================================= */}
      {/* 5. ADD PET MODAL                                                          */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddPetOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-200 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Register Companion Animal</h3>
                <button
                  onClick={() => setIsAddPetOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddPet} className="space-y-3 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pet Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sheru, Bruno, Simba"
                    value={newPet.pet_name}
                    onChange={(e) => setNewPet({ ...newPet, pet_name: e.target.value })}
                    className="w-full min-h-[40px] px-3.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Species</label>
                    <select
                      value={newPet.species}
                      onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
                    <input
                      type="text"
                      placeholder="e.g. Indie, Golden Retriever"
                      value={newPet.breed}
                      onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      min="1"
                      max="25"
                      value={newPet.age}
                      onChange={(e) => setNewPet({ ...newPet, age: e.target.value })}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newPet.weight_kg}
                      onChange={(e) => setNewPet({ ...newPet, weight_kg: e.target.value })}
                      className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full min-h-[42px] py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                  >
                    Save & Generate Health Passport
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 6. TELEHEALTH VIDEO CALL SIMULATOR MODAL                                  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeVideoCall && (
          <div className="fixed inset-0 z-60 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-white"
            >
              {/* Doctor Video Call Stream */}
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                  alt="Dr. Anjali Sharma"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span>Dr. Anjali Sharma • Live Tele-consult</span>
                </div>

                {/* Patient self-view PiP */}
                <div className="absolute bottom-4 right-4 w-28 h-20 rounded-xl bg-slate-800 border-2 border-teal-500 overflow-hidden shadow-lg">
                  <img
                    src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=200"
                    alt="Sheru"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Call Controls */}
              <div className="p-4 bg-slate-900 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">{activeVideoCall.petName}'s Consultation</h4>
                  <p className="text-[11px] text-slate-400">Encrypted WebRTC Telehealth Room (Jamshedpur)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveVideoCall(null)}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md"
                >
                  End Call
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
