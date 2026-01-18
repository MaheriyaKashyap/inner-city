
import React from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';
import { Heart, MessageSquare, Bell, UserPlus, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const Notifications: React.FC = () => {
  const { theme } = useApp();

  const mockNotifications = [
    { id: 1, type: 'like', user: 'techno_girl', text: 'liked your saved event "HYPERSPACE"', time: new Date() },
    { id: 2, type: 'follow', user: 'alex_rivers', text: 'started following you', time: new Date(Date.now() - 3600000) },
    { id: 3, type: 'comment', user: 'rave_king', text: 'commented on "Canal Session #12"', time: new Date(Date.now() - 7200000) },
    { id: 4, type: 'reminder', user: 'System', text: '"Warehouse Rave" starts in 2 hours', time: new Date(Date.now() - 10000000) },
  ];

  const getIcon = (type: string) => {
    switch(type) {
      case 'like': return <Heart size={16} fill={theme.accent} color={theme.accent} />;
      case 'follow': return <UserPlus size={16} color={theme.accent} />;
      case 'comment': return <MessageSquare size={16} color={theme.accent} />;
      default: return <Bell size={16} color={theme.accent} />;
    }
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-black italic tracking-tighter uppercase">Activity</h2>
        <button className="text-[10px] font-black uppercase opacity-40">Clear All</button>
      </div>

      <div className="space-y-4">
        {mockNotifications.map((n, i) => (
          <motion.div 
            key={n.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-[0.98]"
            style={{ backgroundColor: theme.surface, borderColor: theme.border }}
          >
            <div className="w-12 h-12 rounded-xl overflow-hidden relative shrink-0">
              <img src={`https://picsum.photos/seed/${n.user}/100/100`} className="w-full h-full object-cover" />
              <div className="absolute -bottom-1 -right-1 p-1 rounded-md bg-black/80 backdrop-blur-sm">
                {getIcon(n.type)}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight mb-1">
                <span className="font-bold uppercase italic mr-1">@{n.user}</span>
                {n.text}
              </p>
              <div className="flex items-center gap-1 opacity-40 text-[9px] font-black uppercase tracking-widest">
                <Clock size={10} />
                {format(n.time, 'HH:mm')} • JUST NOW
              </div>
            </div>
            
            {!i && <div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
