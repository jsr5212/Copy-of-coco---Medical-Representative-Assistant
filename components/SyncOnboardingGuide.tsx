
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";

interface SyncOnboardingGuideProps {
  onClose: () => void;
}

const SyncOnboardingGuide: React.FC<SyncOnboardingGuideProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const steps = [
    {
      title: "Preparation",
      text: "Welcome to PharmaIntel Sync. To start, you will need two tablets: one for yourself and one for the doctor.",
      voice: "Welcome to PharmaIntel Sync. To start, you will need two tablets. One for yourself, and one to hand over to the doctor."
    },
    {
      title: "Doctor's Tablet",
      text: "On the doctor's tablet, tap 'Doctor Presentation Portal'. It will enter a secure waiting state.",
      voice: "Step 1. On the doctor's tablet, open the app and tap 'Doctor Presentation Portal'. The device will enter a minimalist waiting state, ready for your signal."
    },
    {
      title: "MR Selection",
      text: "On your tablet, go to the Sync Hub and select the clinical brands you want to present.",
      voice: "Step 2. On your own tablet, navigate to the Sync Hub. Here, you can select the specific medicine brands you wish to detail during this meeting."
    },
    {
      title: "Active Sync",
      text: "Tap 'Launch Synchronized Briefing'. Your slides will now appear on both screens, controlled by you.",
      voice: "Finally, tap 'Launch Synchronized Briefing'. Your slides will instantly appear on the doctor's device. As you swipe on your screen, the doctor's view will follow automatically. You are now in control."
    }
  ];

  const playVoice = async (text: string) => {
    try {
      setIsPlaying(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const ctx = audioContextRef.current;
        const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => setIsPlaying(false);
        source.start();
      }
    } catch (error) {
      console.error("TTS Error:", error);
      setIsPlaying(false);
    }
  };

  // Audio Utils
  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  }

  useEffect(() => {
    playVoice(steps[currentStep].voice);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-[400] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="max-w-4xl w-full flex flex-col items-center">
        {/* Animated Visualization Area */}
        <div className="relative w-full h-80 mb-16 flex items-center justify-center gap-12">
          {/* MR Tablet Mockup */}
          <div className={`w-56 h-40 bg-slate-800 border-4 border-slate-700 rounded-2xl relative transition-all duration-700 ${currentStep >= 2 ? 'scale-110 ring-4 ring-[#1ec3c3]/50' : 'opacity-80'}`}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-700 rounded-full"></div>
            <div className="mt-4 px-4 space-y-2">
              <div className="h-2 w-12 bg-slate-700 rounded"></div>
              <div className="h-16 w-full bg-slate-700/50 rounded-lg flex items-center justify-center">
                {currentStep === 2 && <div className="w-8 h-8 bg-[#1ec3c3] rounded-full animate-ping"></div>}
                {currentStep === 3 && <div className="w-full px-2 space-y-1"><div className="h-1 w-full bg-[#1ec3c3]"></div><div className="h-1 w-3/4 bg-slate-600"></div></div>}
              </div>
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-500 uppercase">Representative Tablet</div>
          </div>

          {/* Connection Pulse */}
          <div className="flex-1 flex items-center justify-center h-full">
            <div className={`flex gap-2 items-center transition-opacity duration-500 ${currentStep === 3 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-3 h-3 bg-[#1ec3c3] rounded-full animate-ping"></div>
              <div className="w-32 h-1 bg-gradient-to-r from-[#1ec3c3] to-blue-500 rounded-full overflow-hidden">
                <div className="h-full w-full bg-white/20 animate-[shimmer_2s_infinite]"></div>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-ping [animation-delay:0.5s]"></div>
            </div>
          </div>

          {/* Doctor Tablet Mockup */}
          <div className={`w-56 h-40 bg-slate-800 border-4 border-slate-700 rounded-2xl relative transition-all duration-700 ${currentStep >= 1 ? 'scale-110 shadow-2xl shadow-blue-500/20' : 'opacity-40 grayscale'}`}>
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-slate-700 rounded-full"></div>
            <div className="mt-4 px-4 flex flex-col items-center justify-center h-28">
               {currentStep === 1 && <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>}
               {currentStep === 3 && <div className="w-full h-full bg-blue-900/30 rounded-lg flex flex-col p-4"><div className="h-1 w-full bg-blue-400"></div><div className="mt-2 space-y-1"><div className="h-0.5 w-full bg-white/20"></div><div className="h-0.5 w-full bg-white/20"></div></div></div>}
            </div>
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] font-black text-slate-500 uppercase">Doctor's Tablet</div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl text-center relative max-w-2xl w-full">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#1ec3c3] text-white px-8 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-xl">
            Step {currentStep + 1} of {steps.length}
          </div>
          
          <h2 className="text-4xl font-black text-slate-900 mb-6">{steps[currentStep].title}</h2>
          <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
            {steps[currentStep].text}
          </p>

          <div className="flex items-center justify-between border-t border-slate-50 pt-10">
            <button 
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="text-slate-400 font-black uppercase text-xs tracking-widest hover:text-slate-900 disabled:opacity-0 transition-all"
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {steps.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === currentStep ? 'w-10 bg-[#1ec3c3]' : 'w-2 bg-slate-100'}`}></div>
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button 
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Next Step
              </button>
            ) : (
              <button 
                onClick={onClose}
                className="bg-[#1ec3c3] text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all"
              >
                Got It, Let's Sync!
              </button>
            )}
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-12 text-slate-500 font-bold hover:text-white transition-colors uppercase text-[10px] tracking-[0.2em]"
        >
          Exit Guide
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}} />
    </div>
  );
};

export default SyncOnboardingGuide;
