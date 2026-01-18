
import React from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { Bookmark, Clock, MapPin, X } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const Saved: React.FC = () => {
  const { events, savedEventIds, toggleSaveEvent, theme } = useApp();
  const savedEvents = events.filter(e => savedEventIds.includes(e.id));

  const isLight = theme.background === '#FFFFFF';

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">The Vault</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Saved Curations</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: theme.surfaceAlt }}>
          <Bookmark size={20} fill={theme.accent} color={theme.accent} />
        </div>
      </div>

      {savedEvents.length === 0 ? (
        <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
          <Bookmark size={48} strokeWidth={1} />
          <p className="text-xs font-black uppercase tracking-widest">Your vault is empty.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.accent }} />
            Tonight
          </h3>
          
          <div className="space-y-4">
            {savedEvents.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <Link to={`/event/${event.id}`}>
                  <div className="flex gap-4 p-3 rounded-3xl border transition-all active:scale-[0.98]" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={event.mediaUrls[0]} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-2 truncate">
                        {event.title}
                      </h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-bold uppercase tracking-widest">
                          <Clock size={12} />
                          {format(new Date(event.startAt), 'HH:mm')}
                        </div>
                        <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-bold uppercase tracking-widest">
                          <MapPin size={12} />
                          {event.venueName}
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        {event.tier === 'official' && <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>Official</div>}
                      </div>
                    </div>
                  </div>
                </Link>
                
                <button 
                  onClick={(e) => { e.preventDefault(); toggleSaveEvent(event.id); }}
                  className="absolute top-2 right-2 p-2 rounded-full opacity-40 hover:opacity-100 transition-opacity"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
