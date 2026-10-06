import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Stethoscope,
  Calendar,
  Clock,
  Video,
  FileText,
  User,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Activity,
  Users,
  Pill,
  TrendingUp,
  MapPin,
  Phone,
  Power,
  Search,
  Bell,
  Sparkles,
  LogOut,
  Sliders,
  DollarSign
} from 'lucide-react';
import AppointmentQueue from './AppointmentQueue';
import PrescriptionModal from './PrescriptionModal';

export default function VetDashboard({
  userRole = 'VETERINARIAN',
  onSwitchRole,
  onLogout
}) {
  // Collapsible Sidebar State (Desktop)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Navigation Tabs: 'queue' | 'telehealth' | 'prescriptions' | 'analytics'
  const [activeTab, setActiveTab] = useState('queue');

  // Doctor Online / Offline Telehealth Toggle
  const [isOnlineTelehealth, setIsOnlineTelehealth] = useState(true);

  // Active Selected Patient for Prescription Modal
  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

  // Active Video Call Notification Mock
  const [activeVideoCall, setActiveVideoCall] = useState(null);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenPrescribe = (patient = null) => {
    setSelectedPatientForRx(
      patient || {
        petName: 'Sheru',
        petBreed: 'Indie / Desi Dog (3 yrs)',
        ownerName: 'Rahul Verma',
        reason: 'Loss of appetite since 2 days, mild dry cough'
      }
    );
    setIsPrescriptionModalOpen(true);
  };

  const handlePrescriptionSuccess = (payload) => {
    showToast(`Prescription for ${payload.pet_name} sent to Jamshedpur Pharmacy & WhatsApp!`);
  };

  const handleStartVideoConsult = (appointment) => {
    setActiveVideoCall(appointment);
    showToast(`Connecting encrypted Telehealth room for ${appointment.petName} (${appointment.ownerName})...`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row font-sans selection:bg-cyan-500/20">
      
      {/* ========================================================================= */}
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR */}
      {/* ========================================================================= */}
      <motion.aside
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 sticky top-0 h-screen z-30 select-none shadow-xs"
      >
        {/* Brand / Clinic Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-cyan-600/20 shrink-0">
              <Stethoscope className="w-5 h-5" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm tracking-tight text-slate-900 dark:text-white">
                    Practo<span className="text-cyan-600 dark:text-cyan-400">Vet</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300">
                    Pro
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">Jamshedpur Center</p>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Doctor Summary Card */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className={`flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-850/60 ${isSidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 border-2 border-cyan-500">
                AS
              </div>
              <span
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                  isOnlineTelehealth ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    Dr. Anjali Sharma
                  </p>
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  B.V.Sc & A.H. • VCI Reg.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {[
            { id: 'queue', label: 'Today\'s Queue', icon: Clock, count: 6 },
            { id: 'prescriptions', label: 'e-Prescription Pad', icon: FileText, count: null },
            { id: 'telehealth', label: 'Telehealth Room', icon: Video, count: 'Live' },
            { id: 'patients', label: 'Patient Roster', icon: Users, count: null },
            { id: 'analytics', label: 'Clinic Revenue', icon: TrendingUp, count: null },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'prescriptions') {
                    handleOpenPrescribe();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 font-bold border border-cyan-200 dark:border-cyan-800/80 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                {!isSidebarCollapsed && (
                  <span className="flex-1 text-left truncate">{item.label}</span>
                )}
                {!isSidebarCollapsed && item.count && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      item.count === 'Live'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Controls */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {!isSidebarCollapsed && (
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 text-[11px] text-slate-500 flex items-center justify-between border border-slate-200/80 dark:border-slate-800">
              <span className="font-medium">Telehealth Mode</span>
              <button
                onClick={() => setIsOnlineTelehealth(!isOnlineTelehealth)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all ${
                  isOnlineTelehealth
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {isOnlineTelehealth ? 'ONLINE' : 'OFFLINE'}
              </button>
            </div>
          )}

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors ${
              isSidebarCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Log Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* ========================================================================= */}
      {/* 2. MAIN APPLICATION CONTENT AREA */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-6">
        
        {/* Top Clinical Header */}
        <header className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Left info: Doctor identity & location */}
          <div className="flex items-center gap-3">
            <div className="md:hidden w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm">
              AS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  Dr. Anjali Sharma, B.V.Sc & A.H.
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                  <ShieldCheck className="w-3 h-3 text-cyan-500" />
                  VCI Reg: JH-VET-2018-0492
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Jamshedpur Clinic (East Singhbhum, Jharkhand)</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Wednesday, 30 Sep 2026
                </span>
              </p>
            </div>
          </div>

          {/* Right quick actions: Telehealth toggle & Quick Prescribe */}
          <div className="flex items-center gap-2.5 ml-auto">
            {/* Online / Offline Status Toggle */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnlineTelehealth ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              <span className="font-semibold text-slate-700 dark:text-slate-300 hidden sm:inline">
                {isOnlineTelehealth ? 'Online for Telehealth' : 'Offline'}
              </span>
              <button
                onClick={() => setIsOnlineTelehealth(!isOnlineTelehealth)}
                className={`ml-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                  isOnlineTelehealth
                    ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {isOnlineTelehealth ? 'Active' : 'Go Online'}
              </button>
            </div>

            {/* Quick Prescribe CTA Button */}
            <button
              onClick={() => handleOpenPrescribe()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-98 min-h-[40px]"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Write Prescription</span>
            </button>
          </div>
        </header>

        {/* High-Level Clinical Stats Dashboard */}
        <section className="px-4 sm:px-6 pt-5 pb-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Stat 1: Appointments Today */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Appointments Today</span>
                <Calendar className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  12
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  +3 vs yesterday
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                8 In-Clinic • 4 Telehealth Video
              </p>
            </div>

            {/* Stat 2: Pending Consultations */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Pending Consultations</span>
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                  4
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300">
                  1 Urgent
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Avg. waiting time: 14 mins
              </p>
            </div>

            {/* Stat 3: Completed Visits & Revenue */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Completed Visits</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  8
                </span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  ₹7,200 earned
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                ₹600 avg. consultation fee
              </p>
            </div>

            {/* Stat 4: Prescriptions Issued */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
                <span>Prescriptions Issued</span>
                <Pill className="w-4 h-4 text-teal-500" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-teal-600 dark:text-teal-400">
                  15
                </span>
                <span className="text-xs font-medium text-slate-500">
                  100% Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Direct Indian Pharmacy Dispatch
              </p>
            </div>
          </div>
        </section>

        {/* Live Active Telehealth Consultation Room Banner if started */}
        {activeVideoCall && (
          <div className="px-4 sm:px-6 mb-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-cyan-600 to-teal-700 text-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-lg shadow-cyan-600/20"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center animate-pulse">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    Telehealth Live Consult: {activeVideoCall.petName} ({activeVideoCall.ownerName})
                  </h4>
                  <p className="text-xs text-white/80">
                    Encrypted WebRTC Channel • 1080p Clinical Audio/Video Feed Active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenPrescribe(activeVideoCall)}
                  className="px-3 py-1.5 rounded-lg bg-white text-cyan-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-xs"
                >
                  Prescribe Now
                </button>
                <button
                  onClick={() => setActiveVideoCall(null)}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors"
                >
                  End Call
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Main Content Body */}
        <main className="px-4 sm:px-6 flex-1">
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Live Clinical Queue & Patient Triage
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real-time status updates across Waiting Room, Consultation, and Completed visits.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Auto-sync with Jamshedpur Reception Desk</span>
                </div>
              </div>

              {/* Kanban Queue Component */}
              <AppointmentQueue
                onWritePrescription={(petData) => handleOpenPrescribe(petData)}
                onStartVideoConsult={(apt) => handleStartVideoConsult(apt)}
              />
            </div>
          )}

          {activeTab === 'telehealth' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4 my-4">
              <div className="w-16 h-16 rounded-3xl bg-cyan-100 dark:bg-cyan-950/80 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mx-auto shadow-md">
                <Video className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Telehealth Consultation Suite
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Connect securely with pet parents across India for video diagnosis, wound reviews, and nutritional consultations.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Compliant with Indian Tele-veterinary Practice Guidelines</span>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 my-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Clinic Financials & Consultation Analytics
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs text-slate-500">Total Consultations (This Month)</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">248</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs text-slate-500">Gross Clinic Revenue (INR)</p>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">₹1,48,800</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <p className="text-xs text-slate-500">Pharmacy Fulfillment Rate</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">94.2%</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE BOTTOM NAVIGATION (Touch-friendly min-h-[44px]) */}
      {/* ========================================================================= */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-1 flex items-center justify-around shadow-lg">
        {[
          { id: 'queue', label: 'Queue', icon: Clock },
          { id: 'prescribe_cta', label: 'Prescribe', icon: FileText, isAction: true },
          { id: 'telehealth', label: 'Video', icon: Video },
          { id: 'analytics', label: 'Revenue', icon: TrendingUp },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isAction) {
            return (
              <button
                key={item.id}
                onClick={() => handleOpenPrescribe()}
                className="flex flex-col items-center justify-center p-1 text-cyan-600 dark:text-cyan-400 font-bold min-h-[48px] min-w-[56px]"
              >
                <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center shadow-md">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] mt-0.5">e-Rx</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center p-1 min-h-[48px] min-w-[56px] transition-colors ${
                isActive
                  ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 4. PRESCRIPTION MODAL (SLIDING SHEET) */}
      {/* ========================================================================= */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        patientData={selectedPatientForRx}
        onSuccess={handlePrescriptionSuccess}
      />

      {/* ========================================================================= */}
      {/* 5. FLOATING TOAST NOTIFICATION */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 bg-slate-900 text-white border border-slate-700/80 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs max-w-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="leading-snug">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
