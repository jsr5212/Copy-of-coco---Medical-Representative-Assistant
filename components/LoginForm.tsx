
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginFormProps {
  onLogin: (email: string, pass: string, role: UserRole) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Role determination logic for client-side demo
    let role: UserRole = 'ADMIN';
    if (email.toLowerCase().includes('senior')) {
      role = 'SENIOR_VERIFIER';
    } else if (email.toLowerCase().includes('it')) {
      role = 'IT_VERIFIER';
    } else if (email.toLowerCase().includes('rep') || email.toLowerCase().includes('mr')) {
      role = 'FIELD_REP';
    }

    setTimeout(() => {
      onLogin(email, pass, role);
      setIsLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-md mx-auto py-20 animate-in fade-in zoom-in-95">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#1ec3c3]/5 rounded-bl-[4rem] -mr-10 -mt-10"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Client Access</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Identifier</label>
              <input 
                required 
                type="email" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1ec3c3] transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                placeholder="name@company.com"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
              <div className="flex flex-col gap-1 mt-2 px-1">
                <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Access Control Keywords:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <span className="text-[7px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-black">'senior' → Authority Vault</span>
                  <span className="text-[7px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-black">'it' → Tech Audit</span>
                  <span className="text-[7px] bg-slate-100 px-2 py-0.5 rounded text-slate-500 font-black">'rep' → Field Force</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vault Key</label>
              <input 
                required 
                type="password" 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1ec3c3] transition-all font-bold text-slate-900" 
                placeholder="••••••••••••"
                value={pass} 
                onChange={e => setPass(e.target.value)} 
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black transition-all mt-4 flex items-center justify-center gap-3 active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                'Establish Secure Connection'
              )}
            </button>
            
            <button 
              type="button" 
              onClick={onCancel} 
              className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest py-2 hover:text-slate-900 transition-colors"
            >
              Cancel Entry
            </button>
          </form>

          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
            <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.2em]">AES-256 Protected Tunnel Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
