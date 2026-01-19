
import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { Bookmark, Clock, MapPin, X, Heart, Calendar, CalendarDays, CalendarCheck } from 'lucide-react';
import { format, isToday, isThisWeek, isFuture, differenceInDays } from 'date-fns';
import { Link } from 'react-router-dom';
import { getUserInterestedEvents } from '../services/social';
import { Event, UserPost, SavedItem } from '../types';
import { getOptimizedImageUrl } from '../utils/imageOptimization';
import { supabase } from '../lib/supabase';

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

// Plan Item Card (for posts, plans, spots)
const PlanItemCard: React.FC<{ post: UserPost; onRemove?: () => void; theme: any }> = ({ post, onRemove, theme }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative group"
    >
      <div className="flex gap-4 p-3 rounded-3xl border transition-all active:scale-[0.98]" style={{ backgroundColor: theme.surface, borderColor: theme.border }}>
        {post.mediaUrls && post.mediaUrls[0] && (
          <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
            <img 
              src={post.mediaUrls[0]} 
              className="w-full h-full object-cover" 
              alt={post.placeName || 'Plan'}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0 py-1">
          {post.placeName && (
            <h4 className="text-lg font-black italic uppercase tracking-tighter leading-none mb-2 truncate">
              {post.placeName}
            </h4>
          )}
          <p className="text-sm mb-2 line-clamp-2" style={{ color: theme.text }}>
            {post.content}
          </p>
          {post.address && (
            <div className="flex items-center gap-1.5 opacity-60 text-[10px] font-bold uppercase tracking-widest">
              <MapPin size={12} />
              {post.address}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            {post.type === 'plan' && <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>Plan</div>}
            {post.type === 'spot' && <div className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-bold uppercase tracking-widest" style={{ color: theme.accent }}>Spot</div>}
          </div>
        </div>
      </div>
      
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
  const [activeTab, setActiveTab] = useState<'tonight' | 'thisWeek' | 'someday'>('tonight');
  const [interestedEvents, setInterestedEvents] = useState<Event[]>([]);
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadPlans();
    }
  }, [user, activeTab]);

  const loadPlans = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Load interested events
      const interestedEventIds = await getUserInterestedEvents(user.id);
      const interested = events.filter(e => interestedEventIds.includes(e.id));
      setInterestedEvents(interested);

      // Load saved items (events, posts, plans, spots)
      const { data: saved, error } = await supabase
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      setSavedItems(saved || []);
    } catch (error) {
      console.error('Error loading plans:', error);
      setSavedItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter items by time period
  const filteredItems = useMemo(() => {
    const now = new Date();
    const allItems: Array<{ type: 'event' | 'post'; data: Event | UserPost; date: Date }> = [];

    // Add interested events
    interestedEvents.forEach(event => {
      const eventDate = new Date(event.startAt);
      if (isFuture(eventDate) || isToday(eventDate)) {
        allItems.push({ type: 'event', data: event, date: eventDate });
      }
    });

    // Add saved events
    const savedEvents = events.filter(e => savedEventIds.includes(e.id));
    savedEvents.forEach(event => {
      const eventDate = new Date(event.startAt);
      if (isFuture(eventDate) || isToday(eventDate)) {
        allItems.push({ type: 'event', data: event, date: eventDate });
      }
    });

    // Add saved posts/plans/spots (would need to fetch full post data)
    // For now, we'll focus on events

    // Sort by date
    allItems.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Filter by tab
    if (activeTab === 'tonight') {
      return allItems.filter(item => isToday(item.date));
    } else if (activeTab === 'thisWeek') {
      return allItems.filter(item => isThisWeek(item.date) && !isToday(item.date));
    } else {
      return allItems.filter(item => !isThisWeek(item.date) && isFuture(item.date));
    }
  }, [interestedEvents, savedEventIds, events, activeTab]);

  const isLight = theme.background === '#FFFFFF';

  return (
    <div className="px-6 py-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">Plans</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-1">Your Upcoming Plans</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: theme.surfaceAlt }}>
          <Calendar size={20} style={{ color: theme.accent }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-white/5">
        <button 
          onClick={() => setActiveTab('tonight')}
          className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${activeTab === 'tonight' ? '' : 'opacity-40'}`}
          style={{ color: theme.text }}
        >
          <CalendarCheck size={14} />
          Tonight
          {activeTab === 'tonight' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('thisWeek')}
          className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${activeTab === 'thisWeek' ? '' : 'opacity-40'}`}
          style={{ color: theme.text }}
        >
          <CalendarDays size={14} />
          This Week
          {activeTab === 'thisWeek' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
          )}
        </button>
        <button 
          onClick={() => setActiveTab('someday')}
          className={`relative pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-2 ${activeTab === 'someday' ? '' : 'opacity-40'}`}
          style={{ color: theme.text }}
        >
          <Calendar size={14} />
          Someday
          {activeTab === 'someday' && (
            <div className="absolute bottom-0 left-0 right-0 h-1 rounded-full" style={{ backgroundColor: theme.accent }} />
          )}
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
          <Calendar size={48} strokeWidth={1} className="animate-pulse" />
          <p className="text-xs font-black uppercase tracking-widest">Loading plans...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center opacity-30 flex flex-col items-center gap-4">
          <Calendar size={48} strokeWidth={1} />
          <p className="text-xs font-black uppercase tracking-widest">
            {activeTab === 'tonight' && 'Nothing planned for tonight.'}
            {activeTab === 'thisWeek' && 'Nothing planned this week.'}
            {activeTab === 'someday' && 'No future plans yet.'}
          </p>
          <p className="text-[10px] font-medium uppercase tracking-widest opacity-60">
            {activeTab === 'tonight' && 'Mark events as "Interested" or save them to add to your plans'}
            {activeTab === 'thisWeek' && 'Save events and plans to see them here'}
            {activeTab === 'someday' && 'Plan ahead by saving events and creating plans'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, i) => (
            item.type === 'event' ? (
              <EventCard 
                key={`event-${item.data.id}`} 
                event={item.data as Event} 
                theme={theme}
                onRemove={savedEventIds.includes(item.data.id) ? () => toggleSaveEvent(item.data.id) : undefined}
              />
            ) : (
              <PlanItemCard 
                key={`post-${item.data.id}`} 
                post={item.data as UserPost} 
                theme={theme}
              />
            )
          ))}
        </div>
      )}
    </div>
  );
};
