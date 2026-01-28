
import React, { useState } from 'react';
import { MedicalRep } from '../types';

interface EditRepModalProps {
  rep: MedicalRep;
  onSave: (updated: MedicalRep) => void;
  onClose: () => void;
}

const EditRepModal: React.FC<EditRepModalProps> = ({ rep, onSave, onClose }) => {
  const [formData, setFormData] = useState<MedicalRep>({ ...rep });

  const isDirty = JSON.stringify(formData) !== JSON.stringify(rep);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSafeClose = () => {
    if (isDirty) {
      if (window.confirm("You have modified representative data. Are you sure you want to exit without saving?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[160] bg-slate-900/90 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-3xl font-black text-slate-900 leading-tight">Edit Representative</h3>
            <p className="text-sm text-slate-400 mt-1">Modifications trigger a dual-lock verification process.</p>
          </div>
          <button onClick={handleSafeClose} className="p-3 text-slate-300 hover:text-slate-600 transition-colors bg-white rounded-full shadow-sm">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#1ec3c3] focus:bg-white transition-all font-bold text-slate-900" />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Corporate Email</label>
              <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#1ec3c3] focus:bg-white transition-all font-bold text-slate-900" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assigned Region</label>
              <input required name="region" value={formData.region} onChange={handleChange} className="w-full px-8 py-5 bg-slate-50 border-2 border-transparent rounded-[1.5rem] outline-none focus:border-[#1ec3c3] focus:bg-white transition-all font-bold text-slate-900" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-5 rounded-[1.5rem] shadow-2xl hover:bg-black active:scale-95 transition-all text-sm uppercase tracking-widest">
              Request Verification
            </button>
            <button type="button" onClick={handleSafeClose} className="px-10 font-black text-slate-400 hover:text-slate-600 text-xs uppercase tracking-widest">
              Discard
            </button>
          </div>
        </form>

        <div className="bg-blue-600 p-4 text-center">
          <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.3em]">Locked Records System v2.0</span>
        </div>
      </div>
    </div>
  );
};

export default EditRepModal;
