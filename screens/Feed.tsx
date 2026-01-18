
import React, { useState, useMemo } from 'react';
import { useApp } from '../store';
import { Event, CityPulse } from '../types';
import { Badge, Card } from '../components/UI';
import { Heart, Bookmark, Share2, MapPin, Clock, Zap, PlayCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, isValid } from 'date-fns';
import { Link } from 'react-router-dom';
import { MOCK_CITY_PULSES } from '../mockData';

const PulseCard: React.FC<{ pulse: CityPulse }> = ({ pulse }) => {
  const { theme } = useApp();
  
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-72 h-44 rounded-[2.5rem] overflow-hidden relative border mr-4"
      style={{ borderColor: theme.border, backgroundColor: theme.surface }}
    >
      <img src={pulse.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-700" alt={pulse.title} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      
      <div className="absolute top-4 left-4">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
          <Zap size={10} className="text-primary" style={{ color: theme.accent }} />
          <span className="text-[8px] font-black uppercase tracking-widest text-white">{pulse.metric}</span>
        </div>
      </div>
      
      <div className="absolute bottom-5 left-5 right-5">
        <h4 className="text-xl font-black italic tracking-tighter uppercase text-white leading-none mb-1">{pulse.title}</h4>
        <p className="text-[10px] font-medium text-white/60 leading-tight line-clamp-2">{pulse.description}</p>
      </div>
    </motion.div>
  );
};

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const { theme, toggleSaveEvent, savedEventIds } = useApp();
  const isSaved = savedEventIds.includes(event.id);
  const isLight = theme.background === '#FFFFFF';
  
  const { isLive, formattedTime, isTonight } = useMemo(() => {
    const now = new Date();
    const start = new Date(event.startAt);
    const end = new Date(event.endAt);
    
    const validStart = isValid(start);
    const validEnd = isValid(end);

    return {
      isLive: validStart && validEnd && now >= start && now <= end,
      formattedTime: validStart ? format(start, 'HH:mm') : 'TBA',
      isTonight: validStart && start.getTime() < now.getTime() + 86400000 && start.getTime() > now.getTime(),
    };
  }, [event.startAt, event.endAt]);
  
  const isOfficial = event.tier === 'official';

  return (
    <Card 
      className={`mb-10 mx-6 relative border-none !rounded-[2.5rem] transition-all duration-500 overflow-visible`}
      style={{ 
        boxShadow: isOfficial && !isLight ? `0 0 30px ${theme.accent}15` : 'none'
      }}
    >
      {isOfficial && !isLight && (
        <div className="absolute -inset-0.5 rounded-[2.5rem] blur opacity-20 pointer-events-none" 
             style={{ background: `linear-gradient(45deg, ${theme.accent}, transparent, ${theme.accent})` }} />
      )}

      <Link to={`/event/${event.id}`} className="block relative z-10">
        <div className="relative aspect-[4/5] overflow-hidden rounded-t-[2.5rem]">
          <img src={event.mediaUrls[0]} alt={event.title} className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105" />
          <div className={`absolute inset-0 bg-gradient-to-t ${isLight ? 'from-white/95 via-transparent' : 'from-black/95 via-transparent'} to-transparent`} />
          
          <div className="absolute top-5 left-5 flex flex-wrap gap-2">
            {isOfficial ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black shadow-lg">
                <ShieldCheck size={12} strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-widest">Official</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10">
                <span className="text-[9px] font-black uppercase tracking-widest">Community</span>
              </div>
            )}
            
            {isTonight && <Badge label="Tonight" type="tonight" />}
          </div>

          {isLive && (
            <div className="absolute top-5 right-5 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_5px_white]" />
              <span className="text-[9px] font-black uppercase tracking-widest text-white">Live Now</span>
            </div>
          )}

          <div className="absolute bottom-6 left-6 right-6">
            <h3 className={`text-4xl font-bold tracking-tighter mb-3 leading-[0.85] uppercase italic font-display ${isLight ? 'text-black' : 'text-white'}`}>
              {event.title}
            </h3>
            <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black tracking-widest uppercase opacity-70 ${isLight ? 'text-black' : 'text-white'}`}>
              <div className="flex items-center gap-1.5">
                <Clock size={12} strokeWidth={2.5} />
                <span>{formattedTime}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} strokeWidth={2.5} />
                <span>{event.venueName} • {isOfficial ? 'Central' : 'Secret Location'}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      
      <div className="flex justify-between items-center px-6 py-5 rounded-b-[2.5rem] relative z-10" style={{ backgroundColor: theme.surface }}>
        <div className="flex items-center gap-8">
          <button className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase active:scale-90 transition-transform group">
            <Heart size={18} className="group-active:fill-current" />
            {event.counts.likes}
          </button>
          <button className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase active:scale-90 transition-transform">
            <Share2 size={18} />
            Relay
          </button>
        </div>
        <button 
          onClick={() => toggleSaveEvent(event.id)}
          className="p-1 transition-transform active:scale-90"
          style={{ color: isSaved ? theme.accent : theme.textDim }}
        >
          <Bookmark size={22} fill={isSaved ? theme.accent : 'none'} />
        </button>
      </div>
    </Card>
  );
};

export const Feed: React.FC = () => {
  const { events, rankedEvents, activeCity, theme } = useApp();
  const [activeMood, setActiveMood] = useState('All');
  
  const moods = ['All', 'Deep & Dark', 'High Energy', 'Soulful', 'Experimental'];
  const cityEvents = events.filter(e => e.cityId === activeCity.id);
  const cityPulses = MOCK_CITY_PULSES.filter(p => p.cityId === activeCity.id);
  const isLight = theme.background === '#FFFFFF';

  // Use ranked events if available, otherwise fall back to regular events
  const displayEvents = useMemo(() => {
    if (rankedEvents) {
      // Show priority events first, then background events with reduced opacity
      return {
        priority: rankedEvents.priority.filter(e => e.cityId === activeCity.id),
        background: rankedEvents.background.filter(e => e.cityId === activeCity.id),
      };
    }
    return {
      priority: cityEvents,
      background: [],
    };
  }, [rankedEvents, cityEvents, activeCity.id]);

  return (
    <div className="pb-10 pt-4">
      <div className="px-6 mb-8 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 block mb-1">Gateway // {activeCity.country}</span>
          <h2 className="text-5xl font-black tracking-tighter leading-none uppercase italic">
            {activeCity.name}
          </h2>
        </div>
        <div className="flex -space-x-3 mb-1">
           {[1,2,3].map(i => (
             <img key={i} src={`https://picsum.photos/seed/face${i}/50/50`} className="w-8 h-8 rounded-full border-2" style={{ borderColor: theme.background }} />
           ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="px-6 flex items-center gap-2 mb-4">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Now Peaking</h3>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-6 gap-5">
          {(displayEvents.priority.length > 0 ? displayEvents.priority : cityEvents).slice(0, 5).map(event => (
            <Link key={event.id} to={`/event/${event.id}`} className="flex-shrink-0 w-20 flex flex-col items-center gap-2">
              <div className="w-20 h-20 rounded-[1.8rem] border-2 p-1 active:scale-95 transition-all" style={{ borderColor: theme.accent }}>
                <div className="w-full h-full rounded-[1.3rem] overflow-hidden relative">
                   <img src={event.mediaUrls[0]} className="w-full h-full object-cover brightness-75" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <PlayCircle size={20} className="text-white opacity-80" />
                   </div>
                </div>
              </div>
              <span className="text-[8px] font-black uppercase tracking-tight text-center line-clamp-1 opacity-60 leading-tight">{event.venueName}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <div className="px-6 mb-4 flex justify-between items-center">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">City Insights</h3>
          <button className="text-[9px] font-black uppercase tracking-widest text-primary" style={{ color: theme.accent }}>The Descent</button>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-6">
          {cityPulses.map(pulse => <PulseCard key={pulse.id} pulse={pulse} />)}
        </div>
      </div>

      <div className="mb-10 overflow-x-auto no-scrollbar px-6 flex gap-2">
        {moods.map(mood => (
          <button 
            key={mood}
            onClick={() => setActiveMood(mood)}
            className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeMood === mood ? 'bg-primary border-primary text-white' : 'border-white/10 opacity-40'}`}
            style={{ 
              backgroundColor: activeMood === mood ? theme.accent : 'transparent',
              borderColor: activeMood === mood ? theme.accent : theme.border,
              color: activeMood === mood ? (isLight ? '#FFF' : '#000') : theme.text
            }}
          >
            {mood}
          </button>
        ))}
      </div>

      {/* Priority Events - Front and Center */}
      {displayEvents.priority.length > 0 && (
        <div className="flex flex-col mb-6">
          {displayEvents.priority.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Background Events - Reduced Opacity */}
      {displayEvents.background.length > 0 && (
        <div className="flex flex-col opacity-40">
          <div className="px-6 mb-4">
            <h3 className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">
              More Events
            </h3>
          </div>
          {displayEvents.background.map(event => (
            <div key={event.id} className="opacity-60 hover:opacity-100 transition-opacity">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
