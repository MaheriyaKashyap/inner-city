
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Send, Users, Info, MoreHorizontal } from 'lucide-react';
import { NeonButton } from '../components/UI';

interface Message {
  id: string;
  user: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar: string;
}

export const ChatRoom: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, theme } = useApp();
  const event = events.find(e => e.id === id);
  const [input, setInput] = useState('');

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', user: 'rave_king', text: 'Queue is moving fast at the North entrance!', time: '22:04', isMe: false, avatar: 'https://picsum.photos/seed/rk/100/100' },
    { id: '2', user: 'techno_girl', text: 'Music is incredible tonight. Bass is heavy.', time: '22:10', isMe: false, avatar: 'https://picsum.photos/seed/tg/100/100' },
    { id: '3', user: 'me', text: 'Just parked, see you all in 10.', time: '22:12', isMe: true, avatar: 'https://picsum.photos/seed/me/100/100' },
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      user: 'me',
      text: input,
      time: '22:15',
      isMe: true,
      avatar: 'https://picsum.photos/seed/me/100/100'
    }]);
    setInput('');
  };

  if (!event) return null;

  return (
    <div className="absolute inset-0 z-[100] flex flex-col" style={{ backgroundColor: theme.background }}>
      {/* Chat Header */}
      <header className="px-6 pt-12 pb-4 flex items-center justify-between ios-glass border-b" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft size={24} />
          </button>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-black uppercase italic tracking-tight truncate">{event.title}</h2>
            <div className="flex items-center gap-1.5 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-[8px] font-black uppercase tracking-widest">142 Active Pulse</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 opacity-40"><Users size={20} /></button>
          <button className="p-2 opacity-40"><MoreHorizontal size={20} /></button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 flex flex-col-reverse">
        <div className="space-y-6">
          {messages.map((m) => (
            <motion.div 
              key={m.id}
              initial={{ opacity: 0, x: m.isMe ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-end gap-3 ${m.isMe ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!m.isMe && <img src={m.avatar} className="w-8 h-8 rounded-full border border-white/10" />}
              <div className="max-w-[75%] space-y-1">
                {!m.isMe && <p className="text-[8px] font-black uppercase tracking-widest opacity-30 ml-2">{m.user}</p>}
                <div 
                  className={`px-4 py-3 rounded-2xl text-sm font-medium ${m.isMe ? 'rounded-br-none' : 'rounded-bl-none'}`}
                  style={{ 
                    backgroundColor: m.isMe ? theme.accent : theme.surface,
                    color: m.isMe ? (theme.background === '#FFFFFF' ? '#FFF' : '#000') : theme.text,
                    border: `1px solid ${theme.border}`
                  }}
                >
                  {m.text}
                </div>
                <p className={`text-[8px] opacity-20 font-bold ${m.isMe ? 'text-right mr-2' : 'ml-2'}`}>{m.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 pb-10 ios-glass border-t" style={{ borderColor: theme.border }}>
        <div className="flex items-center gap-3 bg-white/5 rounded-2xl p-2 pl-4 border border-white/5">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your frequency..."
            className="flex-1 bg-transparent outline-none text-sm font-medium text-white"
          />
          <button 
            onClick={handleSend}
            className="p-3 rounded-xl transition-all active:scale-90" 
            style={{ backgroundColor: theme.accent }}
          >
            <Send size={18} color={theme.background === '#FFFFFF' ? '#FFF' : '#000'} />
          </button>
        </div>
      </div>
    </div>
  );
};
