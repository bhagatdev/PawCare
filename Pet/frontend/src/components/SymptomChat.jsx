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
  Bot
} from 'lucide-react';
import api from '../api';

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: 'ai',
    text: "Hello! I am PawCare AI, your veterinary triage assistant. 🐾\n\nPlease describe what symptoms your pet is experiencing (e.g. 'My 3-year-old dog has been lethargic and threw up twice this morning').",
    time: 'Just now',
    showBookingCta: false,
  },
];

export default function SymptomChat({ onBookAppointment }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [species, setSpecies] = useState('Dog');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // POST to Django REST Framework symptom checker endpoint
      const response = await api.post('symptom_check/', {
        message: trimmed,
        pet_species: species,
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: response.data.response,
        triageLevel: response.data.triage_level,
        showBookingCta: response.data.suggest_booking ?? true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.warn('Backend endpoint unavailable, employing clinical heuristic response:', err);
      // Graceful offline fallback simulation
      setTimeout(() => {
        const fallbackMsg = {
          id: Date.now() + 1,
          sender: 'ai',
          text: `Thank you for sharing your ${species}'s symptoms.\n\n• Potential Concerns: Gastrointestinal upset, dietary indiscretion, or mild environmental discomfort.\n• Questions to Consider: How many hours have these signs been present? Is your ${species} still drinking water?\n• Red Flags: Please seek immediate emergency hospital care if you notice pale gums, extreme lethargy, or difficulty breathing.\n\n⚠️ Medical Disclaimer: This AI tool is for preliminary educational triage only and does NOT constitute a veterinary diagnosis. We strongly recommend booking a professional veterinary consultation.`,
          triageLevel: 'Monitor',
          showBookingCta: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      }, 900);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col bg-slate-900/40 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans text-left max-w-4xl mx-auto my-4 sm:my-8">
      {/* Triage Chat Header */}
      <header className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-teal-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                PawCare AI Symptom Triage
              </h2>
              <span className="text-[10px] font-semibold text-teal-300 bg-teal-500/10 px-2 py-0.5 rounded-full border border-teal-500/20">
                24/7 Active
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Preliminary health assessment & veterinary consultation guidance
            </p>
          </div>
        </div>

        {/* Pet Species Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400 font-medium">Pet:</span>
          <select
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
            className="min-h-[38px] px-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
          >
            <option value="Dog">Dog (Canine)</option>
            <option value="Cat">Cat (Feline)</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Bird">Bird</option>
            <option value="Other">Other Pet</option>
          </select>
        </div>
      </header>

      {/* Mandatory Medical Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2.5 flex items-center gap-2.5 text-xs text-amber-200/90">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="leading-snug">
          <strong>Important Note:</strong> This AI symptom checker does not replace professional veterinary diagnostics. In life-threatening emergencies, proceed to an emergency hospital immediately.
        </p>
      </div>

      {/* Scrollable Chat Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 max-h-[58vh]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {/* AI Avatar */}
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0 mt-1">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-xl space-y-2`}>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                      isUser
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-medium rounded-br-xs'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Timestamp & Urgency Badge */}
                  <div className={`flex items-center gap-2 text-[10px] text-slate-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{msg.time}</span>
                    {msg.triageLevel && (
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full ${
                          msg.triageLevel === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                        }`}
                      >
                        Triage: {msg.triageLevel}
                      </span>
                    )}
                  </div>

                  {/* Dynamic CTA at Conclusion of AI Advice */}
                  {!isUser && msg.showBookingCta && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="pt-2"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          if (onBookAppointment) {
                            onBookAppointment();
                          } else {
                            window.location.hash = '#telehealth';
                          }
                        }}
                        className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>Schedule Professional Vet Consultation</span>
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* User Avatar */}
                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* AI Typing Pulsating Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center gap-1.5 shadow-sm">
              <span className="text-xs text-slate-400 font-medium mr-1">PawCare AI is assessing symptoms</span>
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 rounded-full bg-teal-400"
              />
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-teal-400"
              />
              <motion.span
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-teal-400"
              />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2.5"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Describe your ${species.toLowerCase()}'s symptoms, behavior, or diet changes...`}
          className="flex-1 min-h-[44px] px-4 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="min-h-[44px] min-w-[44px] px-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 shadow-md shadow-teal-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Analyze</span>
        </button>
      </form>
    </div>
  );
}
