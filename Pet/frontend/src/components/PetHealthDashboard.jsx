import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldCheck, Heart, Calendar, Plus, FileText, Syringe, CheckCircle2, X } from 'lucide-react';
import { mockPetProfiles } from '../data/mockData';

export default function PetHealthDashboard({ bookedAppointments = [] }) {
  const [pets, setPets] = useState(mockPetProfiles);
  const [selectedPetId, setSelectedPetId] = useState(mockPetProfiles[0].id);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [recordType, setRecordType] = useState('Vaccination');
  const [recordTitle, setRecordTitle] = useState('');
  const [recordVet, setRecordVet] = useState('Dr. Sarah Jenkins');
  const [recordDate, setRecordDate] = useState('2026-09-30');

  const currentPet = pets.find((p) => p.id === selectedPetId) || pets[0];

  const handleAddRecord = (e) => {
    e.preventDefault();
    if (!recordTitle.trim()) return;

    const newRecord = {
      id: Date.now(),
      type: recordType,
      title: recordTitle,
      date: recordDate,
      vet: recordVet,
      status: 'Active',
    };

    setPets((prev) =>
      prev.map((pet) => {
        if (pet.id === selectedPetId) {
          return {
            ...pet,
            records: [newRecord, ...pet.records],
          };
        }
        return pet;
      })
    );

    setRecordTitle('');
    setShowAddRecordModal(false);
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs tracking-wider uppercase mb-1">
            <Activity className="w-4 h-4" />
            <span>Digital Pet Passport & Health Records</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Track Vaccinations, Vitals & Clinical History
          </h2>
          <p className="text-slate-400 text-sm mt-1.5 max-w-2xl">
            Keep verified immunization records, microchip IDs, and ongoing medical prescriptions accessible anywhere in the world.
          </p>
        </div>

        {/* Pet Switcher Buttons */}
        <div className="flex items-center gap-3">
          {pets.map((pet) => {
            const isSelected = pet.id === selectedPetId;
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-teal-500/15 border-teal-500 text-white shadow-lg shadow-teal-500/15'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <img
                  src={pet.avatar}
                  alt={pet.name}
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-teal-400"
                />
                <div className="text-left">
                  <p className="text-xs font-bold leading-none">{pet.name}</p>
                  <p className="text-[10px] text-teal-300">{pet.species}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Pet Vitals & Records Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Pet Passport Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center gap-4">
              <img
                src={currentPet.avatar}
                alt={currentPet.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-teal-500/30 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-white">{currentPet.name}</h3>
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                </div>
                <p className="text-xs text-teal-400 font-semibold">{currentPet.breed}</p>
                <p className="text-xs text-slate-400 mt-1">Age: {currentPet.age}</p>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-800/80">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Current Weight</span>
                <span className="text-base font-bold text-white">{currentPet.weight}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Microchip ID</span>
                <span className="text-xs font-mono font-bold text-teal-300">{currentPet.chipId}</span>
              </div>
              <div className="col-span-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">Known Allergies</span>
                <span className="text-xs font-semibold text-rose-300">{currentPet.allergies}</span>
              </div>
            </div>

            {/* Quick Action */}
            <button
              onClick={() => setShowAddRecordModal(true)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 hover:text-white border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Medical or Vaccine Record
            </button>
          </div>

          {/* Booked Appointments Banner */}
          {bookedAppointments.length > 0 && (
            <div className="rounded-2xl bg-teal-950/40 border border-teal-500/40 p-5 text-left shadow-lg">
              <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-4 h-4" />
                <span>Upcoming Scheduled Session</span>
              </div>
              {bookedAppointments.map((app, i) => (
                <div key={i} className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-white text-sm">Consultation with {app.vet}</p>
                  <p className="text-teal-400 font-medium">Slot: {app.slot}</p>
                  <p className="text-slate-400">Patient: {app.pet}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Health Timeline */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white">Clinical History & Inoculation Log</h3>
              <p className="text-xs text-slate-400">Chronological verified entries for {currentPet.name}</p>
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/30">
              {currentPet.records.length} Records Verified
            </span>
          </div>

          <div className="space-y-4">
            {currentPet.records.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 hover:border-teal-500/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 text-teal-400 flex items-center justify-center shrink-0">
                    {rec.type === 'Vaccination' ? <Syringe className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rec.title}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-teal-300 font-medium">
                        {rec.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Administered by: <span className="text-slate-300">{rec.vet}</span></p>
                  </div>
                </div>

                <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                  <span className="text-xs font-mono text-slate-400">{rec.date}</span>
                  <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {rec.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Record Modal */}
      <AnimatePresence>
        {showAddRecordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-[#0f1722] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
            >
              <button
                onClick={() => setShowAddRecordModal(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-1">Add Medical Entry</h3>
              <p className="text-xs text-slate-400 mb-6">Attach an official inoculation or vet checkup to {currentPet.name}'s profile.</p>

              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Record Type
                  </label>
                  <select
                    value={recordType}
                    onChange={(e) => setRecordType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="Vaccination">Vaccination</option>
                    <option value="Checkup">General Checkup</option>
                    <option value="Medication">Medication / Prescription</option>
                    <option value="Surgery">Surgery / Procedure</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Title / Vaccine Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bordetella Kennel Cough Vaccine"
                    value={recordTitle}
                    onChange={(e) => setRecordTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Attending Veterinarian / Clinic
                  </label>
                  <input
                    type="text"
                    required
                    value={recordVet}
                    onChange={(e) => setRecordVet(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Date Administered
                  </label>
                  <input
                    type="date"
                    required
                    value={recordDate}
                    onChange={(e) => setRecordDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all"
                >
                  Save Record to Health Passport
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
