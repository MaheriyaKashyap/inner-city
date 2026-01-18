
import React from 'react';
import { useApp } from '../store';
import { motion } from 'framer-motion';

export const NeonButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}> = ({ children, onClick, variant = 'primary', className = '' }) => {
  const { theme } = useApp();
  const isLight = theme.background === '#FFFFFF';
  
  const base = "px-6 py-3 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95";
  const styles = {
    primary: isLight ? `text-white` : `text-black`,
    secondary: `bg-transparent border-2`,
    ghost: `bg-transparent`
  };

  // Determine text color for secondary/ghost to ensure visibility
  const accentColor = theme.accent;
  const secondaryTextStyle = { color: accentColor };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${base} ${styles[variant]} ${className}`}
      style={variant === 'primary' 
        ? { 
            backgroundColor: theme.accent, 
            boxShadow: `${theme.glowIntensity} ${theme.accent}66` // Added space and 40% alpha (66 hex)
          } 
        : { 
            borderColor: theme.accent,
            ...secondaryTextStyle
          }
      }
    >
      {children}
    </motion.button>
  );
};

export const Badge: React.FC<{
  label: string;
  type?: 'official' | 'community' | 'live' | 'tonight';
}> = ({ label, type }) => {
  const { theme } = useApp();
  const isLight = theme.background === '#FFFFFF';
  
  const getStyles = () => {
    switch (type) {
      case 'official': return { bg: theme.accent, text: isLight ? '#FFF' : '#000', icon: '✦' };
      case 'live': return { bg: '#FF0000', text: '#FFF', icon: '●', pulse: true };
      case 'tonight': return { bg: theme.surfaceAlt, text: theme.text, icon: '⚡' };
      default: return { bg: theme.surfaceAlt, text: theme.textDim, icon: '' };
    }
  };

  const style = getStyles();

  return (
    <div 
      className={`px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-widest flex items-center gap-1.5 ${style.pulse ? 'pulse-glow' : ''}`}
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.icon && <span>{style.icon}</span>}
      {label}
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const { theme } = useApp();
  return (
    <div 
      className={`rounded-3xl overflow-hidden ${className}`}
      style={{ 
        backgroundColor: theme.surface, 
        border: `1px solid ${theme.border}`, 
        boxShadow: theme.background === '#FFFFFF' ? '0 4px 20px rgba(0,0,0,0.05)' : 'none' 
      }}
    >
      {children}
    </div>
  );
};

export const Input: React.FC<any> = (props) => {
  const { theme } = useApp();
  return (
    <input 
      {...props}
      className={`w-full px-5 py-4 rounded-2xl outline-none transition-all focus:ring-2 ${props.className}`}
      style={{ 
        backgroundColor: theme.surfaceAlt, 
        color: theme.text,
        border: `1px solid ${theme.border}`,
        '--tw-ring-color': theme.accent
      } as any}
    />
  );
};
