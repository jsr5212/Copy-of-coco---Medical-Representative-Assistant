
import React, { useState } from 'react';
import { Doctor, MedicineData } from '../types';

interface DoctorManagementProps {
  doctors: Doctor[];
  medicines: MedicineData[];
  onAdd: (doc: Omit<Doctor, 'id' | 'alignedMedicineIds'>) => void;
  onUpdate: (doc: Doctor) => void;
  onDelete: (id: string) => void;
}

const DoctorManagement: React.FC<DoctorManagementProps> = ({ doctors, medicines, onAdd, onUpdate, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({ name: '', specialty: '', hospital: '', followUpDate: '' });
  const [aligningDocId, setAligningDocId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({ name: '', specialty: '', hospital: '', followUpDate: '' });
    setShowAdd(false);
  };

  const toggleAlignment = (doc: Doctor, medId: string) => {
    const has = doc.alignedMedicineIds.includes(medId);
    const updatedIds = has 
      ? doc.alignedMedicineIds.filter(id => id !== medId)
      : [...doc.alignedMedicineIds, medId];
    onUpdate({ ...doc, alignedMedicineIds: updatedIds });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900">Healthcare Professionals</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Manage your network and align portfolio briefings.</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all"
        >
          {showAdd ? 'Close Panel' : '+ New Doctor'}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in slide-in-from-top-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
            <input required type="text" className="w-full px-6 py-3 bg-white border border-slate-100 rounded-xl outline-none" placeholder="Dr. John Doe" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Specialty</label>
            <input required type="text" className="w-full px-6 py-3 bg-white border border-slate-100 rounded-xl outline-none" placeholder="e.g. Cardiology" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hospital/Clinic</label>
            <input required type="text" className="w-full px-6 py-3 bg-white border border-slate-100 rounded-xl outline-none" placeholder="City General" value={formData.hospital} onChange={e => setFormData({...formData, hospital: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Follow-up Goal</label>
            <input type="date" className="w-full px-6 py-3 bg-white border border-slate-100 rounded-xl outline-none" value={formData.followUpDate} onChange={e => setFormData({...formData, followUpDate: e.target.value})} />
          </div>
          <div className="lg:col-span-4">
            <button type="submit" className="w-full bg-[#1ec3c3] text-white font-black py-4 rounded-xl shadow-lg hover:bg-[#18a0a0] transition-all">Register Professional Node</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {doctors.map(doc => (
          <div key={doc.id} className="bg-white p-10 rounded-[4rem] border border-slate-100 shadow-xl group hover:border-[#1ec3c3]/30 transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-lg group-hover:scale-110 transition-transform">
                  {doc.name.charAt(4)}
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-tight">{doc.name}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{doc.specialty} // {doc.hospital}</p>
                </div>
              </div>
              <button onClick={() => onDelete(doc.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">
                <span>Aligned Presentation Items</span>
                <button onClick={() => setAligningDocId(aligningDocId === doc.id ? null : doc.id)} className="text-[#1ec3c3] hover:underline">
                  {aligningDocId === doc.id ? 'Hide Portfolio' : 'Edit Alignment'}
                </button>
              </div>

              {aligningDocId === doc.id ? (
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 grid grid-cols-2 gap-3 max-h-60 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2">
                  {medicines.map(med => (
                    <button 
                      key={med.id}
                      onClick={() => toggleAlignment(doc, med.id)}
                      className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-tight transition-all border ${
                        doc.alignedMedicineIds.includes(med.id)
                          ? 'bg-[#1ec3c3] text-white border-transparent shadow-md'
                          : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-100'
                      }`}
                    >
                      {med.brand}
                    </button>
                  ))}
                  {medicines.length === 0 && <p className="col-span-2 text-center text-slate-300 italic text-[10px]">No medicines in vault.</p>}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {doc.alignedMedicineIds.map(id => {
                    const med = medicines.find(m => m.id === id);
                    return med ? (
                      <span key={id} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border border-slate-200">
                        {med.brand}
                      </span>
                    ) : null;
                  })}
                  {doc.alignedMedicineIds.length === 0 && <span className="text-[10px] text-slate-300 italic font-black uppercase tracking-widest px-2">No alignment set.</span>}
                </div>
              )}
            </div>

            <div className="mt-10 flex gap-4">
               <button className="flex-1 py-4 bg-slate-50 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">Contact History</button>
               <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all">Prepare Sync</button>
            </div>
          </div>
        ))}
        {doctors.length === 0 && !showAdd && (
          <div className="col-span-full py-40 text-center border-4 border-dashed border-slate-50 rounded-[4rem]">
            <div className="text-slate-300 font-black text-xl uppercase tracking-[0.2em]">Network Node Empty</div>
            <p className="text-slate-400 text-sm mt-2">Register your first healthcare professional to begin clinical alignment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorManagement;
