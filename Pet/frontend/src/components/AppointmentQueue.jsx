import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Video,
  FileText,
  User,
  CheckCircle2,
  AlertCircle,
  Phone,
  ArrowRight,
  ChevronRight,
  Play,
  RotateCcw,
  Sparkles,
  MapPin,
  Calendar,
  Eye,
  Activity
} from 'lucide-react';

// Authentic Indian Pet Healthcare Appointments Dataset
const INITIAL_QUEUE_DATA = [
  {
    id: 'apt-101',
    petName: 'Sheru',
    petBreed: 'Indie / Desi Dog (3 yrs)',
    ownerName: 'Rahul Verma',
    phone: '+91 98765 43210',
    timeSlot: '10:30 AM',
    consultType: 'In-Clinic',
    clinicName: 'Jamshedpur Clinic • Exam Room 1',
    reason: 'Loss of appetite since 2 days, mild dry cough and lethargy.',
    status: 'in_consultation', // 'waiting_room' | 'in_consultation' | 'completed'
    priority: 'Normal',
    weight: '18.5 kg',
    tokenNumber: 'TK-01'
  },
  {
    id: 'apt-102',
    petName: 'Bruno',
    petBreed: 'Golden Retriever (4 yrs)',
    ownerName: 'Priya Nair',
    phone: '+91 98220 11984',
    timeSlot: '11:15 AM',
    consultType: 'Telehealth Video',
    clinicName: 'Online Video Consult',
    reason: 'Frequent ear scratching, head shaking and foul odor from right ear.',
    status: 'waiting_room',
    priority: 'Urgent',
    weight: '31.2 kg',
    tokenNumber: 'TK-02'
  },
  {
    id: 'apt-103',
    petName: 'Rani',
    petBreed: 'Indie Cat (1.5 yrs)',
    ownerName: 'Rajesh Patel',
    phone: '+91 94311 88721',
    timeSlot: '11:45 AM',
    consultType: 'In-Clinic',
    clinicName: 'Jamshedpur Clinic • Exam Room 2',
    reason: 'Post-spay surgery wound inspection, suture removal checkup.',
    status: 'waiting_room',
    priority: 'Normal',
    weight: '3.8 kg',
    tokenNumber: 'TK-03'
  },
  {
    id: 'apt-104',
    petName: 'Milo',
    petBreed: 'Beagle (2 yrs)',
    ownerName: 'Neha Deshmukh',
    phone: '+91 97654 32109',
    timeSlot: '12:15 PM',
    consultType: 'Telehealth Video',
    clinicName: 'Online Video Consult',
    reason: 'Switching to grain-free hypoallergenic kibble, vomiting yellow bile.',
    status: 'waiting_room',
    priority: 'Normal',
    weight: '12.0 kg',
    tokenNumber: 'TK-04'
  },
  {
    id: 'apt-105',
    petName: 'Kittu',
    petBreed: 'Persian Longhair Cat (2.5 yrs)',
    ownerName: 'Dr. Vikram Sen',
    phone: '+91 98300 45678',
    timeSlot: '09:30 AM',
    consultType: 'In-Clinic',
    clinicName: 'Jamshedpur Clinic • Exam Room 1',
    reason: 'Routine deworming, annual rabies vaccination booster administered.',
    status: 'completed',
    priority: 'Normal',
    weight: '4.1 kg',
    tokenNumber: 'TK-00',
    completedAt: '10:15 AM'
  },
  {
    id: 'apt-106',
    petName: 'Simba',
    petBreed: 'Labrador Retriever (6 yrs)',
    ownerName: 'Kavita Sundaram',
    phone: '+91 99401 23456',
    timeSlot: '09:00 AM',
    consultType: 'In-Clinic',
    clinicName: 'Jamshedpur Clinic • Exam Room 2',
    reason: 'Bilateral hip stiffness after morning walks, started joint supplement.',
    status: 'completed',
    priority: 'Normal',
    weight: '34.5 kg',
    tokenNumber: 'TK-99',
    completedAt: '09:40 AM'
  }
];

const COLUMNS = [
  {
    id: 'waiting_room',
    label: 'In Waiting Room',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    dotColor: 'bg-amber-500'
  },
  {
    id: 'in_consultation',
    label: 'In Consultation',
    badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/70 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    dotColor: 'bg-cyan-500 animate-pulse'
  },
  {
    id: 'completed',
    label: 'Completed',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    dotColor: 'bg-emerald-500'
  }
];

