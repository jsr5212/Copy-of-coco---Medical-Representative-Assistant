
import React, { useState, useEffect } from 'react';
import { UserRole, AppState } from '../types';

interface SmartAssistantProps {
  role: UserRole;
  appState: AppState;
}

interface GuideContent {
  title: string;
  description: string;
  features: { id: string; label: string; tip: string; selector: string }[];
}

const SmartAssistant: React.FC<SmartAssistantProps> = ({ role, appState }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const [pulsePos, setPulsePos] = useState({ top: 0, left: 0, width: 0, height: 0 });

  const getGuideContent = (userRole: UserRole): GuideContent => {
    const commonSecurityTips = [
      { id: 'encryption', label: 'End-to-End Vault', tip: 'All clinical data is encrypted using AES-256-GCM before leaving this device.', selector: '[data-tour="encryption"]' },
      { id: 'privacy', label: 'Zero-Knowledge', tip: 'Pharmaintel servers cannot read your extracted pharmaceutical data.', selector: '[data-tour="privacy"]' }
    ];

    switch (userRole) {
      case 'SUPER_ADMIN':
        return {
          title: "Nexus Controller",
          description: "Oversight of the entire PharmaIntel ecosystem with high-entropy cryptographic security.",
          features: [
            { id: 'fleet', label: 'Fleet Oversight', tip: 'Monitor every corporate client’s data sanctity and active MR count.', selector: '[data-tour="fleet"]' },
            { id: 'support', label: 'Support Desk', tip: 'Real-time response center for technical and billing inquiries.', selector: '[data-tour="support"]' },
            { id: 'billing', label: 'Sales & Billing', tip: 'Global ARR tracking and automated invoice status.', selector: '[data-tour="billing"]' },
            ...commonSecurityTips
          ]
        };
      case 'COMPANY_USER':
        return {
          title: "Strategic Lead",
          description: "Manage your portfolio extraction and field force deployment from an encrypted hub.",
          features: [
            { id: 'extract', label: 'AI Extraction', tip: 'Upload glossaries; our AI auto-maps clinical data into your secure vault.', selector: '[data-tour="extract"]' },
            { id: 'portfolio', label: 'Portfolio View', tip: 'Your live therapeutic library, searchable by indication.', selector: '[data-tour="portfolio"]' },
            { id: 'team', label: 'Team Sync', tip: 'Assign MRs to regional divisions and monitor credentials.', selector: '[data-tour="team"]' },
            ...commonSecurityTips
          ]
        };
      case 'GUEST':
        return {
          title: "Field Force Hub",
          description: "Hand-crafted clinical presentations synchronized over a secure P2P-simulated channel.",
          features: [
            { id: 'sync', label: 'Sync Hub', tip: 'Initialize a synchronized session with the doctor’s device.', selector: '[data-tour="sync"]' },
            { id: 'deck', label: 'Premium Deck', tip: 'Minimalist, high-impact slides generated from your clinical data.', selector: '[data-tour="deck"]' },
            ...commonSecurityTips
          ]
        };
      default:
        return {
          title: "PharmaIntel Hub",
          description: "Clinical data intelligence for modern pharmaceutical forces.",
          features: [...commonSecurityTips]
        };
    }
  };

  const content = getGuideContent(role);

  const handleFeatureHover = (selector: string, tip: string) => {
    const el = document.querySelector(selector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setPulsePos({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
      setActiveTip(tip);
    } else {
      setActiveTip(tip); // Still show the tip text even if target is not on screen
    }
  };

  return (
    <div className="fixed bottom-10 right-10 z-[1000]">
      {/* Floating Trigger Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-slate-900 shadow-2xl flex items-center justify-center group transition-all duration-500 hover:scale-110 active:scale-95 ${isOpen ? 'rotate-90' : ''}`}
      >
        <div className="relative">
          <svg className={`w-6 h-6 text-white transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <svg className={`w-6 h-6 text-white absolute inset-0 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#1ec3c3] rounded-full animate-ping"></div>
        </div>
      </button>

      {/* Main Assistant Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[420px] bg-white rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(15,23,42,0.3)] border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
          {/* Header */}
          <div className="bg-slate-900 p-10 text-white">
            <div className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-[0.4em] mb-2">Smart Assistant</div>
            <h3 className="text-3xl font-serif italic mb-3">{content.title} Guide</h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">{content.description}</p>
          </div>

          {/* Feature Map / Navigation */}
          <div className="p-10 space-y-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interactive Dashboard Map</h4>
              <div className="grid gap-3">
                {content.features.map(f => (
                  <button 
                    key={f.id}
                    onMouseEnter={() => handleFeatureHover(f.selector, f.tip)}
                    onMouseLeave={() => { setActiveTip(null); setPulsePos({ top: 0, left: 0, width: 0, height: 0 }); }}
                    className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-[#1ec3c3] hover:bg-white transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-[#1ec3c3] group-hover:scale-150 transition-transform"></div>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-widest">{f.label}</span>
                    </div>
                    <svg className="w-4 h-4 text-slate-300 group-hover:text-[#1ec3c3] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Hover Tooltip Pop */}
            <div className="min-h-[100px] flex items-center justify-center text-center p-6 bg-[#F5F2ED]/50 rounded-[2rem] border border-[#E8E2D9] relative overflow-hidden">
               {activeTip ? (
                 <p className="text-sm font-serif italic text-[#5D574F] animate-in fade-in slide-in-from-top-2">
                   "{activeTip}"
                 </p>
               ) : (
                 <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Hover over a feature to explore</p>
               )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
             <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
             </div>
             <button onClick={() => setIsOpen(false)} className="text-[10px] font-black text-slate-900 uppercase tracking-widest">End Session</button>
          </div>
        </div>
      )}

      {/* Global Highlight Pulse Overlay */}
      {activeTip && pulsePos.width > 0 && (
        <div 
          className="fixed pointer-events-none z-[2000] border-4 border-[#1ec3c3] rounded-2xl shadow-[0_0_50px_rgba(30,195,195,0.4)] transition-all duration-500 ease-in-out bg-[#1ec3c3]/5"
          style={{
            top: pulsePos.top - 8,
            left: pulsePos.left - 8,
            width: pulsePos.width + 16,
            height: pulsePos.height + 16
          }}
        >
          <div className="absolute -top-4 -right-4 bg-[#1ec3c3] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter animate-bounce">
            Secure Node
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .font-serif { font-family: 'Playfair Display', serif; }
      `}} />
    </div>
  );
};

export default SmartAssistant;
