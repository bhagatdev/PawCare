import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Stethoscope, CheckCircle2, AlertCircle, Sparkles, Send } from 'lucide-react';

const TIME_SLOTS = [
  { id: '09:00:00', label: '09:00 AM', period: 'Morning' },
  { id: '10:30:00', label: '10:30 AM', period: 'Morning' },
  { id: '14:00:00', label: '02:00 PM', period: 'Afternoon' },
  { id: '15:30:00', label: '03:30 PM', period: 'Afternoon' },
  { id: '17:00:00', label: '05:00 PM', period: 'Evening' },
  { id: '18:30:00', label: '06:30 PM', period: 'Evening' },
];

export default function BookAppointment({ onBookingSuccess }) {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState('');
  const [date, setDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [activePeriod, setActivePeriod] = useState('All');

  const [loadingPets, setLoadingPets] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Minimum date selectable is today
  const today = new Date().toISOString().split('T')[0];

  // Fetch pet profiles from Django REST Framework backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoadingPets(true);
        const res = await axios.get('http://127.0.0.1:8000/api/pets/');
        const data = res.data.results || res.data;
        if (Array.isArray(data) && data.length > 0) {
          setPets(data);
          setSelectedPet(data[0].id.toString());
        }
      } catch (err) {
        console.warn('Could not load pets from server, applying default fallback:', err);
        // Fallback demo pet if backend has not yet seeded pets
        const fallback = [
          { id: 1, pet_name: 'Milo', species: 'Dog', breed: 'Golden Retriever' },
          { id: 2, pet_name: 'Luna', species: 'Cat', breed: 'Siamese' },
        ];
        setPets(fallback);
        setSelectedPet(fallback[0].id.toString());
      } finally {
        setLoadingPets(false);
      }
    };

    fetchPets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    if (!selectedPet) {
      setStatusMessage({ type: 'error', text: 'Please select a pet.' });
      return;
    }
    if (!date) {
      setStatusMessage({ type: 'error', text: 'Please pick an appointment date.' });
      return;
    }
    if (!selectedTime) {
      setStatusMessage({ type: 'error', text: 'Please choose an available time slot.' });
      return;
    }
    if (!reason.trim()) {
      setStatusMessage({ type: 'error', text: 'Please describe the symptoms or reason for visit.' });
      return;
    }

    setSubmitting(true);

    const payload = {
      pet: parseInt(selectedPet, 10),
      date: date,
      time: selectedTime,
      reason_for_visit: reason,
      status: 'Pending',
    };

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/appointments/', payload);
      setStatusMessage({
        type: 'success',
        text: 'Appointment booked successfully! Our veterinary team will confirm shortly.',
      });

      // Reset form fields
      setDate('');
      setSelectedTime('');
      setReason('');

      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
    } catch (err) {
      console.error('Booking failed:', err.response?.data || err.message);
      const errorDetail = err.response?.data
        ? Object.entries(err.response.data).map(([k, v]) => `${k}: ${v}`).join(' ')
        : 'Failed to connect to the appointment server. Please try again.';
      setStatusMessage({ type: 'error', text: errorDetail });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSlots = activePeriod === 'All'
    ? TIME_SLOTS
    : TIME_SLOTS.filter((s) => s.period === activePeriod);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl p-6 sm:p-10 text-left"
      >
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Book a Vet Appointment</h2>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                <Sparkles className="w-3 h-3" /> Certified Vets
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Schedule in-person or virtual telehealth consultations for your pet.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        <AnimatePresence>
          {statusMessage.text && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-6 p-4 rounded-2xl flex items-start gap-3 text-xs leading-relaxed border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Pet */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Patient Pet <span className="text-rose-400">*</span>
            </label>
            {loadingPets ? (
              <div className="h-11 rounded-xl bg-slate-800 animate-pulse" />
            ) : (
              <select
                value={selectedPet}
                onChange={(e) => setSelectedPet(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors"
                required
              >
                {pets.length === 0 ? (
                  <option value="">No pets found. Please add a pet profile first.</option>
                ) : (
                  pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.pet_name} ({p.species} • {p.breed || 'Standard'}) — Owner: {p.owner_name}
                    </option>
                  ))
                )}
              </select>
            )}
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-teal-400" />
              Preferred Date <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              min={today}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white focus:outline-none focus:border-teal-500 transition-colors calendar-picker"
              required
            />
          </div>

          {/* Time Slot Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-400" />
                Available Time Slot <span className="text-rose-400">*</span>
              </label>

              {/* Time Period Filter Chips */}
              <div className="flex gap-1 text-[11px] bg-slate-800 p-1 rounded-lg border border-slate-700">
                {['All', 'Morning', 'Afternoon', 'Evening'].map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setActivePeriod(period)}
                    className={`px-2 py-0.5 rounded-md font-medium transition-all ${
                      activePeriod === period
                        ? 'bg-teal-500 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              {filteredSlots.map((slot) => {
                const isSelected = selectedTime === slot.id;
                return (
                  <motion.button
                    key={slot.id}
                    type="button"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    onClick={() => setSelectedTime(slot.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-teal-500 border-teal-400 text-white shadow-lg shadow-teal-500/25 ring-2 ring-teal-400/40'
                        : 'bg-slate-800/70 border-slate-700/80 text-slate-300 hover:bg-slate-800 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    <span>{slot.label}</span>
                    <span className={`text-[10px] font-normal ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                      {slot.period}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Reason for Visit / Symptoms <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="e.g. Annual vaccination checkup, minor skin itching, lethargy after meals..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
            />
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white text-sm font-bold shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting Booking...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm Appointment</span>
                </>
              )}
            </button>
            <p className="text-[11px] text-slate-500 text-center mt-2.5">
              Secure booking guaranteed. No cancellation penalty up to 2 hours prior to visit.
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
