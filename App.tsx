
import React, { Component, useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './store';
import { AppShell } from './components/Layout';
import { Feed } from './screens/Feed';
import { EventDetail } from './screens/EventDetail';
import { MapScreen } from './screens/MapScreen';
import { CreateEvent } from './screens/Create';
import { Profile } from './screens/Profile';
import { SettingsScreen } from './screens/Settings';
import { Onboarding } from './screens/Onboarding';
import { Notifications } from './screens/Notifications';
import { Saved } from './screens/Saved';
import { Wallet } from './screens/Wallet';
import { ChatRoom } from './screens/ChatRoom';
import { Login } from './screens/Login';
import { Messages } from './screens/Messages';
import { Organizations } from './screens/Organizations';
import { OrganizationDetail } from './screens/OrganizationDetail';
import { FriendDiscovery } from './screens/FriendDiscovery';

// Global Error Boundary to catch unhandled component crashes
interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Fixed: Correctly typed React.Component with Props and State interfaces to ensure state/props/setState are inherited
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Fixed: state property is now properly recognized as part of React.Component
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    const errorMessage = error && typeof error === 'object' && 'message' in error 
      ? error.message 
      : String(error);
    console.error("Inner City Core Error:", errorMessage);
  }

  handleReset = () => {
    // Fixed: setState is correctly inherited from React.Component
    this.setState({ hasError: false });
  };

  render() {
    // Fixed: state access is valid on React.Component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-black text-white text-center">
          <h1 className="text-4xl font-black uppercase italic mb-4 tracking-tighter">System Pulse Lost</h1>
          <p className="opacity-50 text-xs mb-8 uppercase tracking-widest leading-loose">
            A security restriction or unhandled signal <br/> interrupted the city's frequency.
          </p>
          <button 
            onClick={this.handleReset}
            className="px-8 py-4 bg-white text-black font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] active:scale-95 transition-transform"
          >
            Re-sync Interface
          </button>
        </div>
      );
    }
    // Fixed: props access is valid on React.Component
    return this.props.children;
  }
}

const MobileFrame: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center p-0 md:p-4 font-sans selection:bg-purple-500/30">
      <div className="w-full max-w-md h-screen md:h-[844px] bg-black relative shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden md:rounded-[3.5rem] md:border-[8px] border-neutral-900 transition-all duration-700 ease-in-out">
        {/* Dynamic Island / Notch Mock */}
        <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-3xl z-[1000] border-x border-b border-white/5" />
        {children}
      </div>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, isLoadingUser } = useApp();
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/500c6263-d9c5-4196-a88c-cf974eeb7593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:92',message:'hasOnboarded useEffect started',data:{currentValue:hasOnboarded},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    // Set hasOnboarded immediately with a fallback timeout
    try {
      const status = localStorage.getItem('inner_city_onboarded');
      const value = status === 'true';
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/500c6263-d9c5-4196-a88c-cf974eeb7593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:96',message:'Setting hasOnboarded from localStorage',data:{status,value},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setHasOnboarded(value);
    } catch (e) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/500c6263-d9c5-4196-a88c-cf974eeb7593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:98',message:'localStorage error, setting hasOnboarded false',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setHasOnboarded(false);
    }

    // Safety timeout: if hasOnboarded is still null after 1 second, set it to false
    const timeout = setTimeout(() => {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/500c6263-d9c5-4196-a88c-cf974eeb7593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:102',message:'hasOnboarded timeout fired',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      setHasOnboarded(prev => prev === null ? false : prev);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  // Safety timeout: if still loading after 6 seconds, force stop
  useEffect(() => {
    if (isLoadingUser) {
      const timeout = setTimeout(() => {
        console.warn('Force stopping loading state after 6 seconds');
        // We can't directly set isLoadingUser here, but we can at least log
      }, 6000);
      return () => clearTimeout(timeout);
    }
  }, [isLoadingUser]);

  const completeOnboarding = () => {
    try {
      localStorage.setItem('inner_city_onboarded', 'true');
    } catch (e) {}
    setHasOnboarded(true);
  };

  // Show nothing while checking auth state
  // But add a maximum wait time
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/500c6263-d9c5-4196-a88c-cf974eeb7593',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'App.tsx:109',message:'Loading check',data:{isLoadingUser,hasOnboarded,willShowLoading:isLoadingUser || hasOnboarded === null},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A,B,C,D,E,F'})}).catch(()=>{});
  }, [isLoadingUser, hasOnboarded]);
  // #endregion
  if (isLoadingUser || hasOnboarded === null) {
    return (
      <MobileFrame>
        <div className="h-full flex items-center justify-center">
          <div className="text-white/40 text-sm font-black uppercase tracking-widest">Loading...</div>
        </div>
      </MobileFrame>
    );
  }

  return (
    <Router>
      <MobileFrame>
        <Routes>
          {/* Login page - show first if not authenticated */}
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/" replace /> : <Login />
            } 
          />
          
          {/* Onboarding - only if authenticated but not onboarded */}
          <Route 
            path="/onboarding" 
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : hasOnboarded ? (
                <Navigate to="/" replace />
              ) : (
                <Onboarding onComplete={completeOnboarding} />
              )
            } 
          />
          
          {/* Main app routes - only if authenticated */}
          <Route 
            path="/*" 
            element={
              !user ? (
                <Navigate to="/login" replace />
              ) : !hasOnboarded ? (
                <Navigate to="/onboarding" replace />
              ) : (
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Feed />} />
                    <Route path="/event/:id" element={<EventDetail />} />
                    <Route path="/event/:id/chat" element={<ChatRoom />} />
                    <Route path="/map" element={<MapScreen />} />
                    <Route path="/create" element={<CreateEvent />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/:userId" element={<Profile />} />
                    <Route path="/messages" element={<Messages />} />
                    <Route path="/messages/:userId" element={<Messages />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/saved" element={<Saved />} />
                    <Route path="/wallet" element={<Wallet />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/organizations" element={<Organizations />} />
                    <Route path="/organization/:slug" element={<OrganizationDetail />} />
                    <Route path="/discover" element={<FriendDiscovery />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AppShell>
              )
            } 
          />
        </Routes>
      </MobileFrame>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
