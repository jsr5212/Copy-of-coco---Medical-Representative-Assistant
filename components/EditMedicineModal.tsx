
import React, { useState, useRef } from 'react';
import { MedicineData } from '../types';

interface EditMedicineModalProps {
  medicine?: MedicineData;
  onSave: (updated: MedicineData) => void;
  onClose: () => void;
  isNew?: boolean;
}

const EditMedicineModal: React.FC<EditMedicineModalProps> = ({ medicine, onSave, onClose, isNew = false }) => {
  const defaultMed: MedicineData = {
    id: `med-${Date.now()}`,
    brand: '',
    division: '',
    specialty: '',
    indications: '',
    dosage: '',
    usp: '',
    targetAudience: '',
    imageUrl: ''
  };

  const [formData, setFormData] = useState<MedicineData>(medicine || defaultMed);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLocked = !!medicine?.seniorLocked;
  const isDirty = JSON.stringify(formData) !== JSON.stringify(medicine || defaultMed);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isLocked) return;
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isLocked) return;
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSafeClose = () => {
    if (isDirty && !isLocked) {
      if (window.confirm("You have unsaved clinical changes. Are you sure you want to exit and discard them?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[110] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col md:flex-row border border-slate-200">
        
        {/* Left Side: Product Preview */}
        <div className={`md:w-1/3 border-r border-slate-100 p-8 flex flex-col items-center justify-center space-y-6 transition-colors ${isLocked ? 'bg-blue-50/50' : 'bg-slate-50'}`}>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Brand Presentation Preview</div>
          <div className={`w-48 h-48 rounded-3xl bg-white shadow-xl flex items-center justify-center overflow-hidden border-2 border-dashed relative group ${isLocked ? 'border-blue-200' : 'border-slate-200'}`}>
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-center p-6">
                <svg className="w-12 h-12 text-slate-200 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-[8px] font-black text-slate-300 uppercase">No Product Image</span>
              </div>
            )}
            {!isLocked && (
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-slate-900/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-black uppercase tracking-widest"
              >
                Upload PNG
              </button>
            )}
          </div>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" disabled={isLocked} />
          
          {isLocked && (
            <div className="flex flex-col items-center gap-2 text-blue-600 animate-in fade-in duration-700">
               <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                 <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
               </svg>
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-center">Record Finalized<br/>& Immutable</span>
            </div>
          )}
          
          {!isLocked && (
            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Recommended: Transparent PNG for the <br/>"Minimalist Premium" template look.
            </p>
          )}
        </div>

        {/* Right Side: Form Details */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-slate-900">{isNew ? 'Manual Product Entry' : 'Modify Clinical Detail'}</h3>
              <p className="text-sm text-slate-400">
                {isLocked ? 'This record is Senior Locked and cannot be modified.' : 'Updates will be sent for IT & Senior verification.'}
              </p>
            </div>
            <button onClick={handleSafeClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Name</label>
                <input required disabled={isLocked} name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. CardioFlow" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Division</label>
                <input required disabled={isLocked} name="division" value={formData.division} onChange={handleChange} placeholder="e.g. Cardiovascular" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialty</label>
                <input required disabled={isLocked} name="specialty" value={formData.specialty} onChange={handleChange} placeholder="e.g. Cardiologist" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Audience</label>
                <input disabled={isLocked} name="targetAudience" value={formData.targetAudience} onChange={handleChange} placeholder="e.g. Consultants" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Indications</label>
              <textarea required disabled={isLocked} name="indications" rows={3} value={formData.indications} onChange={handleChange} placeholder="Main clinical use case..." className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] resize-none disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dosage</label>
              <input required disabled={isLocked} name="dosage" value={formData.dosage} onChange={handleChange} placeholder="e.g. 10mg Once Daily" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique Selling Proposition (USP)</label>
              <textarea required disabled={isLocked} name="usp" rows={2} value={formData.usp} onChange={handleChange} placeholder="Why this brand?" className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-[#1ec3c3] resize-none disabled:opacity-50 disabled:cursor-not-allowed font-bold" />
            </div>

            {!isLocked ? (
              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-slate-900 text-white font-black py-4 rounded-xl shadow-xl hover:bg-black transition-all">
                  {isNew ? 'Register Product' : 'Submit for Verification'}
                </button>
                <button type="button" onClick={handleSafeClose} className="px-8 font-bold text-slate-400 hover:text-slate-600">Discard</button>
              </div>
            ) : (
              <div className="pt-4">
                 <button type="button" onClick={onClose} className="w-full bg-slate-100 text-slate-400 font-black py-4 rounded-xl cursor-default uppercase tracking-widest text-[10px]">
                    Read-Only Mode Active
                 </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMedicineModal;
