
import React, { useEffect, useState } from 'react';
import { MedicineData, SyncEvent } from '../types';
import PresentationView from './PresentationView';

interface DoctorSyncPortalProps {
  onExit: () => void;
}

const DoctorSyncPortal: React.FC<DoctorSyncPortalProps> = ({ onExit }) => {
  const [syncState, setSyncState] = useState<{
    isActive: boolean;
    currentMedicineId: string | null;
    slideIndex: number;
    medicines: MedicineData[];
  }>({
    isActive: false,
    currentMedicineId: null,
    slideIndex: 0,
    medicines: []
  });

  useEffect(() => {
    const channel = new BroadcastChannel('pharma_sync_session');
    
    channel.onmessage = (event: MessageEvent<SyncEvent>) => {
      const { type, payload } = event.data;
      
      switch (type) {
        case 'SYNC_START':
          setSyncState(prev => ({ 
            ...prev, 
            isActive: true, 
            medicines: payload.medicines,
            currentMedicineId: payload.medicines[0]?.id || null,
            slideIndex: 0
          }));
          break;
        case 'SYNC_NAVIGATE':
          setSyncState(prev => ({ ...prev, slideIndex: payload.index }));
          break;
        case 'SYNC_PRODUCT':
          setSyncState(prev => ({ ...prev, currentMedicineId: payload.id }));
          break;
        case 'SYNC_STOP':
          setSyncState(prev => ({ ...prev, isActive: false }));
          break;
      }
    };

    return () => channel.close();
  }, []);

  if (!syncState.isActive) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-[#1ec3c3] rounded-[3rem] flex items-center justify-center mb-8 animate-pulse shadow-2xl shadow-[#1ec3c3]/20">
          <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.142 0M1.414 1.414l21.212 21.212" />
          </svg>
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Patient-First Clinical Sync</h1>
        <p className="text-slate-400 max-w-md mx-auto text-lg leading-relaxed">
          Waiting for your Medical Representative to initiate the clinical briefing. 
          Please keep this tablet ready for the interactive presentation.
        </p>
        <button 
          onClick={onExit}
          className="mt-12 text-slate-500 font-bold hover:text-white transition-colors"
        >
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[500] bg-black">
      <PresentationView 
        data={syncState.medicines} 
        initialIndex={syncState.slideIndex}
        isDoctorView={true}
        onClose={() => {}} 
      />
    </div>
  );
};

export default DoctorSyncPortal;
