
import React, { useState, useEffect, useMemo } from 'react';
import { AppState } from '../types';

interface Step {
  selector: string;
  title: string;
  description: string;
  requiredState?: AppState;
}

interface OnboardingTourProps {
  appState: AppState;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ appState, onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const steps: Step[] = useMemo(() => [
    {
      selector: '[data-tour="upload-zone"]',
      title: "Step 1: Upload Glossary",
      description: "Start by uploading your medicine glossary PDF here. Our AI will automatically parse all brand details and divisions for you.",
      requiredState: 'UPLOADING'
    },
    {
      selector: '[data-tour="portfolio-table"]',
      title: "Step 2: Brand Management",
      description: "Once uploaded, your products appear here. You can filter by division or search for specific indications easily.",
      requiredState: 'VIEWING'
    },
    {
      selector: '[data-tour="presentation-btn"]',
      title: "Step 3: Visual Presentation",
      description: "Ready to detail? Click here to launch the high-impact slide deck generated from your clinical data.",
      requiredState: 'VIEWING'
    },
    {
      selector: '[data-tour="voice-assistant"]',
      title: "Bonus: Voice Assistant",
      description: "Use our AI Voice Prep tool to practice your pitch. It knows your products and can help you roleplay with 'doctors'.",
      requiredState: 'VIEWING'
    }
  ], []);

  // Filter steps based on current app state availability
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    const updateRect = () => {
      const element = document.querySelector(currentStep.selector);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        // If element not found in current state, skip or wait? 
        // For this app, we'll try to find the next available one or just wait
        setTargetRect(null);
      }
    };

    updateRect();
    window.addEventListener('resize', updateRect);
    const interval = setInterval(updateRect, 500); // Poll in case of animations
    
    return () => {
      window.removeEventListener('resize', updateRect);
      clearInterval(interval);
    };
  }, [currentStepIndex, currentStep.selector, appState]);

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => onComplete();

  if (!targetRect && currentStep.requiredState && appState !== currentStep.requiredState) {
     // If the required element is not in the current state, we might want to skip it for now
     // or just show a fallback. For a better UX, we'll automatically move to next if state is mismatch
     // but in this simple app, we'll just show the tooltip centered.
  }

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      {/* Backdrop with hole */}
      <div className="absolute inset-0 bg-slate-900/60 transition-opacity duration-500 overflow-hidden">
        {targetRect && (
          <div 
            className="absolute bg-white rounded-3xl shadow-[0_0_0_9999px_rgba(15,23,42,0.6)] transition-all duration-500 ease-in-out pointer-events-auto"
            style={{
              top: targetRect.top - 12,
              left: targetRect.left - 12,
              width: targetRect.width + 24,
              height: targetRect.height + 24,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div 
        className="absolute z-[210] w-[320px] bg-white rounded-[2rem] shadow-2xl p-8 transition-all duration-500 ease-in-out pointer-events-auto"
        style={targetRect ? {
          top: targetRect.bottom + 40 > window.innerHeight - 300 ? targetRect.top - 300 : targetRect.bottom + 40,
          left: Math.max(20, Math.min(window.innerWidth - 340, targetRect.left + targetRect.width / 2 - 160)),
        } : {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <div className="mb-6">
          <div className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-widest mb-2">
            Onboarding • Step {currentStepIndex + 1} of {steps.length}
          </div>
          <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">{currentStep.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed font-medium">{currentStep.description}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handleSkip}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            Skip Tour
          </button>
          <div className="flex gap-2">
            <button 
              onClick={handleNext}
              className="bg-[#2d2d2d] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-xl hover:bg-black transition-all"
            >
              {currentStepIndex === steps.length - 1 ? 'Finish' : 'Next Tip'}
            </button>
          </div>
        </div>

        {/* Arrow pointer */}
        {targetRect && (
            <div 
                className={`absolute w-4 h-4 bg-white rotate-45 transform left-1/2 -translate-x-1/2 ${targetRect.bottom + 40 > window.innerHeight - 300 ? 'bottom-[-8px]' : 'top-[-8px]'}`}
            />
        )}
      </div>
    </div>
  );
};

export default OnboardingTour;
