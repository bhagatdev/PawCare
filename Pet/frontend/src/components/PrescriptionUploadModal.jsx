import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, X, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';
import { mockPetProfiles } from '../data/mockData';

export default function PrescriptionUploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [selectedPet, setSelectedPet] = useState(mockPetProfiles[0].name);
  const [vetName, setVetName] = useState('Dr. Sarah Jenkins');
  const [fileName, setFileName] = useState('vet_rx_script_barnaby.pdf');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      if (onUploadSuccess) onUploadSuccess({ pet: selectedPet, vet: vetName, file: fileName });
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-[#0f1722] border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl text-left"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <FileUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Upload Pet Prescription</h3>
                <p className="text-xs text-slate-400">Licensed veterinary verification in under 15 minutes</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Pet selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Prescription For Pet
                </label>
                <select
                  value={selectedPet}
                  onChange={(e) => setSelectedPet(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                >
                  {mockPetProfiles.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.species} • {p.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Vet Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Prescribing Veterinarian Name
                </label>
                <input
                  type="text"
                  required
                  value={vetName}
                  onChange={(e) => setVetName(e.target.value)}
                  placeholder="e.g. Dr. Marcus Vance"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Prescription Document / Photo
                </label>
                <div className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-2xl p-6 text-center bg-slate-900/60 transition-colors">
                  <FileUp className="w-8 h-8 text-teal-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-white">Click or drag & drop veterinary Rx file</p>
                  <p className="text-[11px] text-slate-400 mt-1">Accepts PDF, JPG, PNG up to 10MB</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs">
                    <span>Selected: {fileName}</span>
                  </div>
                </div>
              </div>

              {/* Compliance note */}
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Our licensed compounding and retail pharmacy verifies all Rx scripts with state veterinary medical boards prior to dispatch.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-teal-500/25 transition-all"
              >
                Submit Script For Pharmacist Verification
              </button>
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Script Received & In Verification!</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Our on-duty veterinary pharmacist has received {fileName} for {selectedPet}. You will receive SMS verification once approved!
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
