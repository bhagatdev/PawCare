import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stethoscope, Video, MapPin, Star, Calendar, Clock, CheckCircle2, X, Search, ShieldCheck } from 'lucide-react';
import { mockVeterinarians, mockPetProfiles } from '../data/mockData';

export default function VetBookingSection({ onBookSuccess }) {
  const [filterType, setFilterType] = useState('all'); // all, virtual, inPerson
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [selectedPet, setSelectedPet] = useState(mockPetProfiles[0].name);
  const [visitReason, setVisitReason] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const filteredVets = mockVeterinarians.filter((vet) => {
    const matchesSearch = vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          vet.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterType === 'virtual') return vet.virtual;
    if (filterType === 'inPerson') return vet.inPerson;
    return true;
  });

  const handleOpenBooking = (vet, slot) => {
    setSelectedVet(vet);
    setSelectedSlot(slot || vet.slots[0]);
    setBookingConfirmed(false);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    if (onBookSuccess) {
      onBookSuccess({
        vet: selectedVet.name,
        slot: selectedSlot,
        pet: selectedPet,
        fee: selectedVet.fee
      });
    }
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 text-left gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Stethoscope className="w-4 h-4" />
            <span>Veterinary Appointments & Telehealth</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Consult With Board-Certified Specialists
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            Choose between instant HD video triage from the comfort of home or book priority clinic examinations.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search specialty or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          <div className="p-1 rounded-xl bg-slate-900 border border-slate-800 flex items-center">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterType === 'all' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All Doctors
            </button>
            <button
              onClick={() => setFilterType('virtual')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterType === 'virtual' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              Tele-Health
            </button>
            <button
              onClick={() => setFilterType('inPerson')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterType === 'inPerson' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              In-Clinic
            </button>
          </div>
        </div>
      </div>

      {/* Vet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredVets.map((vet, idx) => (
          <motion.div
            key={vet.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            whileHover={{ y: -6 }}
            className="rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-teal-500/40 p-5 flex flex-col justify-between shadow-xl hover:shadow-teal-500/10 transition-all text-left"
          >
            <div>
              {/* Doctor Header */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={vet.avatar}
                    alt={vet.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white">{vet.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </div>
                  <p className="text-xs text-teal-400 font-medium">{vet.role}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">{vet.rating}</span>
                    <span className="text-[11px] text-slate-400">({vet.reviews})</span>
                  </div>
                </div>
              </div>

              {/* Bio & Details */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <p className="text-xs text-slate-300 font-medium line-clamp-1">{vet.specialization}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{vet.clinic}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{vet.bio}</p>
              </div>

              {/* Available Slots Chips */}
              <div className="mt-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-teal-400" /> Available Next:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {vet.slots.map((slot, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleOpenBooking(vet, slot)}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-teal-500/20 text-slate-200 hover:text-teal-300 border border-slate-700/60 hover:border-teal-500/40 transition-colors"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">Consultation</span>
                <span className="text-lg font-bold text-white">${vet.fee}</span>
              </div>
              <button
                onClick={() => handleOpenBooking(vet, vet.slots[0])}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-white text-xs font-semibold shadow-md shadow-teal-500/20 transition-all hover:scale-105"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedVet && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#0f1722] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
            >
              <button
                onClick={() => setSelectedVet(null)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              {!bookingConfirmed ? (
                <form onSubmit={handleConfirmBooking} className="space-y-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={selectedVet.avatar}
                      alt={selectedVet.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-teal-500"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedVet.name}</h3>
                      <p className="text-xs text-teal-400">{selectedVet.specialization}</p>
                      <p className="text-xs text-slate-400">{selectedVet.clinic} • ${selectedVet.fee} Fee</p>
                    </div>
                  </div>

                  <hr className="border-slate-800" />

                  {/* Pet Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Select Patient Pet
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {mockPetProfiles.map((pet) => (
                        <button
                          type="button"
                          key={pet.id}
                          onClick={() => setSelectedPet(pet.name)}
                          className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                            selectedPet === pet.name
                              ? 'bg-teal-500/15 border-teal-500 text-white'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300'
                          }`}
                        >
                          <img src={pet.avatar} alt={pet.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-bold">{pet.name}</p>
                            <p className="text-[11px] text-slate-400">{pet.breed}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slot Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Selected Time Slot
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedVet.slots.map((s, idx) => (
                        <button
                          type="button"
                          key={idx}
                          onClick={() => setSelectedSlot(s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            selectedSlot === s
                              ? 'bg-teal-500 border-teal-400 text-white shadow-md'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reason for visit */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                      Reason for Consultation / Symptoms
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Mild limping after morning walks, reduced appetite for 2 days..."
                      value={visitReason}
                      onChange={(e) => setVisitReason(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-sm shadow-lg shadow-teal-500/25 transition-all"
                    >
                      Confirm Booking (${selectedVet.fee})
                    </button>
                    <p className="text-[11px] text-slate-400 text-center mt-2">
                      HD Meeting link and appointment instructions will be sent instantly.
                    </p>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Appointment Confirmed!</h3>
                  <p className="text-sm text-slate-300 max-w-sm mx-auto">
                    {selectedPet}'s consultation with <span className="text-teal-400 font-semibold">{selectedVet.name}</span> has been scheduled for <span className="text-white font-medium">{selectedSlot}</span>.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Appointment Type:</span>
                      <span className="text-white font-semibold">Virtual Telehealth</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Patient:</span>
                      <span className="text-white font-semibold">{selectedPet}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Consultation Fee:</span>
                      <span className="text-emerald-400 font-bold">${selectedVet.fee}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVet(null)}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                  >
                    Done & Return to Appointments
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