export default function AppointmentQueue({
  onWritePrescription,
  onStartVideoConsult
}) {
  const [appointments, setAppointments] = useState(INITIAL_QUEUE_DATA);
  const [activeMobileColumn, setActiveMobileColumn] = useState('in_consultation');
  const [hoveredCardId, setHoveredCardId] = useState(null);

  // Status transitions
  const moveStatus = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === appointmentId ? { ...item, status: newStatus } : item
      )
    );
  };

  const getAppointmentsForColumn = (columnId) => {
    return appointments.filter((apt) => apt.status === columnId);
  };

  return (
    <div className="space-y-4">
      {/* Mobile Column Switcher (Tab pills for < md screens) */}
      <div className="flex md:hidden items-center justify-between p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60">
        {COLUMNS.map((col) => {
          const count = getAppointmentsForColumn(col.id).length;
          const isActive = activeMobileColumn === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setActiveMobileColumn(col.id)}
              className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
                isActive
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              <span className="truncate">{col.label.replace('In ', '')}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-600 font-bold">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((column) => {
          const colItems = getAppointmentsForColumn(column.id);
          const isMobileVisible = activeMobileColumn === column.id;

          return (
            <div
              key={column.id}
              className={`space-y-3.5 ${
                isMobileVisible ? 'block' : 'hidden md:block'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-3 py-2 bg-slate-100/80 dark:bg-slate-800/50 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${column.dotColor}`} />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-200">
                    {column.label}
                  </h3>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold border ${column.badgeColor}`}
                >
                  {colItems.length}
                </span>
              </div>

              {/* Cards List with Framer Motion */}
              <div className="space-y-3 min-h-[140px]">
                <AnimatePresence>
                  {colItems.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 text-center text-slate-400"
                    >
                      <Activity className="w-6 h-6 mx-auto mb-1.5 opacity-30 text-slate-400" />
                      <p className="text-xs font-medium">No queue items</p>
                    </motion.div>
                  ) : (
                    colItems.map((apt) => (
                      <motion.div
                        key={apt.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.2 }}
                        onMouseEnter={() => setHoveredCardId(apt.id)}
                        onMouseLeave={() => setHoveredCardId(null)}
                        className={`group relative bg-white dark:bg-slate-850 border rounded-2xl p-4 transition-all shadow-xs hover:shadow-md ${
                          apt.priority === 'Urgent'
                            ? 'border-amber-300 dark:border-amber-800/80 bg-amber-50/20 dark:bg-amber-950/10'
                            : 'border-slate-200 dark:border-slate-800 hover:border-cyan-400 dark:hover:border-cyan-600'
                        }`}
                      >
                        {/* Top Card Row */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              {apt.tokenNumber}
                            </span>
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{apt.timeSlot}</span>
                            </div>
                          </div>

                          {apt.consultType === 'Telehealth Video' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 dark:bg-cyan-950/70 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800">
                              <Video className="w-3 h-3 text-cyan-500 animate-pulse" />
                              Video
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              In-Clinic
                            </span>
                          )}
                        </div>

                        {/* Pet & Owner Info */}
                        <div className="mb-2.5">
                          <div className="flex items-baseline gap-2">
                            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {apt.petName}
                            </h4>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({apt.petBreed})
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Parent: <strong className="text-slate-700 dark:text-slate-300">{apt.ownerName}</strong></span>
                            <span>•</span>
                            <span className="font-mono text-[11px]">{apt.phone}</span>
                          </div>
                        </div>

                        {/* Clinical Reason for visit */}
                        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-2.5 mb-3 border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                          <span className="font-semibold text-slate-500 text-[11px] block mb-0.5">
                            Reason for Visit:
                          </span>
                          {apt.reason}
                        </div>

                        {/* Interactive Action Controls */}
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {/* Write Prescription Button */}
                            <button
                              type="button"
                              onClick={() => onWritePrescription && onWritePrescription(apt)}
                              className="px-2.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold flex items-center gap-1 transition-all"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Prescribe</span>
                            </button>

                            {/* Telehealth Call Trigger */}
                            {apt.consultType === 'Telehealth Video' && (
                              <button
                                type="button"
                                onClick={() => onStartVideoConsult && onStartVideoConsult(apt)}
                                className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-all"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Consult</span>
                              </button>
                            )}
                          </div>

                          {/* Column State Transitions */}
                          <div className="flex items-center gap-1">
                            {column.id === 'waiting_room' && (
                              <button
                                type="button"
                                onClick={() => moveStatus(apt.id, 'in_consultation')}
                                className="px-2.5 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold flex items-center gap-1 transition-all"
                              >
                                <span>Start Visit</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {column.id === 'in_consultation' && (
                              <button
                                type="button"
                                onClick={() => moveStatus(apt.id, 'completed')}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Complete</span>
                              </button>
                            )}

                            {column.id === 'completed' && (
                              <button
                                type="button"
                                onClick={() => moveStatus(apt.id, 'in_consultation')}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                title="Re-open Consultation"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
