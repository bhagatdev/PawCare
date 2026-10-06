import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Pill,
  FileUp,
  Sparkles,
  ShieldCheck,
  Clock,
  MapPin,
  ArrowRight,
  PhoneCall,
  CheckCircle2,
  Heart,
  Star,
  Activity,
  Truck
} from 'lucide-react';

export default function Home({ onOpenCart }) {
  const services = [
    {
      icon: Stethoscope,
      title: 'Veterinary Telehealth & OPD',
      desc: 'Instant 1080p encrypted video consultations or physical OPD visits with Dr. Anjali Sharma at Bistupur Central Clinic.',
      link: '/consultation',
      cta: 'Book Consultation',
      badge: 'VCI Verified',
      color: 'from-cyan-600 to-teal-700',
    },
    {
      icon: Pill,
      title: 'Express Jamshedpur Pharmacy',
      desc: 'Authentic Indian pharmaceuticals, liver tonics, and NSAIDs delivered in insulated cold boxes in under 30 minutes.',
      link: '/pharmacy',
      cta: 'Explore Medicines',
      badge: 'Cold-Chain Sealed',
      color: 'from-teal-600 to-emerald-700',
    },
    {
      icon: FileUp,
      title: 'Prescription Verification',
      desc: 'Drag and drop external doctor prescriptions (PDF/JPG) for instant pharmacist audit, digitisation, and automatic medicine dispatch.',
      link: '/upload-rx',
      cta: 'Upload Prescription',
      badge: 'Govt. Drug License',
      color: 'from-emerald-600 to-teal-800',
    },
    {
      icon: Sparkles,
      title: 'Predictive AI Symptom Triage',
      desc: 'Clinical heuristic triage engine analyzing symptoms in real time, detecting emergency red flags, and calculating risk priorities.',
      link: '/symptom-triage',
      cta: 'Start AI Triage',
      badge: 'Instant Analysis',
      color: 'from-indigo-600 to-teal-700',
    },
  ];

  const testimonials = [
    {
      name: 'Rahul Verma',
      pet: 'Sheru (Indie Dog, 3 yrs)',
      location: 'Contractors Area, Bistupur',
      rating: 5,
      text: 'Dr. Anjali diagnosed Sheru\'s acute gastroenteritis over video consult within 10 minutes. The prescribed Melonex and Liv.52 arrived in a cold box to our home in under 25 minutes! Lifesavers.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    },
    {
      name: 'Priya Nair',
      pet: 'Max (Golden Retriever, 4 yrs)',
      location: 'Kalimati Road, Sakchi',
      rating: 5,
      text: 'Booking routine deworming and ear checks is so effortless now. No waiting in crowded waiting rooms—direct token queuing and transparent pricing in Indian Rupees.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    },
    {
      name: 'Dr. Vikram Sen',
      pet: 'Kittu (Persian Cat, 2 yrs)',
      location: 'Farm Area, Kadma',
      rating: 5,
      text: 'As a medical professional myself, I appreciate their strict adherence to VCI guidelines and temperature-controlled medical storage. Exceptional clinical standard for Jamshedpur.',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 text-left selection:bg-teal-500/20">
      
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-950 to-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-teal-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Dr. Anjali Sharma On-Duty • Bistupur Hub</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                India's Most Trusted <br />
                <span className="bg-gradient-to-r from-teal-400 to-emerald-300 bg-clip-text text-transparent">
                  Pet Healthcare & Pharmacy
                </span>
              </h1>

              <p className="text-sm sm:text-base text-teal-100/90 max-w-xl leading-relaxed">
                Connect directly with certified veterinarians for video telemedicine, upload external prescriptions for instant dispensary approval, and receive cold-box medication across Jamshedpur.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/consultation"
                  className="min-h-[48px] px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-teal-500/25 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Book Vet Visit</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/pharmacy"
                  className="min-h-[48px] px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm backdrop-blur-md flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Pill className="w-4 h-4 text-teal-300" />
                  <span>Order Medicines (₹)</span>
                </Link>

                <Link
                  to="/symptom-triage"
                  className="min-h-[48px] px-5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Symptom Triage</span>
                </Link>
              </div>

              {/* Statutory Guarantee Badges */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-xs text-teal-200/90">
                <div>
                  <span className="block font-black text-white text-base sm:text-lg">100% VCI</span>
                  <span className="text-[11px] text-teal-300">Registered Surgeons</span>
                </div>
                <div>
                  <span className="block font-black text-white text-base sm:text-lg">30 Mins</span>
                  <span className="text-[11px] text-teal-300">Express Local Dispatch</span>
                </div>
                <div>
                  <span className="block font-black text-white text-base sm:text-lg">Cold-Chain</span>
                  <span className="text-[11px] text-teal-300">Insulated Vaccine Box</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Canine Portrait (Labrador Retriever) */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20 aspect-4/3 sm:aspect-square"
              >
                {/* STRICT VISUAL COMPLIANCE: Exactly ONE Labrador Retriever image */}
                <img
                  src="https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&q=80&w=800"
                  alt="Labrador Retriever Health Checkup"
                  className="w-full h-full object-cover"
                />

                {/* Floating Card: Live Vet Consult */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                      🩺
                    </div>
                    <div>
                      <span className="text-xs font-bold block">Dr. Anjali Sharma</span>
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Available for Telehealth Video
                      </span>
                    </div>
                  </div>
                  <Link
                    to="/consultation"
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition-colors"
                  >
                    Consult
                  </Link>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. OUR CORE SERVICES GRID                                                 */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Comprehensive Pet Care
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Advanced Clinical Care for Jamshedpur Pets
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything your companion needs—from emergency video consults to FDA-certified pharmaceuticals delivered to Bistupur, Sakchi, and Kadma.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={srv.title}
                whileHover={{ y: -6 }}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${srv.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 leading-snug mb-2">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {srv.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to={srv.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 group"
                  >
                    <span>{srv.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BREED CARE SHOWCASE (Featuring Siberian Husky & Desi Breeds)          */}
      {/* ========================================================================= */}
      <section className="bg-white py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left: Siberian Husky Portrait */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200 aspect-square">
                {/* STRICT VISUAL COMPLIANCE: Exactly ONE Siberian Husky image */}
                <img
                  src="https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&q=80&w=800"
                  alt="Siberian Husky Tropical Care"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-4 left-4 bg-teal-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/20">
                Specialized Tropical Coat & Hydration Protocol
              </div>
            </div>

            {/* Right: Clinical Description */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">
                Excellence Across All Breeds
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Tailored Veterinary Regimens for Heavy-Coated & Indie Breeds
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Whether managing heat stress in northern breeds like Siberian Huskies or preventative deworming and vaccination passports for resilient Indian Desi hounds, Dr. Anjali Sharma provides evidence-based clinical protocols adapted to Jharkhand's climate.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-900 mb-1">Dermatology & Shedding</h4>
                  <p className="text-slate-500">Antifungal shampoos, salmon omega oils, and anti-tick topical pipettes.</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <h4 className="font-bold text-slate-900 mb-1">Joint & Hip Dysplasia</h4>
                  <p className="text-slate-500">Glucosamine chondroitin supplementation and orthopedic mobility screening.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/consultation"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-600 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <span>Schedule Breed Consultation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ANIMATED TESTIMONIALS                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-1">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Pet Parent Stories</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved by 12,000+ Indian Pet Guardians
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic mb-6">
                  "{t.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-teal-700 font-semibold">{t.pet}</p>
                  <p className="text-[10px] text-slate-400">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}
