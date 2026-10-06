import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  Stethoscope,
  AlertTriangle,
  Calendar,
  RefreshCw,
  User,
  Heart,
  ShieldCheck,
  Bot,
  AlertCircle,
  Clock,
  ArrowRight,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import api from '../api';

const QUICK_PROMPTS = [
  'Vomiting yellow bile & lethargy since morning',
  'Severe ear scratching & foul odor in right ear',
  'Limping on hind leg after park walk in Kadma',
  'Refusing food and low water intake for 24h',
  'Tick found on neck, continuous scratching',
];

export default function AISymptomChecker({ onBookAppointment, initialPetName = 'Sheru', initialSpecies = 'Dog' }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: `Namaste! I am your AI/ML Veterinary Symptom Checker. 🐾\n\nPlease describe the symptoms ${initialPetName} is experiencing. I will analyze clinical risk patterns, flag critical red-flag warnings, and connect you with on-duty veterinarians in Jamshedpur.`,
      time: 'Just now',
      triageData: null,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [species, setSpecies] = useState(initialSpecies);
  const [petName, setPetName] = useState(initialPetName);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAnalyzing]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isAnalyzing) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputText('');
    setIsAnalyzing(true);

    try {
      // Call backend AI triage endpoint
      const response = await api.post('ai-triage/', {
        message: textToSend,
        pet_species: species,
        pet_name: petName,
      });

      const triage = response.data;
      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Based on your description for ${petName}, our veterinary clinical triage system generated this initial assessment:`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triageData: triage,
      };

      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      console.warn('Backend triage offline, applying local fallback heuristics:', err);
      const isEmergency = /blood|cannot breathe|choking|pale gum|seizure|collapse|poison/i.test(textToSend);
      const isUrgent = /vomit|diarrhea|loose motion|not eating|bile/i.test(textToSend);

      const fallbackTriage = {
        pet_name: petName,
        pet_species: species,
        triage_level: isEmergency
          ? 'CRITICAL / EMERGENCY'
          : isUrgent
          ? 'URGENT / VET VISIT RECOMMENDED'
          : 'MODERATE / MONITOR & EXAMINE',
        urgency_score: isEmergency ? 95 : isUrgent ? 65 : 40,
        possible_conditions: isEmergency
          ? ['Acute Systemic Distress', 'Respiratory Obstruction', 'Potential Toxicity']
          : isUrgent
          ? ['Canine Gastroenteritis', 'Dietary Indiscretion', 'Dehydration Risk']
          : ['Allergic Dermatitis', 'Localized Strain or Infection'],
        red_flags: isEmergency
          ? ['Critical emergency: transport to Bistupur Vet Emergency Clinic immediately!']
          : ['Vital signs and fluid intake require close 4-hour monitoring.'],
        recommended_action: 'Connect with Dr. Anjali Sharma for emergency video evaluation.',
        cta_button: {
          text: 'Book Vet Now with Dr. Anjali Sharma (Bistupur Hub)',
          action: 'open_telehealth_booking',
          clinic_contact: '+91 657 242 1100',
        },
        disclaimer:
          '⚠️ MANDATORY MEDICAL DISCLAIMER: This AI/ML veterinary triage advice provides preliminary informational triage only and does not constitute a formal diagnosis or prescription under the Veterinary Council of India (VCI) regulations. Always consult a licensed veterinary surgeon immediately for physical evaluation.',
      };

      const aiReply = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Clinical assessment for ${petName} (${species}):`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        triageData: fallbackTriage,
      };

      setMessages((prev) => [...prev, aiReply]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getUrgencyBadgeColor = (level) => {
    if (!level) return 'bg-slate-100 text-slate-800 border-slate-300';
    if (level.includes('CRITICAL') || level.includes('EMERGENCY')) {
      return 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse';
    }
    if (level.includes('URGENT')) {
      return 'bg-amber-50 text-amber-900 border-amber-300';
    }
    return 'bg-teal-50 text-teal-800 border-teal-300';
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col h-[750px] max-h-[85vh] text-left font-sans">
      
      {/* Header Banner */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-teal-900 via-teal-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-black text-sm sm:text-base tracking-tight font-['Outfit']">
                PawCare AI Symptom Checker & Triage
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-teal-200/80 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span>VCI Clinical Heuristics • Bistupur Hub Dispatch</span>
            </p>
          </div>
        </div>

        {/* Companion Selector Pills */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white/10 p-1 rounded-2xl border border-white/15">
          <input
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            className="w-24 px-2.5 py-1 text-xs bg-transparent text-white placeholder-slate-400 font-bold focus:outline-none"
            placeholder="Pet Name"
            title="Pet Name"
          />
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="bg-teal-950 text-white text-xs font-bold rounded-xl px-2 py-1 border border-white/20 focus:outline-none"
          >
            <option value="Dog">Dog</option>
            <option value="Cat">Cat</option>
            <option value="Bird">Bird</option>
          </select>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[78%] rounded-3xl p-4 sm:p-5 shadow-xs transition-all ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-tr-xs'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-black/5 text-[10px] opacity-75">
                <span className="font-bold uppercase tracking-wider">
                  {msg.sender === 'user' ? 'You (Pet Parent)' : 'AI Clinical Assistant'}
                </span>
                <span>{msg.time}</span>
              </div>

              <p className="text-xs sm:text-sm whitespace-pre-line leading-relaxed font-medium">
                {msg.text}
              </p>

              {/* Triage Report Visual Card */}
              {msg.triageData && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 pt-3 border-t border-slate-200 space-y-3 text-left"
                >
                  {/* Triage Level Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Assessed Urgency Level:
                    </span>
                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full border ${getUrgencyBadgeColor(
                        msg.triageData.triage_level
                      )}`}
                    >
                      {msg.triageData.triage_level}
                    </span>
                  </div>

                  {/* Red Flags Alert */}
                  {msg.triageData.red_flags && msg.triageData.red_flags.length > 0 && (
                    <div className="p-3 bg-rose-50 border border-rose-200/80 rounded-2xl text-xs text-rose-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-rose-800">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Clinical Red Flags Detected:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-800 font-medium">
                        {msg.triageData.red_flags.map((flag, idx) => (
                          <li key={idx}>{flag}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suspected Conditions */}
                  {msg.triageData.possible_conditions && (
                    <div className="space-y-1 text-xs">
                      <span className="font-bold text-slate-700 block">Suspected Conditions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.triageData.possible_conditions.map((cond, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 bg-slate-100 text-slate-800 rounded-lg text-[11px] font-medium border border-slate-200"
                          >
                            {cond}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mandatory Book Vet Now CTA */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => onBookAppointment && onBookAppointment()}
                      className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-700 to-emerald-600 hover:from-teal-600 hover:to-emerald-500 text-white font-extrabold text-xs shadow-md shadow-teal-700/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>{msg.triageData.cta_button?.text || 'Book Vet Now with Dr. Anjali Sharma'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Mandatory Legal & Medical Disclaimer */}
                  <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-tight">
                    {msg.triageData.disclaimer}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        ))}

        {isAnalyzing && (
          <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium p-3 bg-white rounded-2xl border border-slate-200 w-fit">
            <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            <span>Analyzing symptoms with veterinary triage heuristics...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div className="px-4 py-2 bg-white border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
        <span className="text-slate-400 font-bold shrink-0">Quick Symptoms:</span>
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 font-medium whitespace-nowrap transition-colors shrink-0 border border-slate-200"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 sm:p-4 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Describe ${petName}'s symptoms (e.g. lethargic, continuous coughing, ear itching)...`}
          className="flex-1 min-h-[44px] px-4 rounded-2xl border border-slate-300 text-xs text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:border-teal-600 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isAnalyzing}
          className="min-h-[44px] px-5 rounded-2xl bg-teal-700 hover:bg-teal-600 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

    </div>
  );
}
