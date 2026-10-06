import React from 'react';
import { Link } from 'react-router-dom';
import {
  PhoneCall,
  ShieldCheck,
  Heart,
  Mail,
  MapPin,
  Clock,
  FileCheck,
  Globe,
  Share2
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-400 text-left font-sans">
      {/* 24/7 Jamshedpur Emergency Hotline Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center animate-pulse">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                24/7 Jamshedpur Emergency Vet & Critical Poison Control
              </p>
              <p className="text-xs text-slate-300">
                Direct hotline to Dr. Anjali Sharma & on-duty veterinary surgeons at Bistupur Central Clinic
              </p>
            </div>
          </div>
          <a
            href="tel:+916572421100"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105"
          >
            Call +91 657 242 1100
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white font-bold">
                🐾
              </div>
              <span className="text-lg font-black text-white font-['Outfit']">
                PawCare<span className="text-teal-400">India</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's premier digital companion healthcare platform. Bridging licensed veterinarians, certified temperature-controlled pharmaceutical cold-box delivery, and predictive AI triage across Jamshedpur.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-teal-400">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> VCI Certified Doctors</span>
              <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4" /> GSTIN: 20AABCP1330F1Z5</span>
            </div>
          </div>

          {/* Quick Veterinary Links */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Veterinary Care</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/consultation" className="hover:text-teal-300 transition-colors">Book Video Consult</Link></li>
              <li><Link to="/consultation" className="hover:text-teal-300 transition-colors">In-Clinic Checkup (Bistupur)</Link></li>
              <li><Link to="/symptom-triage" className="hover:text-teal-300 transition-colors">AI Symptom Triage</Link></li>
              <li><Link to="/vet-portal" className="hover:text-teal-300 transition-colors">Doctor Portal Login</Link></li>
            </ul>
          </div>

          {/* Pharmacy & Delivery */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Pharmacy & Store</h5>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/pharmacy" className="hover:text-teal-300 transition-colors">Medicine Catalog (INR ₹)</Link></li>
              <li><Link to="/upload-rx" className="hover:text-teal-300 transition-colors">Upload Prescription (PDF/JPG)</Link></li>
              <li><Link to="/pharmacy-admin" className="hover:text-teal-300 transition-colors">Pharmacy Admin Hub</Link></li>
              <li><Link to="/dashboard" className="hover:text-teal-300 transition-colors">Track Delivery Route</Link></li>
            </ul>
          </div>

          {/* Jamshedpur Local Centers */}
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Jamshedpur Centers</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Bistupur Hub: Main Road, Near Kamani Centre</span>
              </li>
              <li className="flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>Sakchi Clinic: Kalimati Road Junction</span>
              </li>
              <li className="flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                <span>OPD Hours: 8:00 AM – 9:30 PM Daily</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Socials & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 PawCare India Technologies Pvt. Ltd. Made with ❤️ for Indian Pets.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="hover:text-teal-400 transition-colors cursor-pointer" title="Global Network">
              <Globe className="w-4 h-4" />
            </span>
            <span className="hover:text-teal-400 transition-colors cursor-pointer" title="Share PawCare">
              <Share2 className="w-4 h-4" />
            </span>
            <span className="hover:text-teal-400 transition-colors cursor-pointer" title="Emergency Email">
              <Mail className="w-4 h-4" />
            </span>
            <span className="hover:text-teal-400 transition-colors cursor-pointer" title="Emergency Jamshedpur">
              <PhoneCall className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
