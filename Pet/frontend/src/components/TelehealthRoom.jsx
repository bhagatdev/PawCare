import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  Heart,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Share2,
  MessageSquare,
  Activity,
  Send,
  User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function TelehealthRoom({
  appointmentId = 'APT-JSR-101',
  petName = 'Sheru',
  species = 'Dog',
  breed = 'Indie / Desi',
  doctorName = 'Dr. Anjali Sharma (B.V.Sc & A.H)',
  onEndCall,
}) {
  const navigate = useNavigate();
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(142); // seconds
  const [clinicalNotes, setClinicalNotes] = useState(
    'Prescribed Melonex Oral Suspension (1.5mg/ml) @ 0.5ml OD post-food for 3 days. Liv.52 Pet drops 1ml BD.'
  );
  const [rxDispatched, setRxDispatched] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDispatchPrescription = () => {
    setRxDispatched(true);
    setTimeout(() => setRxDispatched(false), 3000);
  };

  return (
    <div className="w-full bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col lg:flex-row h-[750px] max-h-[90vh] text-left font-sans">
      
      {/* ========================================================================= */}
      {/* LEFT: MAIN VIDEO CONSULTATION THEATER (8 cols on desktop)                 */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col justify-between bg-slate-900 relative overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 z-20 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-tight font-['Outfit'] text-white">
                  {doctorName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                  Live WebRTC HD
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Encrypted Session • Token: <span className="font-mono text-teal-300 font-bold">{appointmentId}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-xs font-mono font-bold text-white flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              <span>{formatDuration(callDuration)}</span>
            </div>
          </div>
        </div>

        {/* Video Viewport: Doctor's Stream */}
        <div className="relative w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
          {isVideoOn ? (
            <img
              src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200"
              alt="Dr. Anjali Sharma Video Feed"
              className="w-full h-full object-cover opacity-90"
            />
          ) : (
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto text-2xl font-bold">
                🩺
              </div>
              <p className="text-xs text-slate-400">Doctor's camera temporarily paused</p>
            </div>
          )}

          {/* Picture-in-Picture: Patient's camera view */}
          <div className="absolute bottom-20 right-4 w-36 h-28 sm:w-44 sm:h-32 rounded-2xl overflow-hidden border-2 border-teal-500 shadow-2xl bg-slate-900 z-10">
            <img
              src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400"
              alt="Patient Sheru Feed"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1.5 left-2 bg-black/60 px-2 py-0.5 rounded-md text-[10px] font-bold text-white">
              {petName} (You)
            </div>
          </div>
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-0 inset-x-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isMicOn ? 'bg-slate-800/80 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-lg'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => setIsVideoOn(!isVideoOn)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
              isVideoOn ? 'bg-slate-800/80 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white shadow-lg'
            }`}
            title={isVideoOn ? 'Turn Video Off' : 'Turn Video On'}
          >
            {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (onEndCall) onEndCall();
              else navigate('/dashboard');
            }}
            className="px-6 h-12 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <PhoneOff className="w-4 h-4" />
            <span>End Consultation</span>
          </button>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* RIGHT: PINNED PATIENT CLINICAL HISTORY & DISPENSARY PAD (4 cols)           */}
      {/* ========================================================================= */}
      <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto space-y-4">
        
        <div className="space-y-4">
          {/* Header */}
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-400" />
              <span>Pinned Patient History</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300">
              Jamshedpur OPD
            </span>
          </div>

          {/* Pet Details Card */}
          <div className="p-3.5 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">{petName}</h4>
                <p className="text-[11px] text-teal-400">{breed} • {species}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Active Patient
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/50">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Age & Weight</span>
                <span className="font-bold text-white">3 Yrs • 18.5 kg</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Next Vaccine</span>
                <span className="font-bold text-amber-400">Rabies (14d)</span>
              </div>
            </div>
          </div>

          {/* Clinical Vitals */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Reported Vitals & Symptoms</span>
            </span>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[9px] text-slate-400 block">Pulse</span>
                <span className="font-bold text-emerald-400">108 bpm</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[9px] text-slate-400 block">Temp</span>
                <span className="font-bold text-teal-300">101.4 °F</span>
              </div>
              <div className="p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                <span className="text-[9px] text-slate-400 block">Hydration</span>
                <span className="font-bold text-amber-400">Mild Deficit</span>
              </div>
            </div>
          </div>

          {/* Live Prescription Drafting Pad */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Doctor's Live Prescription Notes</span>
            </span>
            <textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-teal-500 font-mono leading-relaxed"
            />
          </div>
        </div>

        {/* Pharmacy Dispatch Action */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <AnimatePresence>
            {rxDispatched && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Dispatched to Bistupur Dispensary Cold-Box!</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={handleDispatchPrescription}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Approve & Dispatch Rx to Cold-Box</span>
          </button>
        </div>

      </div>

    </div>
  );
}
