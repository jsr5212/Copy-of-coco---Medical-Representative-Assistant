
import React from 'react';
import { UserRole, AppState } from '../types';

interface HeaderProps {
  role?: UserRole;
  userName?: string;
  appState: AppState;
  onLogout?: () => void;
  onAdmin?: () => void;
  onHome?: () => void;
  onStaffPortal?: () => void;
}

const Header: React.FC<HeaderProps> = ({ role, userName, appState, onLogout, onAdmin, onHome, onStaffPortal }) => {
  const isLandingPage = appState === 'IDLE';

  return (
    <header className="bg-white/70 backdrop-blur-md sticky top-0 z-[60] py-6 border-b border-slate-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div onClick={onHome} className="flex items-center gap-3 group cursor-pointer">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              PharmaIntel
            </span>
            <div className="bg-[#1ec3c3] p-1.5 rounded-md transform rotate-[-10deg] group-hover:rotate-0 transition-transform shadow-lg shadow-[#1ec3c3]/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {!isLandingPage && role && role !== 'GUEST' && (
            <button 
              onClick={onHome}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 animate-in fade-in slide-in-from-left-2"
              title="Return to Dashboard"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </button>
          )}

          {!isLandingPage && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100 animate-in zoom-in-50">
              <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[8px] font-black text-green-600 uppercase tracking-widest">AES-256 Vault Active</span>
            </div>
          )}
        </div>
        
        <nav className="hidden lg:flex items-center space-x-10">
          {role === 'ADMIN' && <button onClick={onAdmin} className="text-xs font-black text-slate-900 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">Master Panel</button>}
          {isLandingPage ? (
            <button onClick={onStaffPortal} className="text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors">Staff Portal</button>
          ) : (
            <>
              <button onClick={onHome} className="text-sm font-bold text-slate-400 hover:text-[#1ec3c3] transition-colors">Workspace</button>
              <a href="#" className="text-sm font-bold text-slate-400 hover:text-[#1ec3c3] transition-colors">Archive</a>
            </>
          )}
        </nav>

        <div className="flex items-center gap-6">
          {role && role !== 'GUEST' ? (
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-black text-slate-900 uppercase tracking-tight leading-none">{userName}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">{role}</div>
              </div>
              <button 
                onClick={onLogout}
                className="text-xs font-black text-red-500 px-4 py-2 rounded-xl hover:bg-red-50 transition-all border border-red-50"
              >
                Logout
              </button>
              <div className="h-10 w-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden ring-2 ring-[#1ec3c3]/10">
                <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${userName}`} alt="User" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6">
               <button onClick={onStaffPortal} className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                Internal
              </button>
              {isLandingPage && (
                <button 
                  onClick={onHome}
                  className="bg-slate-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1ec3c3] transition-all shadow-lg"
                >
                  Client Login
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
