
import React, { useState } from 'react';
import { Company } from '../types';

interface RegistrationFormProps {
  onRegister: (data: Omit<Company, 'id' | 'status' | 'productCount' | 'createdAt'>) => void;
  onCancel: () => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onRegister, onCancel }) => {
  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [formData, setFormData] = useState({
    name: '',
    adminName: '',
    contact: '',
    email: '',
    sector: '',
    password: ''
  });

  const isPopulated = Object.values(formData).some(val => val !== '');

  const handleSafeCancel = () => {
    if (isPopulated) {
      if (window.confirm("You have entered corporate details. Are you sure you want to cancel and lose this information?")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('OTP');
  };

  const verifyOtp = () => {
    onRegister(formData);
  };

  if (step === 'OTP') {
    return (
      <div className="max-w-md mx-auto py-20 animate-in zoom-in-95">
        <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <h2 className="text-3xl font-black mb-4">Verify Identity</h2>
          <p className="text-slate-500 mb-8">We've sent a 6-digit code to {formData.contact}. Enter it below to register.</p>
          <div className="flex gap-2 mb-8">
            {[1,2,3,4,5,6].map(i => <input key={i} type="text" maxLength={1} className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-bold focus:ring-2 focus:ring-[#1ec3c3] outline-none" />)}
          </div>
          <button onClick={verifyOtp} className="w-full bg-[#2d2d2d] text-white font-bold py-4 rounded-xl">Complete Registration</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-10">
      <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-100">
        <h2 className="text-4xl font-black mb-2 text-slate-900">Company Registration</h2>
        <p className="text-slate-500 mb-10">Please provide corporate credentials for verification.</p>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Name</label>
            <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#1ec3c3]" placeholder="e.g. Novartis" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Person</label>
            <input required type="text" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="John Doe" value={formData.adminName} onChange={e => setFormData({...formData, adminName: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Number</label>
            <input required type="tel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" placeholder="+1..." value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Professional Email</label>
            <input required type="email" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Division</label>
            <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none appearance-none" value={formData.sector} onChange={e => setFormData({...formData, sector: e.target.value})}>
              <option value="">Select...</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Oncology">Oncology</option>
              <option value="General">General Medicine</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
            <input required type="password" title="Set a secure password for your company panel" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
          </div>
          <div className="md:col-span-2 flex gap-4 pt-6">
            <button type="submit" className="flex-1 bg-[#2d2d2d] text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-black">Continue to OTP</button>
            <button type="button" onClick={handleSafeCancel} className="px-8 font-bold text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
