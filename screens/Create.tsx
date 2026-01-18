
import React, { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NeonButton, Input } from '../components/UI';
import { Camera, MapPin, Calendar, Clock, ChevronRight, Check } from 'lucide-react';

export const CreateEvent: React.FC = () => {
  const { theme } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isPublished, setIsPublished] = useState(false);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePublish = () => setIsPublished(true);

  if (isPublished) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-10 text-center">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
          style={{ backgroundColor: theme.accent, boxShadow: `${theme.glowIntensity} ${theme.accent}` }}
        >
          <Check size={48} color="#000" />
        </motion.div>
        <h2 className="text-4xl font-black italic tracking-tighter uppercase mb-4">You're Live.</h2>
        <p className="opacity-60 mb-8 font-medium">Your event has been broadcasted to the city. Get ready for the rush.</p>
        <NeonButton onClick={() => navigate('/')}>Go to Feed</NeonButton>
      </div>
    );
  }

  return (
    <div className="px-6 py-10">
      <div className="mb-10">
        <div className="flex gap-2 mb-4">
          {[1,2,3].map(i => (
            <div key={i} className="flex-1 h-1 rounded-full overflow-hidden" style={{ backgroundColor: theme.surfaceAlt }}>
              <motion.div 
                className="h-full" 
                animate={{ width: step >= i ? '100%' : '0%' }}
                style={{ backgroundColor: theme.accent }} 
              />
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">New Pulse</h2>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="aspect-square rounded-[3rem] border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer active:scale-95 transition-all" style={{ borderColor: theme.border, backgroundColor: theme.surface }}>
              <Camera size={40} className="opacity-30" />
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-40">Add Hero Media</span>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Event Title</label>
              <Input placeholder="E.g. NEON GARDEN" className="brand-font uppercase !text-xl italic" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Category</label>
              <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                {['Music', 'Nightlife', 'Art', 'Tech', 'Food'].map(c => (
                  <button key={c} className="px-5 py-2 rounded-full border text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{ borderColor: theme.border }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <NeonButton onClick={handleNext} className="w-full">Continue <ChevronRight size={18} /></NeonButton>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
             <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Short Hook</label>
              <Input placeholder="One sentence to kill it." />
            </div>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Date</label>
                <div className="relative">
                  <Input placeholder="Select Date" readOnly />
                  <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
              </div>
               <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Time</label>
                <div className="relative">
                  <Input placeholder="22:00" />
                  <Clock size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest opacity-40">Venue Name</label>
              <div className="relative">
                <Input placeholder="Where is the noise?" />
                <MapPin size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30" />
              </div>
            </div>
            <NeonButton onClick={handleNext} className="w-full">Final Check <ChevronRight size={18} /></NeonButton>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <div className="p-6 rounded-3xl" style={{ backgroundColor: theme.surface }}>
              <span className="text-[10px] font-black uppercase opacity-40 block mb-4">Event Tier</span>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border-2" style={{ borderColor: theme.accent }}>
                  <div>
                    <span className="font-bold text-sm block">Community</span>
                    <span className="text-[10px] opacity-50 uppercase tracking-widest">Free to broadcast</span>
                  </div>
                  <Check size={20} color={theme.accent} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-dashed opacity-50" style={{ borderColor: theme.border }}>
                  <div>
                    <span className="font-bold text-sm block">Official (Pro)</span>
                    <span className="text-[10px] opacity-50 uppercase tracking-widest">Requires verified status</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-center opacity-40 uppercase font-black tracking-widest">
              By publishing, you agree to the Inner City community guidelines.
            </p>
            <NeonButton onClick={handlePublish} className="w-full">Broadcast Now</NeonButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
