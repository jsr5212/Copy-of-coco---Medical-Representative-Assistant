
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, pass: string) => void;
  onCancel: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onCancel }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, pass);
  };

  return (
    <div className="max-w-md mx-auto py-20 animate-in fade-in zoom-in-95">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
        <h2 className="text-4xl font-black mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</label>
            <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1ec3c3]" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
            <input required type="password" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1ec3c3]" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-[#2d2d2d] text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-black transition-all mt-4">Enter Dashboard</button>
          <button type="button" onClick={onCancel} className="w-full text-sm font-bold text-slate-400 py-2">Back to Home</button>
        </form>
        <p className="text-center text-[10px] text-slate-300 mt-8 uppercase tracking-widest">Internal Access Only</p>
      </div>
    </div>
  );
};

export default LoginForm;
