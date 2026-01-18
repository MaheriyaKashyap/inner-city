import React, { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider>
      <style>{`
        :root {
          --bg: #0a0a0a;
          --surface: #141414;
          --surface-alt: #1a1a1a;
          --border: #262626;
          --text: #ffffff;
          --text-muted: #a3a3a3;
          --accent: #ffffff;
          --accent-glow: rgba(255, 255, 255, 0.3);
        }
        
        body {
          background-color: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: background-color 0.5s ease, color 0.5s ease;
        }
        
        * {
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px var(--accent-glow); }
          50% { box-shadow: 0 0 40px var(--accent-glow); }
        }
      `}</style>
      
      <div className="min-h-screen bg-[var(--bg)]">
        {children}
      </div>
    </ThemeProvider>
  );
}
