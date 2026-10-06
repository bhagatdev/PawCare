import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Pill, ShieldCheck, HeartPulse, Clock, Sparkles, Video, ArrowRight } from 'lucide-react';

export default function Hero({ onExploreVets, onExploreMeds }) {
  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 text-left space-y-6"
          >
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>All-In-One Integrated Pet Healthcare Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              Compassionate Care, <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
                Expert Vets & Fast Meds
              </span>
              <br />For Your Best Friend.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed">
              Book instant virtual checkups with board-certified veterinarians, order verified prescription pet medicines, and connect with a loving community sharing genuine recovery journeys.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExploreVets}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-sm shadow-lg shadow-teal-500/25 flex items-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Stethoscope className="w-4 h-4" />
                Book Vet Consultation
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreMeds}
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2.5 transition-all hover:border-slate-600 hover:text-white"
              >
                <Pill className="w-4 h-4 text-amber-400" />
                Order Medicines & Rx
              </button>
            </div>

            {/* Key trust badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">100% Verified</div>
                  <div className="text-[11px] text-slate-400">Licensed Doctors</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">Same-Day</div>
                  <div className="text-[11px] text-slate-400">Medicine Delivery</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white">25k+ Pets</div>
                  <div className="text-[11px] text-slate-400">Healed & Happy</div>
                </div>
              </div>
            </div>

          </motion.div>

          {/* Right Interactive Visual Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            {/* Main Pet & Vet Card */}
            <div className="relative rounded-3xl p-3 bg-gradient-to-b from-teal-500/20 to-slate-800/40 border border-teal-500/30 shadow-2xl backdrop-blur-xl">
              <div className="overflow-hidden rounded-2xl relative group">
                <img
                  src="https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80&w=800"
                  alt="Veterinarian examining dog"
                  className="w-full h-80 sm:h-96 object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1118] via-transparent to-transparent"></div>
                
                {/* Floating badge top right */}
                <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-teal-500/40 flex items-center gap-2 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-medium text-emerald-300">14 Vets Online Now</span>
                </div>

                {/* Bottom Card Inside Image */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-slate-700/80 text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-teal-400 font-semibold uppercase tracking-wider">Next Available Tele-Consult</p>
                      <h4 className="text-sm font-bold text-white">Dr. Sarah Jenkins • Canine Surgery</h4>
                    </div>
                    <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      $65.00
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300">
                    <Video className="w-3.5 h-3.5 text-teal-400" />
                    <span>HD Video Consultation • Prescription Included</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Card: Fast Rx Dispense */}
            <motion.div 
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 bg-slate-900/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">Prescription Verified</p>
                <p className="text-[11px] text-teal-400">Ready for instant dispatch</p>
              </div>
            </motion.div>

            {/* Floating Card: Recovery story */}
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -right-4 bg-slate-900/95 backdrop-blur-xl p-3.5 rounded-2xl border border-slate-700/80 shadow-xl flex items-center gap-3 text-left"
            >
              <img 
                src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=100" 
                alt="Barnaby recovered" 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
              />
              <div>
                <p className="text-xs font-bold text-white">Barnaby recovered 🎉</p>
                <p className="text-[11px] text-emerald-400">8 weeks post-surgery!</p>
              </div>
            </motion.div>

          </motion.div>

        </div>
      </div>
    </section>
  );
}
