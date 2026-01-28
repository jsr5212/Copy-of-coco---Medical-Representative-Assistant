
import React, { useState, useRef } from 'react';
import { MedicineData } from '../types';
import SyncOnboardingGuide from './SyncOnboardingGuide';

interface SyncControllerProps {
  medicines: MedicineData[];
  onLaunchPresentation: (selected: MedicineData[]) => void;
  onBack?: () => void;
}

const SyncController: React.FC<SyncControllerProps> = ({ medicines, onLaunchPresentation, onBack }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showGuide, setShowGuide] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const toggleMedicine = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const startSync = () => {
    const selectedList = medicines.filter(m => selectedIds.includes(m.id));
    if (selectedList.length === 0) return;
    
    const channel = new BroadcastChannel('pharma_sync_session');
    channel.postMessage({
      type: 'SYNC_START',
      payload: { medicines: selectedList }
    });
    
    onLaunchPresentation(selectedList);
    channel.close();
  };

  const selectedMedicines = medicines.filter(m => selectedIds.includes(m.id));

  return (
    <div className="relative min-h-[75vh] flex flex-col space-y-8 animate-in fade-in duration-700 bg-[#F5F2ED]/30 rounded-[4rem] p-8 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
        <svg className="w-64 h-64 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12,2L10.5,3.5C8,6 6,8.5 6,11C6,14.5 8.5,17 12,17C15.5,17 18,14.5 18,11C18,8.5 16,6 13.5,3.5L12,2M12,15C9.8,15 8,13.2 8,11C8,9.5 9.3,7.5 12,5C14.7,7.5 16,9.5 16,11C16,13.2 14.2,15 12,15Z" />
        </svg>
      </div>

      {/* Top Navigation */}
      <div className="flex justify-between items-center px-4 relative z-10">
        <div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-slate-900 transition-all mb-4"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Exit Sync Hub
          </button>
          <h2 className="text-5xl font-serif text-[#5D574F] italic leading-none">The Clinical <br/><span className="not-italic font-black text-slate-900">Briefing Selection</span></h2>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <button 
            onClick={() => setShowGuide(true)}
            className="px-6 py-3 bg-white border border-[#E8E2D9] rounded-full text-[10px] font-black text-[#8E877E] uppercase tracking-widest hover:bg-[#F5F2ED] transition-all flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Sync Protocol
          </button>
          <div className="text-[10px] font-black text-[#A39E96] uppercase tracking-[0.4em]">@pharmaintel.verified</div>
        </div>
      </div>

      {/* Designer Horizontal Swipe Gallery */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-10 overflow-x-auto pb-24 pt-8 px-4 snap-x snap-mandatory no-scrollbar relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {medicines.map(med => {
          const isSelected = selectedIds.includes(med.id);
          return (
            <div 
              key={med.id}
              onClick={() => toggleMedicine(med.id)}
              className={`flex-none w-[380px] md:w-[440px] snap-center transition-all duration-700 cursor-pointer relative group ${
                isSelected ? 'scale-[1.02]' : 'scale-100 opacity-95'
              }`}
            >
              {/* Designer Card Content */}
              <div className={`h-[580px] rounded-[4rem] p-12 flex flex-col transition-all duration-700 relative overflow-hidden ${
                isSelected 
                  ? 'bg-white shadow-[0_40px_80px_-20px_rgba(30,195,195,0.2)] border-4 border-[#1ec3c3]' 
                  : 'bg-[#F5F2ED] border-4 border-white shadow-xl shadow-slate-200/50 hover:bg-white'
              }`}>
                
                {/* Product Image / Pedestal Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative mb-12">
                  <div className={`absolute bottom-0 w-32 h-6 blur-xl rounded-full transition-colors ${isSelected ? 'bg-[#1ec3c3]/20' : 'bg-slate-300/20'}`}></div>
                  <div className={`w-48 h-48 rounded-full border border-[#E8E2D9] flex items-center justify-center relative z-10 transition-transform duration-700 group-hover:scale-110 ${isSelected ? 'bg-white shadow-lg' : 'bg-white/50'}`}>
                    {med.imageUrl ? (
                      <img src={med.imageUrl} alt={med.brand} className="w-32 h-32 object-contain" />
                    ) : (
                      <span className="text-5xl font-serif text-[#A39E96]">{med.brand.charAt(0)}</span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="absolute top-0 right-0 bg-[#1ec3c3] p-3 rounded-full shadow-lg animate-in zoom-in-50 z-20">
                       <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                       </svg>
                    </div>
                  )}
                </div>

                {/* Text Content Area */}
                <div className="space-y-6 text-center">
                  <div className="space-y-1">
                    <p className="text-[11px] font-serif text-[#8E877E] italic">Core Clinical of</p>
                    <h3 className="text-4xl md:text-5xl font-serif text-[#5D574F] uppercase tracking-tight leading-none truncate w-full px-4">
                      {med.brand}
                    </h3>
                  </div>

                  {/* Feature Bubbles - Designer Style */}
                  <div className="flex justify-center items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-white shadow-md border border-[#E8E2D9] flex flex-col items-center justify-center p-2 text-center group-hover:scale-110 transition-transform">
                       <span className="text-[8px] font-black text-[#A39E96] uppercase mb-0.5">Area</span>
                       <span className="text-[9px] font-bold text-[#5D574F] leading-tight truncate w-full italic">{med.division.split(' ')[0]}</span>
                    </div>
                    <div className="w-24 h-24 rounded-full bg-white shadow-lg border border-[#E8E2D9] flex flex-col items-center justify-center p-3 text-center group-hover:scale-125 transition-transform z-10">
                       <span className="text-[8px] font-black text-[#1ec3c3] uppercase mb-1">Indications</span>
                       <span className="text-[9px] font-serif text-[#5D574F] italic leading-tight line-clamp-2">Excellent for {med.specialty}s</span>
                    </div>
                    <div className="w-20 h-20 rounded-full bg-white shadow-md border border-[#E8E2D9] flex flex-col items-center justify-center p-2 text-center group-hover:scale-110 transition-transform">
                       <span className="text-[8px] font-black text-[#A39E96] uppercase mb-0.5">Dosage</span>
                       <span className="text-[9px] font-bold text-[#5D574F] italic">{med.dosage.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>

                {/* Swipe Action Indicator */}
                <div className="mt-auto pt-8 flex items-center justify-center">
                   <div className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all ${
                     isSelected ? 'bg-slate-900 text-white shadow-xl' : 'bg-white border border-[#E8E2D9] text-[#A39E96]'
                   }`}>
                     {isSelected ? 'Ready for Sync' : 'Tap to Feature'}
                   </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Designer Selection Dock */}
      <div className={`fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-8 z-[80] transition-all duration-700 ease-out ${
        selectedIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'
      }`}>
        <div className="bg-[#F5F2ED]/80 backdrop-blur-2xl border border-white shadow-[0_50px_100px_-20px_rgba(93,87,79,0.2)] p-8 rounded-[4rem] flex items-center justify-between gap-10">
          <div className="flex-1 flex items-center gap-6 overflow-x-auto no-scrollbar">
            <div className="flex -space-x-5">
              {selectedMedicines.map((med, i) => (
                <div 
                  key={med.id} 
                  className="w-16 h-16 rounded-full bg-white border-4 border-[#F5F2ED] flex items-center justify-center text-[#5D574F] text-lg font-serif italic shadow-xl animate-in slide-in-from-left-4 transition-transform hover:-translate-y-2"
                  style={{ zIndex: selectedMedicines.length - i }}
                >
                  {med.brand.charAt(0)}
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-[#A39E96] uppercase tracking-[0.4em] mb-1">Clinical Portfolio Queue</div>
              <div className="text-xl font-serif italic text-[#5D574F]">
                {selectedMedicines.length} therapeutic modules staged
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setSelectedIds([])}
              className="text-[10px] font-black text-red-400 uppercase tracking-widest hover:text-red-600 px-6 py-3 rounded-full transition-colors"
            >
              Clear
            </button>
            <button 
              onClick={startSync}
              className="bg-[#5D574F] text-white px-12 py-5 rounded-full font-serif italic text-lg shadow-2xl hover:bg-slate-900 hover:scale-105 active:scale-95 transition-all whitespace-nowrap tracking-wide"
            >
              Initialize Sync
            </button>
          </div>
        </div>
      </div>

      {showGuide && <SyncOnboardingGuide onClose={() => setShowGuide(false)} />}

      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .vertical-rl {
          writing-mode: vertical-rl;
        }
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}} />
    </div>
  );
};

export default SyncController;
