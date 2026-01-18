import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils';

interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function NeonButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className,
  ...props 
}: NeonButtonProps) {
  const variants = {
    primary: 'bg-[var(--accent)] text-[var(--bg)] hover:shadow-[0_0_30px_var(--accent-glow)]',
    secondary: 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--accent)]',
    ghost: 'bg-transparent text-[var(--text)] hover:bg-[var(--surface)]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'font-bold uppercase tracking-wider rounded-2xl transition-all duration-300',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  type?: 'default' | 'official' | 'community' | 'live' | 'tonight';
}

export function Badge({ type = 'default', children, className, ...props }: BadgeProps) {
  const types = {
    default: 'bg-[var(--surface-alt)] text-[var(--text-muted)]',
    official: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30',
    community: 'bg-[var(--surface-alt)] text-[var(--text-muted)] border border-[var(--border)]',
    live: 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse',
    tonight: 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30',
  };

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest',
      types[type],
      className
    )}
    {...props}>
      {children}
    </span>
  );
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ children, className, hover = false, ...props }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      className={cn(
        'bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden',
        'transition-all duration-300',
        hover && 'cursor-pointer hover:border-[var(--accent)]/50 hover:shadow-[0_0_30px_var(--accent-glow)]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl px-4 py-3',
        'text-[var(--text)] placeholder:text-[var(--text-muted)]/50',
        'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
        'transition-all duration-300',
        className
      )}
      {...props}
    />
  );
}

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full bg-[var(--surface-alt)] border border-[var(--border)] rounded-2xl px-4 py-3',
        'text-[var(--text)] placeholder:text-[var(--text-muted)]/50',
        'focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30',
        'transition-all duration-300 resize-none',
        className
      )}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(
      'animate-pulse bg-[var(--surface-alt)] rounded-2xl',
      className
    )}
    {...props} />
  );
}

export function GlowOrb({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn(
      'absolute w-96 h-96 rounded-full blur-3xl opacity-20',
      'bg-gradient-to-br from-[var(--accent)] to-transparent',
      className
    )}
    {...props} />
  );
}
