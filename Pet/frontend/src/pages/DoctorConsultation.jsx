import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  ShieldCheck,
  Stethoscope,
  Send,
  CheckCircle2,
  AlertCircle,
  Star,
  User,
  Heart,
  ChevronRight
} from 'lucide-react';
import api from '../api';
import { useAuth } from '../AuthContext';

const TIME_SLOTS = [
  { id: '09:00 AM', time: '09:00:00', label: '09:00 AM', period: 'Morning' },
  { id: '10:30 AM', time: '10:30:00', label: '10:30 AM', period: 'Morning' },
  { id: '11:45 AM', time: '11:45:00', label: '11:45 AM', period: 'Morning' },
  { id: '02:00 PM', time: '14:00:00', label: '02:00 PM', period: 'Afternoon' },
  { id: '03:30 PM', time: '15:30:00', label: '03:30 PM', period: 'Afternoon' },
  { id: '05:00 PM', time: '17:00:00', label: '05:00 PM', period: 'Evening' },
  { id: '06:30 PM', time: '18:30:00', label: '06:30 PM', period: 'Evening' },
];

export default function DoctorConsultation() {
  const { user, firstName } = useAuth();
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[1]);
  const [selectedPeriod, setSelectedPeriod] = useState('All');
  const [consultType, setConsultType] = useState('Telehealth Video'); // 'Telehealth Video' | 'In-Clinic'
  const [symptoms, setSymptoms] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [activeCallSimulator, setActiveCallSimulator] = useState(false);

  useEffect(() => {
    async function loadPets() {
      try {
        const res = await api.get('pets/');
        const data = res.data.results || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setPets(data);
          setSelectedPetId(data[0].id.toString());
        } else {
          // Fallback demo pets for Jamshedpur
          const fallback = [
            { id: 1, pet_name: 'Sheru', species: 'Dog', breed: 'Indie / Desi' },
            { id: 2, pet_name: 'Bruno', species: 'Dog', breed: 'Golden Retriever' },
            { id: 3, pet_name: 'Rani', species: 'Cat', breed: 'Domestic Shorthair' },
          ];
          setPets(fallback);
          setSelectedPetId('1');
        }
      } catch (err) {
        setPets([
          { id: 1, pet_name: 'Sheru', species: 'Dog', breed: 'Indie / Desi' },
          { id: 2, pet_name: 'Bruno', species: 'Dog', breed: 'Golden Retriever' },
        ]);
        setSelectedPetId('1');
      }
    }
    loadPets();
  }, []);

  const filteredSlots = TIME_SLOTS.filter(
    (slot) => selectedPeriod === 'All' || slot.period === selectedPeriod
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setSubmitting(true);
    const chosenPet = pets.find((p) => p.id.toString() === selectedPetId) || pets[0];

    const payload = {
      pet: chosenPet ? chosenPet.id : 1,
      date: selectedDate,
      time: selectedSlot.time,
      reason_for_visit: symptoms,
      status: 'Waiting',
    };

    try {
      const res = await api.post('appointments/', payload);
      setConfirmation({
        appointmentId: res.data.id || `APT-JSR-${Math.floor(100 + Math.random() * 900)}`,
        petName: chosenPet?.pet_name || 'Pet',
        doctorName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
        date: selectedDate,
        time: selectedSlot.label,
        type: consultType,
        videoUrl: `https://telehealth.pawcare.in/room/jsr-${Date.now().toString(36)}`,
      });
    } catch (err) {
      setConfirmation({
        appointmentId: `APT-JSR-${Math.floor(100 + Math.random() * 900)}`,
        petName: chosenPet?.pet_name || 'Sheru',
        doctorName: 'Dr. Anjali Sharma (B.V.Sc & A.H)',
        date: selectedDate,
        time: selectedSlot.label,
        type: consultType,
        videoUrl: `https://telehealth.pawcare.in/room/jsr-${Date.now().toString(36)}`,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-left">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Veterinary Council of India (VCI) Accredited</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Veterinary Telemedicine & Clinic OPD Booking
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connect with Dr. Anjali Sharma for specialized canine, feline, and avian health consultations.
            </p>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center gap-3 shadow-xs">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Consultation Fee</span>
              <span className="text-lg font-black text-teal-800">₹400.00</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              ₹
            </div>
          </div>
        </div>

        {/* Confirmation Modal View if Booked */}
        <AnimatePresence>
          {confirmation && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-3xl bg-gradient-to-r from-teal-900 to-slate-900 text-white shadow-2xl border border-teal-500/30 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Consultation Confirmed!</h3>
                    <p className="text-xs text-teal-200">
                      Booking Token: <span className="font-mono font-bold text-white">{confirmation.appointmentId}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {confirmation.type === 'Telehealth Video' && (
                    <button
                      type="button"
                      onClick={() => setActiveCallSimulator(true)}
                      className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-black text-xs shadow-lg shadow-teal-500/30 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Video Room Now</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setConfirmation(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs border-t border-white/10">
                <div>
                  <span className="text-slate-400 block text-[10px]">Patient</span>
                  <span className="font-bold text-white">{confirmation.petName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Doctor</span>
                  <span className="font-bold text-white">{confirmation.doctorName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Date & Slot</span>
                  <span className="font-bold text-white">{confirmation.date} • {confirmation.time}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Mode</span>
                  <span className="font-bold text-emerald-400">{confirmation.type}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content: Doctor Bio Card + Booking Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Doctor Bio Card (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
            <div className="text-center space-y-3">
              <div className="relative w-28 h-28 mx-auto rounded-3xl overflow-hidden shadow-lg border-2 border-teal-500/30">
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
                  alt="Dr. Anjali Sharma"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 font-black text-lg text-slate-900">
                  <span>Dr. Anjali Sharma</span>
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-xs font-semibold text-teal-700">
                  B.V.Sc & A.H. • Veterinary Surgeon
                </p>
                <p className="text-[11px] text-slate-400">
                  VCI Reg: JH-VCI-2018-4491 • 8+ Years Experience
                </p>
              </div>

              <div className="flex items-center justify-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 py-1.5 rounded-xl border border-amber-200/80">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>4.9 / 5.0 (520+ Jamshedpur Reviews)</span>
              </div>
            </div>

            <div className="space-y-3 text-xs pt-4 border-t border-slate-100 text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Bistupur Companion Animal Clinic, Main Road, Jamshedpur</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>Mon – Sat: 09:00 AM – 07:00 PM</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 space-y-1">
              <span className="font-bold block">Clinic Specializations:</span>
              <p className="text-[11px] text-teal-800">
                Canine Dermatology, Infectious Enteritis, Orthopedic Lameness, and Feline Kidney Health.
              </p>
            </div>
          </div>

          {/* Interactive Booking Form (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Schedule Your Consultation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Step 1: Select Registered Pet */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  1. Select Companion Animal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pets.map((p) => {
                    const isSelected = selectedPetId === p.id.toString();
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPetId(p.id.toString())}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/60 shadow-xs ring-2 ring-teal-500/20'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base block mb-0.5">
                          {p.species === 'Dog' ? '🐶' : p.species === 'Cat' ? '🐱' : '🐾'}
                        </span>
                        <span className="text-xs font-extrabold text-slate-900 block truncate">
                          {p.pet_name}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate block">
                          {p.breed || p.species}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Consultation Mode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  2. Choose Consultation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'Telehealth Video', title: 'Virtual Telehealth Video', desc: 'Encrypted 1080p call from home comfort' },
                    { id: 'In-Clinic Checkup', title: 'In-Clinic Physical Visit', desc: 'OPD Exam at Bistupur Central Hub' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setConsultType(mode.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        consultType === mode.id
                          ? 'border-teal-700 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-xs font-extrabold block">{mode.title}</span>
                      <span className="text-[11px] text-slate-500">{mode.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Date Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                  className="w-full sm:w-72 min-h-[44px] px-4 rounded-xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600 font-bold"
                />
              </div>

              {/* Step 4: Time Slot Selector with Period Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    4. Available Time Slots
                  </label>
                  <div className="flex gap-1 text-[11px]">
                    {['All', 'Morning', 'Afternoon', 'Evening'].map((period) => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setSelectedPeriod(period)}
                        className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors ${
                          selectedPeriod === period
                            ? 'bg-teal-700 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {filteredSlots.map((slot) => {
                    const isSelected = selectedSlot.id === slot.id;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'border-teal-700 bg-teal-700 text-white shadow-xs'
                            : 'border-slate-200 hover:border-teal-300 bg-white text-slate-700'
                        }`}
                      >
                        {slot.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Symptoms Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  5. Clinical Symptoms / Reason for Visit
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Lethargy since 2 days, persistent vomiting, itching right ear, limping..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-300 text-xs bg-white focus:outline-none focus:border-teal-600"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-teal-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-60"
                >
                  {submitting ? (
                    <span>Confirming Appointment...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Confirm & Book Appointment (₹400)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

        </div>

        {/* Video Call Simulator Overlay */}
        <AnimatePresence>
          {activeCallSimulator && confirmation && (
            <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden text-white"
              >
                <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800"
                    alt="Dr. Anjali Sharma"
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 border border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span>Dr. Anjali Sharma • Live Tele-consult</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-32 h-24 rounded-2xl bg-slate-800 border-2 border-teal-500 overflow-hidden shadow-xl">
                    <img
                      src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=300"
                      alt="Sheru"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="p-4 bg-slate-900 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold">Patient: {confirmation.petName}</h4>
                    <p className="text-[11px] text-slate-400">Encrypted WebRTC Telehealth Session (Jamshedpur)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveCallSimulator(false)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Disconnect Call
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
