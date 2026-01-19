
import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { Bookmark, Clock, MapPin, X, Heart } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { getUserInterestedEvents } from '../services/social';
import { Event } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimization';

const EventCard: React.FC<{ event: Event; onRemove?: () => void; theme: any }> = ({ event, onRemove, theme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative group"
    >
      <Link to={`/event/${event.id}`}>
        <div className="flex gap-4 p-3 rounded-3xl border transition-all active:scale-[0.98]" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
            <img 
              src={event.mediaUrls && event.mediaUrls[0] ? getOptimizedImageUrl(event.mediaUrls[0], 'thumbnail') : 'https://picsum.photos/200/200'} 
              className="w-full h-full object-cover" 
              alt={event.title}
            />
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
      
      {onRemove && (
        <button 
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          className="absolute top-2 right-2 p-2 rounded-full opacity-40 hover:opacity-100 transition-opacity"
          style={{ backgroundColor: theme.surfaceAlt }}
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

export const Saved: React.FC = () => {
  const { events, savedEventIds, toggleSaveEvent, theme, user } = useApp();
  const [activeTab, setActiveTab] = useState<'interested' | 'saved'>('interested');
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([]);
  const [isLoadingInterested, setIsLoadingInterested] = useState(false);

  const savedEvents = events.filter(e => savedEventIds.includes(e.id));

  useEffect(() => {
    if (user && activeTab === 'interested') {
      loadInterestedEvents();
    }
  }, [user, activeTab]);

  const loadInterestedEvents = async () => {
    if (!user) return;
    setIsLoadingInterested(true);
    try {
      const interestedEventIds = await getUserInterestedEvents(user.id);
      const interested = events.filter(e => interestedEventIds.includes(e.id));
      setInterestedEvents(interested);
    } catch (error) {
      console.error('Error loading interested events:', error);
      setInterestedEvents([]);
    } finally {
      setIsLoadingInterested(false);
    }
  };

  const isLight = theme.background === '#FFFFFF';

  return (
    <div className="px-6 py-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Collections</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Your Event Curations</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: theme.surfaceAlt }}>
          <Bookmark size={20} fill={theme.accent} color={theme.accent} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mb-8 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('interested')}
          className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'interested' ? '' : 'opacity-40'}`}
          style={{ color: theme.text }}
        >
          Interested
          {activeTab === 'interested' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${activeTab === 'saved' ? '' : 'opacity-40'}`}
          style={{ color: theme.text }}
        >
          Saved
          {activeTab === 'saved' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === 'interested' ? (
        isLoadingInterested ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
            <Heart size={48} strokeWidth={1} className="animate-pulse" />
            <p className="text-xs font-black uppercase tracking-widest">Loading...</p>
          </div>
        ) : interestedEvents.length === 0 ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
            <Heart size={48} strokeWidth={1} />
            <p className="text-xs font-black uppercase tracking-widest">No interested events yet.</p>
            <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">Click "Interested" on events to add them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interestedEvents.map((event, i) => (
              <EventCard key={event.id} event={event} theme={theme} />
            ))}
          </div>
        )
      ) : (
        savedEvents.length === 0 ? (
          <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
            <Bookmark size={48} strokeWidth={1} />
            <p className="text-xs font-black uppercase tracking-widest">No saved events yet.</p>
            <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">Save events to curate your collection</p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedEvents.map((event, i) => (
              <EventCard 
                key={event.id} 
                event={event} 
                theme={theme}
                onRemove={() => toggleSaveEvent(event.id)}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
