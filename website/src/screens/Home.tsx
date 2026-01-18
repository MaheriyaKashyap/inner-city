import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Sparkles, MapPin, Zap, Users, Shield, 
  Download, ChevronRight, Star, ArrowRight, Play, Calendar,
  Music, Palette, Cpu, Heart, Bookmark, MessageCircle
} from 'lucide-react';
import { NeonButton, Card, Badge, GlowOrb } from '@/components/inner-city/UI';

const features = [
  {
    icon: Zap,
    title: 'Discover Events',
    description: 'Find underground raves, warehouse parties, and exclusive events in your city',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: MapPin,
    title: 'City Pulse',
    description: 'Real-time trends showing the hottest neighborhoods and venues',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: Shield,
    title: 'Neural Keys',
    description: 'Secure digital tickets with QR code access and blockchain verification',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Connect with fellow ravers, share experiences, and build your crew',
    color: 'from-green-500 to-emerald-500',
  },
];

const cities = [
  { name: 'Berlin', events: 156, image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&q=80' },
  { name: 'London', events: 234, image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
  { name: 'New York', events: 189, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
  { name: 'Tokyo', events: 145, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80' },
  { name: 'Los Angeles', events: 167, image: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=600&q=80' },
];

const testimonials = [
  {
    name: 'DJ_PULSE',
    role: 'Berlin',
    text: 'Inner City is how I find every underground event. The community is unreal.',
    avatar: 'P',
  },
  {
    name: 'RaveQueen',
    role: 'London',
    text: 'Finally an app that gets nightlife culture. Love the dark aesthetic.',
    avatar: 'R',
  },
  {
    name: 'TechnoFan',
    role: 'Tokyo',
    text: 'Best event discovery app hands down. The Neural Keys feature is genius.',
    avatar: 'T',
  },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        {/* Background Effects */}
        <GlowOrb className="top-0 left-0 opacity-30" />
        <GlowOrb className="bottom-0 right-0 opacity-30" />
        
        {/* Animated Grid Background */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--border) 1px, transparent 1px),
              linear-gradient(to bottom, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 text-center max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--surface)] border border-[var(--border)] mb-8"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
            <span className="text-sm font-medium text-[var(--text)]">
              Join 50,000+ ravers worldwide
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase italic text-[var(--text)] mb-6 tracking-tight leading-[0.9]"
          >
            Your City's
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-[var(--text-muted)]">
              Underground
            </span>
            <br />
            Awaits
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-[var(--text-muted)] mb-12 max-w-2xl mx-auto"
          >
            Discover warehouse raves, underground parties, and exclusive events.
            <br className="hidden md:block" />
            Inner City is your passport to the night.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <NeonButton size="lg" className="w-full sm:w-auto gap-2">
              <Download className="w-5 h-5" />
              Download on iOS
            </NeonButton>
            <NeonButton variant="secondary" size="lg" className="w-full sm:w-auto gap-2">
              <Download className="w-5 h-5" />
              Get it on Android
            </NeonButton>
          </motion.div>

          {/* Phone Mockup Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="relative inline-block">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[var(--accent)] blur-3xl opacity-20 rounded-3xl" />
              
              {/* Phone Frame */}
              <div className="relative bg-[var(--bg)] border-4 border-[var(--border)] rounded-[3rem] p-3 shadow-2xl" style={{ backgroundColor: 'var(--bg)' }}>
                <div className="w-[300px] h-[600px] rounded-[2.5rem] overflow-hidden relative" style={{ backgroundColor: 'var(--bg)' }}>
                  {/* Screen Content - Mock Feed */}
                  <div className="h-full w-full overflow-hidden relative" style={{ backgroundColor: 'var(--bg)', borderRadius: '2.5rem', width: '100%', maxWidth: '100%' }}>
                    {/* Status Bar */}
                    <div className="h-8 flex items-center justify-between px-5 text-[10px] text-[var(--text)]" style={{ backgroundColor: 'var(--bg)' }}>
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />
                        <div className="w-3 h-3 rounded-full bg-[var(--border)]" />
                        <div className="w-3 h-3 rounded-full bg-[var(--border)]" />
                      </div>
                    </div>
                    
                    {/* Header */}
                    <div className="px-4 py-3 border-b border-[var(--border)]" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
                      <h2 className="text-base font-black uppercase italic text-[var(--text)]">INNER CITY</h2>
                      <p className="text-[9px] text-[var(--text-muted)] mt-0.5">Berlin</p>
                    </div>
                    
                    {/* Feed - Multiple Event Cards */}
                    <div className="px-3 py-3 pb-20 space-y-3">
                      {/* Event Card 1 - Live */}
                      <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)]">
                        <div className="h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 relative">
                          <div className="absolute top-1.5 left-1.5">
                            <Badge type="live">● LIVE</Badge>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[9px] text-[var(--accent)] font-bold mb-0.5">TONIGHT • 11:00 PM</p>
                          <h3 className="text-xs font-black uppercase italic text-[var(--text)] leading-tight">
                            WAREHOUSE RAVE
                          </h3>
                          <p className="text-[9px] text-[var(--text-muted)] mt-1">Secret Location</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-1">
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)] border border-[var(--bg)]" />
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)]/70 border border-[var(--bg)]" />
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)]/40 border border-[var(--bg)]" />
                            </div>
                            <span className="text-[8px] text-[var(--text-muted)]">127 going</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Card 2 */}
                      <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)]">
                        <div className="h-24 bg-gradient-to-br from-cyan-500/30 to-blue-500/30 relative">
                          <div className="absolute top-1.5 left-1.5">
                            <Badge type="tonight">TONIGHT</Badge>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[9px] text-[var(--accent)] font-bold mb-0.5">FRI • 10:00 PM</p>
                          <h3 className="text-xs font-black uppercase italic text-[var(--text)] leading-tight">
                            TECHNO NIGHTS
                          </h3>
                          <p className="text-[9px] text-[var(--text-muted)] mt-1">Underground Club</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-1">
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)] border border-[var(--bg)]" />
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)]/70 border border-[var(--bg)]" />
                            </div>
                            <span className="text-[8px] text-[var(--text-muted)]">89 going</span>
                          </div>
                        </div>
                      </div>

                      {/* Event Card 3 */}
                      <div className="bg-[var(--surface)] rounded-xl overflow-hidden border border-[var(--border)]">
                        <div className="h-24 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 relative">
                          <div className="absolute top-1.5 left-1.5">
                            <Badge type="official">OFFICIAL</Badge>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-[9px] text-[var(--accent)] font-bold mb-0.5">SAT • 9:00 PM</p>
                          <h3 className="text-xs font-black uppercase italic text-[var(--text)] leading-tight">
                            DEEP HOUSE
                          </h3>
                          <p className="text-[9px] text-[var(--text-muted)] mt-1">Rooftop Venue</p>
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex -space-x-1">
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)] border border-[var(--bg)]" />
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)]/70 border border-[var(--bg)]" />
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)]/40 border border-[var(--bg)]" />
                              <div className="w-4 h-4 rounded-full bg-[var(--accent)]/20 border border-[var(--bg)]" />
                            </div>
                            <span className="text-[8px] text-[var(--text-muted)]">234 going</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="absolute bottom-0 left-0 w-full h-14 border-t flex items-center justify-around px-2 overflow-hidden" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '0 0 2.5rem 2.5rem', maxWidth: '100%' }}>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 rounded bg-[var(--accent)]" />
                        <div className="w-1 h-1 rounded-full bg-[var(--accent)]" />
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 rounded bg-[var(--border)]" />
                        <div className="w-1 h-1 rounded-full bg-transparent" />
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 rounded bg-[var(--border)]" />
                        <div className="w-1 h-1 rounded-full bg-transparent" />
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <div className="w-5 h-5 rounded bg-[var(--border)]" />
                        <div className="w-1 h-1 rounded-full bg-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-[var(--border)] rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 bg-[var(--accent)] rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative">
        <GlowOrb className="top-0 right-0 opacity-20" />
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic text-[var(--text)] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto">
              Built for the underground. Designed for the community.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="p-6 h-full">
                  <div className="relative w-12 h-12 rounded-2xl mb-4">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-20 rounded-2xl`} />
                    <div className="relative flex items-center justify-center h-full">
                      <feature.icon className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text)] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--text-muted)]">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcase */}
      <section className="py-20 px-4 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div>
              <Badge className="mb-4">Experience</Badge>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic text-[var(--text)] mb-8">
                Your Night,
                <br />
                Elevated
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Calendar, text: 'Never miss an event with smart notifications' },
                  { icon: Heart, text: 'Save favorites and build your wishlist' },
                  { icon: Bookmark, text: 'Create collections of events by vibe' },
                  { icon: MessageCircle, text: 'Chat with attendees before you arrive' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg)] border border-[var(--border)]"
                  >
                    <div className="p-2 rounded-xl bg-[var(--accent)]/10">
                      <item.icon className="w-5 h-5 text-[var(--accent)]" />
                    </div>
                    <span className="text-[var(--text)]">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl border border-[var(--border)] overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80&auto=format&fit=crop"
                  alt="Underground nightlife scene"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 bg-[var(--accent)]/10 group-hover:bg-[var(--accent)]/20 transition-colors duration-300" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Global</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic text-[var(--text)] mb-4">
              Active in Major Cities
            </h2>
            <p className="text-lg text-[var(--text-muted)]">
              With more being added every week
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {cities.map((city, index) => (
              <motion.div
                key={city.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="aspect-square relative">
                    <img 
                      src={city.image} 
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-bold text-[var(--text)] mb-0.5">{city.name}</h3>
                      <p className="text-xs text-[var(--text-muted)]">{city.events} events</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[var(--surface)]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4">Community</Badge>
            <h2 className="text-4xl md:text-5xl font-black uppercase italic text-[var(--text)] mb-4">
              Loved by Ravers
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                    ))}
                  </div>
                  <p className="text-[var(--text-muted)] mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/20 flex items-center justify-center font-bold text-[var(--accent)]">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text)]">{testimonial.name}</p>
                      <p className="text-sm text-[var(--text-muted)]">{testimonial.role}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 relative overflow-hidden">
        <GlowOrb className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-150 opacity-30" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h2 className="text-5xl md:text-7xl font-black uppercase italic text-[var(--text)] mb-6">
            Step Into
            <br />
            The Underground
          </h2>
          <p className="text-xl text-[var(--text-muted)] mb-12">
            Download Inner City and discover your city's hidden nightlife
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NeonButton size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download Now
            </NeonButton>
          </div>

          {/* App Store Badges */}
          <div className="flex items-center justify-center gap-4 mt-8 opacity-50">
            <span className="text-sm text-[var(--text-muted)]">Available on iOS & Android</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-xl font-black uppercase italic text-[var(--text)] mb-2">
                Inner City
              </h3>
              <p className="text-sm text-[var(--text-muted)]">
                Your passport to the underground
              </p>
            </div>
            
            <div className="flex gap-8 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Contact</a>
              <a href="#" className="hover:text-[var(--accent)] transition-colors">Support</a>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--text-muted)]">
            <p>© 2025 Inner City. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
