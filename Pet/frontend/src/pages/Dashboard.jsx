import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Heart,
  Calendar,
  Package,
  FileText,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Plus,
  Truck,
  Video,
  AlertCircle,
  CheckCircle2,
  FileUp,
  X,
  Send,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { user, firstName, updateProfile } = useAuth();
  
  // Navigation tabs: 'profile' | 'pets' | 'appointments' | 'orders' | 'prescriptions'
  const [activeTab, setActiveTab] = useState('pets');

  // Profile Form state
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || 'Pooja Sharma',
    first_name: user?.first_name || firstName || 'Pooja',
    email: user?.email || 'pooja@example.com',
    phone: user?.phone_number || '+91 98765 43210',
    city: user?.city || 'Jamshedpur (Bistupur)',
    address: '14/B, Contractors Area, Main Road, Bistupur, Jamshedpur',
  });
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Pets state
  const [pets, setPets] = useState([
    {
      id: 1,
      pet_name: 'Sheru',
      species: 'Dog',
      breed: 'Indie / Desi Dog',
      age: 3,
      weight_kg: 18.5,
      vaccination: 'Rabies Booster due in 14 days',
      deworming: 'Next Kiwof dose in 20 days',
      image_url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 2,
      pet_name: 'Bruno',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 4,
      weight_kg: 31.2,
      vaccination: 'DHPPiL up-to-date',
      deworming: 'Next dose due in 45 days',
      image_url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    },
    {
      id: 3,
      pet_name: 'Rani',
      species: 'Cat',
      breed: 'Domestic Shorthair',
      age: 2,
      weight_kg: 3.8,
      vaccination: 'Tricat Trio due in 2 months',
      deworming: 'Deworming current',
      image_url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    }
  ]);
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [newPet, setNewPet] = useState({ pet_name: '', species: 'Dog', breed: '', age: 2, weight_kg: 15 });

  // Upcoming appointments with live countdown timer
  const [appointments, setAppointments] = useState([
    {
      id: 'APT-JSR-101',
      petName: 'Sheru',
      doctorName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
      date: 'Today',
      time: '04:30 PM',
      mode: 'Telehealth Video',
      reason: 'Loss of appetite and mild dry cough',
      countdown: 'Starts in 01 hr 45 mins',
      videoUrl: 'https://telehealth.pawcare.in/room/jsr-101',
      status: 'Confirmed'
    },
    {
      id: 'APT-JSR-102',
      petName: 'Bruno',
      doctorName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
      date: 'Tomorrow',
      time: '11:00 AM',
      mode: 'In-Clinic Checkup',
      reason: 'Right ear scratching and routine hygiene check',
      countdown: 'Tomorrow Morning',
      status: 'Scheduled'
    }
  ]);

  // Order history and tracking
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD-JSR-7712',
      date: 'Today, 03:15 PM',
      items: ['Melonex Pet Oral Suspension 10ml', 'Savavet Kiwof Plus Dewormer x 2'],
      total: 565.00,
      status: 'Out for Delivery',
      currentStep: 3,
      deliveryZone: 'Bistupur Hub -> Kadma -> Sakchi Route',
      destination: '14/B, Contractors Area, Main Road, Bistupur',
      rider: {
        name: 'Ramesh Yadav',
        phone: '+91 98351 90211',
        vehicle: 'Hero Electric Optima (Cold Box Insulated)',
        eta: '14 mins away'
      }
    },
    {
      orderId: 'ORD-JSR-6590',
      date: '28 Sep 2026',
      items: ['Himalaya Liv.52 Pet Liver Support Tonic (110ml)'],
      total: 175.00,
      status: 'Delivered',
      currentStep: 4,
      deliveryZone: 'Sakchi Boulevard Route',
      destination: 'Kalimati Road, Sakchi, Jamshedpur',
      rider: {
        name: 'Suraj Singh',
        phone: '+91 97712 34567',
        vehicle: 'Bajaj Pulsar 150',
        eta: 'Delivered'
      }
    }
  ]);

  // Uploaded Prescriptions tracking
  const [uploadedRxList, setUploadedRxList] = useState([
    {
      id: 'RX-JSR-4819',
      petName: 'Sheru',
      doctorName: 'Dr. Anjali Sharma',
      uploadedDate: 'Today, 01:20 PM',
      status: 'Pending Verification',
      adminNotes: 'Reviewing Meloxicam oral suspension dosage against body weight (18.5kg).',
      fileName: 'Sheru_Clinical_Summary_2026.pdf'
    },
    {
      id: 'RX-JSR-3921',
      petName: 'Bruno',
      doctorName: 'Tata Steel Vet Hospital',
      uploadedDate: '24 Sep 2026',
      status: 'Medicines Dispatched',
      adminNotes: 'Verified by Chief Pharmacist. Order #ORD-JSR-6590 fulfilled.',
      fileName: 'Ear_Drops_Prescription.jpg'
    }
  ]);

  // Load from backend if available
  useEffect(() => {
    async function loadBackendData() {
      try {
        const petsRes = await api.get('pets/');
        const data = petsRes.data.results || petsRes.data;
        if (Array.isArray(data) && data.length > 0) {
          setPets(data.map((p) => ({
            ...p,
            vaccination: 'Rabies Booster due in 14 days',
            deworming: 'Deworming scheduled',
          })));
        }
      } catch (err) {}

      try {
        const rxRes = await api.get('prescriptions/');
        const rxData = rxRes.data.results || rxRes.data;
        if (Array.isArray(rxData) && rxData.length > 0) {
          setUploadedRxList(rxData.map((r) => ({
            id: `RX-JSR-${r.id}`,
            petName: r.pet_name || 'Pet',
            doctorName: r.doctor_name || 'Dr. Anjali Sharma',
            uploadedDate: new Date(r.uploaded_at).toLocaleDateString(),
            status: r.status,
            adminNotes: r.admin_notes || 'Pending Pharmacist review',
            fileName: r.prescription_file ? r.prescription_file.split('/').pop() : 'Prescription_Document.pdf'
          })));
        }
      } catch (err) {}
    }
    loadBackendData();
  }, []);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      full_name: profileData.full_name,
      first_name: profileData.first_name,
      phone_number: profileData.phone,
      city: profileData.city,
    });
    setProfileSavedMsg('Profile details successfully updated!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  const handleAddPetSubmit = async (e) => {
    e.preventDefault();
    if (!newPet.pet_name.trim()) return;

    const petObj = {
      id: Date.now(),
      pet_name: newPet.pet_name,
      species: newPet.species,
      breed: newPet.breed || 'Indie / Desi',
      age: Number(newPet.age) || 1,
      weight_kg: Number(newPet.weight_kg) || 10,
      vaccination: 'Passport generated • Vaccines up to date',
      deworming: 'Next dose in 30 days',
      image_url:
        newPet.species === 'Dog'
          ? 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    };

    try {
      await api.post('pets/', {
        pet_name: petObj.pet_name,
        species: petObj.species,
        breed: petObj.breed,
        age: petObj.age,
        weight_kg: petObj.weight_kg,
        image_url: petObj.image_url,
      });
    } catch {}

    setPets([petObj, ...pets]);
    setNewPet({ pet_name: '', species: 'Dog', breed: '', age: 2, weight_kg: 15 });
    setIsAddPetOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Greeting Banner */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md mb-2.5 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
              Verified Pet Guardian Hub • Jamshedpur
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {profileData.first_name} & Fur Family 🐾
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm mt-1 leading-relaxed">
              Manage your companion health records, track ongoing cold-box medicine deliveries, and join scheduled video consultations with Dr. Anjali Sharma.
            </p>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          {[
            { id: 'pets', label: 'My Pets', icon: Heart, count: pets.length },
            { id: 'appointments', label: 'Upcoming Appointments', icon: Calendar, count: appointments.length },
            { id: 'orders', label: 'Order History & Tracking', icon: Package, count: orders.length },
            { id: 'prescriptions', label: 'My Uploaded Prescriptions', icon: FileText, count: uploadedRxList.length },
            { id: 'profile', label: 'My Profile', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[42px] px-4 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-teal-600'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ===================================================================== */}
        {/* TAB 1: MY PETS                                                        */}
        {/* ===================================================================== */}
        {activeTab === 'pets' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Registered Companions</h2>
                <p className="text-xs text-slate-500">Digital health records, vaccination schedules & passports</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddPetOpen(true)}
                className="min-h-[40px] px-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-700/20 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Register Pet</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {pets.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="relative">
                        <img
                          src={p.image_url}
                          alt={p.pet_name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
                        />
                        <span className="absolute -bottom-1 -right-1 text-base">
                          {p.species === 'Dog' ? '🐶' : '🐱'}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Passport Verified
                      </span>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-base font-black text-slate-900">{p.pet_name}</h3>
                      <p className="text-xs font-bold text-teal-700">{p.breed} • {p.species}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Age</span>
                        <span className="font-extrabold text-slate-800">{p.age} Years</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Weight</span>
                        <span className="font-extrabold text-slate-800">{p.weight_kg} kg</span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-amber-50/70 rounded-2xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                      <span className="font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Vaccination & Care Reminders:
                      </span>
                      <p className="text-amber-800">{p.vaccination}</p>
                      <p className="text-amber-800">{p.deworming}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <Link
                      to="/consultation"
                      className="font-bold text-teal-700 hover:text-teal-800 inline-flex items-center gap-1"
                    >
                      Book Vet Visit <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* TAB 2: UPCOMING APPOINTMENTS WITH COUNTDOWN TIMER                     */}
        {/* ===================================================================== */}
        {activeTab === 'appointments' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upcoming Vet Consultations</h2>
                <p className="text-xs text-slate-500">Live countdowns, encrypted room links, and token queuing</p>
              </div>

              <Link
                to="/consultation"
                className="min-h-[40px] px-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Book New Session</span>
              </Link>
            </div>

            <div className="space-y-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xl shrink-0">
                      {apt.mode.includes('Video') ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-slate-900">{apt.petName}</span>
                        <span className="text-xs font-mono font-bold text-teal-700">[{apt.id}]</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {apt.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 font-medium">
                        Doctor: <strong>{apt.doctorName}</strong>
                      </p>
                      <p className="text-xs text-slate-500">Note: {apt.reason}</p>

                      {/* Live Countdown Pill */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-900 text-xs font-black">
                        <Clock className="w-3.5 h-3.5 text-cyan-600 animate-pulse" />
                        <span>{apt.countdown}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Scheduled Time</span>
                      <span className="text-xs font-extrabold text-slate-800">{apt.date} • {apt.time}</span>
                    </div>

                    {apt.mode.includes('Video') && (
                      <Link
                        to="/telehealth-room"
                        className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                      >
                        <Video className="w-4 h-4" />
                        <span>Join Call</span>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* TAB 3: ORDER HISTORY & LIVE DELIVERY TRACKING                         */}
        {/* ===================================================================== */}
        {activeTab === 'orders' && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Order History & Live Jamshedpur Tracking</h2>
              <p className="text-xs text-slate-500">Real-time status of cold-box medicine packages dispatched to your area</p>
            </div>

            <div className="space-y-5">
              {orders.map((ord) => (
                <div
                  key={ord.orderId}
                  className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-slate-900">{ord.orderId}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Route: {ord.deliveryZone}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[11px] text-slate-400 block">{ord.date}</span>
                      <span className="text-base font-black text-teal-800">₹{ord.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Vertical / Stepper Timeline */}
                  <div className="py-2">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      {[
                        { title: 'Order Placed', sub: 'Bistupur Hub', step: 1 },
                        { title: 'Cold-Box Sealed', sub: 'Dispensary', step: 2 },
                        { title: 'Out for Delivery', sub: 'Rider on Route', step: 3 },
                        { title: 'Delivered', sub: 'Doorstep', step: 4 },
                      ].map((s) => {
                        const isDone = ord.currentStep >= s.step;
                        const isCurrent = ord.currentStep === s.step;
                        return (
                          <div key={s.title} className="flex flex-col items-center">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                                isDone
                                  ? 'bg-teal-700 text-white shadow-sm'
                                  : 'bg-slate-100 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-teal-500/20' : ''}`}
                            >
                              {isDone ? '✓' : s.step}
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

                  {/* Items List & Rider Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Prescription Items</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 font-medium">
                        {ord.items.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-200 text-teal-900 space-y-1">
                      <span className="text-teal-700 block text-[10px] uppercase font-bold">Delivery Partner</span>
                      <p className="font-bold">{ord.rider.name} • {ord.rider.eta}</p>
                      <p className="text-[11px] text-teal-800">{ord.rider.vehicle} • {ord.rider.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* TAB 4: MY UPLOADED PRESCRIPTIONS TRACKER                             */}
        {/* ===================================================================== */}
        {activeTab === 'prescriptions' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">My Uploaded Prescriptions</h2>
                <p className="text-xs text-slate-500">Track pharmacist review status and medicine dispensary verification</p>
              </div>

              <Link
                to="/upload-rx"
                className="min-h-[40px] px-4 rounded-xl bg-teal-700 hover:bg-teal-600 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <FileUp className="w-4 h-4" />
                <span>Upload New Rx</span>
              </Link>
            </div>

            <div className="space-y-4">
              {uploadedRxList.map((rx) => (
                <div
                  key={rx.id}
                  className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{rx.id}</span>
                        <span className="text-xs text-slate-500 font-medium">({rx.petName})</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            rx.status === 'Verified by Pharmacist' || rx.status === 'Medicines Dispatched'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {rx.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">Prescribing Doctor: <strong>{rx.doctorName}</strong></p>
                      <p className="text-[11px] text-slate-500">File: <span className="font-mono text-slate-700">{rx.fileName}</span></p>
                      <p className="text-[11px] text-teal-800 bg-teal-50/60 p-2 rounded-xl border border-teal-100">
                        Pharmacist Note: {rx.adminNotes}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block uppercase">Submitted On</span>
                    <span className="text-xs font-bold text-slate-700">{rx.uploadedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ===================================================================== */}
        {/* TAB 5: MY PROFILE                                                    */}
        {/* ===================================================================== */}
        {activeTab === 'profile' && (
          <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Pet Guardian Profile</h2>
              <p className="text-xs text-slate-500">Update your verified personal details and delivery addresses in Jamshedpur</p>
            </div>

            {profileSavedMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSavedMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name (Greeting)</label>
                  <input
                    type="text"
                    required
                    value={profileData.first_name}
                    onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Indian Mobile Number (+91)</label>
                  <input
                    type="text"
                    required
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full min-h-[42px] px-3.5 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Default Delivery Address</label>
                <textarea
                  rows={2}
                  required
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                />
              </div>

              <div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Add Pet Modal */}
        <AnimatePresence>
          {isAddPetOpen && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 text-left space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-sm text-slate-900">Register Companion Animal</h3>
                  <button onClick={() => setIsAddPetOpen(false)} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddPetSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pet Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Simba, Milo"
                      value={newPet.pet_name}
                      onChange={(e) => setNewPet({ ...newPet, pet_name: e.target.value })}
                      className="w-full min-h-[40px] px-3.5 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Species</label>
                      <select
                        value={newPet.species}
                        onChange={(e) => setNewPet({ ...newPet, species: e.target.value })}
                        className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs bg-white"
                      >
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Bird">Bird</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
                      <input
                        type="text"
                        placeholder="e.g. Indie, Golden Retriever"
                        value={newPet.breed}
                        onChange={(e) => setNewPet({ ...newPet, breed: e.target.value })}
                        className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs"
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
                        className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Weight (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newPet.weight_kg}
                        onChange={(e) => setNewPet({ ...newPet, weight_kg: e.target.value })}
                        className="w-full min-h-[40px] px-3 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-teal-700 text-white font-bold text-xs shadow-md"
                    >
                      Save Pet Profile
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
