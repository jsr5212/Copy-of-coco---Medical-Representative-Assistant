
import React, { useState, useEffect } from 'react';

interface SuperAdminLoginProps {
  onLogin: (email: string, pass: string) => void;
  onCancel: () => void;
}

type LoginStep = 'CREDENTIALS' | 'HANDSHAKE' | 'MFA' | 'AUTHORIZING';

const SuperAdminLogin: React.FC<SuperAdminLoginProps> = ({ onLogin, onCancel }) => {
  const [step, setStep] = useState<LoginStep>('CREDENTIALS');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [mfaCode, setMfaCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('HANDSHAKE');
    setError(null);
    
    // Layer 1 Simulation: Cryptographic Handshake
    setTimeout(() => {
      setStep('MFA');
    }, 2000);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = mfaCode.join('');
    if (fullCode.length !== 6) return;

    setStep('AUTHORIZING');
    // Layer 2 Simulation: Dynamic Token Verification
    setTimeout(() => {
      onLogin(email, pass);
    }, 1800);
  };

  const handleMfaChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...mfaCode];
    newCode[index] = value.slice(-1);
    setMfaCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 z-[200] font-mono">
      {/* Dynamic Security Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,195,195,0.15)_0,transparent_70%)]"></div>
        <div className="w-full h-full bg-[linear-gradient(rgba(30,195,195,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(30,195,195,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>

      <div className="max-w-md w-full relative">
        <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-[0_0_150px_rgba(0,0,0,0.5)] relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className={`inline-flex p-4 rounded-3xl bg-slate-800 border border-slate-700 mb-6 transition-all duration-700 ${step === 'MFA' ? 'ring-4 ring-[#1ec3c3]/20 scale-110' : ''}`}>
              <svg className={`w-8 h-8 ${step === 'MFA' ? 'text-[#1ec3c3]' : 'text-slate-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-1">Nexus Terminal</h2>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">
              Security Clearance: {step === 'CREDENTIALS' ? 'L1 IDENTIFY' : 'L2 AUTHENTICATE'}
            </p>
          </div>

          {step === 'CREDENTIALS' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Personnel Identifier</label>
                <input 
                  required 
                  type="email" 
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 text-[#1ec3c3] rounded-2xl outline-none focus:border-[#1ec3c3]/50 transition-all text-xs" 
                  placeholder="ID_SECURE_ALPHA"
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest ml-1">Cryptographic Key</label>
                <input 
                  required 
                  type="password" 
                  className="w-full px-6 py-4 bg-slate-950 border border-slate-800 text-[#1ec3c3] rounded-2xl outline-none focus:border-[#1ec3c3]/50 transition-all text-xs" 
                  placeholder="••••••••••••"
                  value={pass} 
                  onChange={e => setPass(e.target.value)} 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-white text-slate-900 font-black py-5 rounded-2xl transition-all hover:bg-[#1ec3c3] hover:shadow-[0_0_30px_rgba(30,195,195,0.3)] text-[10px] uppercase tracking-widest"
              >
                Establish Handshake
              </button>
            </form>
          )}

          {step === 'HANDSHAKE' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in zoom-in-95 duration-500">
               <div className="w-16 h-16 border-2 border-slate-800 border-t-[#1ec3c3] rounded-full animate-spin"></div>
               <div className="text-center">
                  <p className="text-[#1ec3c3] text-[10px] font-black uppercase tracking-widest animate-pulse">Exchanging Keys</p>
                  <p className="text-slate-600 text-[8px] mt-2 uppercase">RSA-4096 / TLS 1.3 Active</p>
               </div>
            </div>
          )}

          {step === 'MFA' && (
            <form onSubmit={handleMfaSubmit} className="space-y-8 animate-in fade-in slide-in-from-right-10 duration-500">
              <div className="text-center">
                <p className="text-xs text-slate-400 mb-6">Enter the dynamic token generated by your hardware security key.</p>
                <div className="flex justify-between gap-2">
                  {mfaCode.map((digit, i) => (
                    <input
                      key={i}
                      id={`mfa-${i}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-16 bg-slate-950 border border-slate-800 text-[#1ec3c3] text-2xl font-black text-center rounded-xl focus:border-[#1ec3c3] outline-none transition-all"
                      value={digit}
                      onChange={e => handleMfaChange(i, e.target.value)}
                    />
                  ))}
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#1ec3c3] text-slate-900 font-black py-5 rounded-2xl transition-all hover:bg-white text-[10px] uppercase tracking-widest"
              >
                Validate Token
              </button>
            </form>
          )}

          {step === 'AUTHORIZING' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-6 animate-in fade-in duration-500">
               <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#1ec3c3] w-1/3 animate-[shimmer_1.5s_infinite]"></div>
               </div>
               <div className="text-center">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.4em]">Finalizing Authorization</p>
                  <p className="text-slate-600 text-[8px] mt-2 uppercase">Syncing Node: PHARMA_HQ_PRIME</p>
               </div>
            </div>
          )}

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col items-center gap-4">
             <button 
                type="button" 
                onClick={onCancel} 
                className="text-[9px] font-black text-slate-600 uppercase tracking-widest hover:text-slate-400 transition-colors"
             >
                Abandom Session
             </button>
             <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[7px] font-black text-slate-700 uppercase tracking-widest">Connection Encrypted: SHA-512</span>
             </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}} />
    </div>
  );
};

export default SuperAdminLogin;
