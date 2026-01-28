
import React, { useState, useEffect } from 'react';
import { MedicineData } from '../types';

interface PresentationViewProps {
  data: MedicineData[];
  companyName?: string;
  isDoctorView?: boolean;
  initialIndex?: number;
  onClose: () => void;
  onSlideChange?: (index: number) => void;
}

const PresentationView: React.FC<PresentationViewProps> = ({ 
  data, 
  companyName, 
  isDoctorView = false, 
  initialIndex = 0,
  onClose,
  onSlideChange
}) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const totalSlides = data.length + 1;

  useEffect(() => {
    setActiveIndex(initialIndex);
  }, [initialIndex]);

  const nextSlide = () => {
    const newIdx = (activeIndex + 1) % totalSlides;
    setActiveIndex(newIdx);
    onSlideChange?.(newIdx);
  };

  const prevSlide = () => {
    const newIdx = (activeIndex - 1 + totalSlides) % totalSlides;
    setActiveIndex(newIdx);
    onSlideChange?.(newIdx);
  };

  const isTitleSlide = activeIndex === 0;
  const currentProduct = !isTitleSlide ? data[activeIndex - 1] : null;

  // Split indications or features into circles for the "Ingredient Bubble" effect
  const featurePoints = currentProduct 
    ? [
        { label: 'Indication', value: currentProduct.indications.split('.')[0] },
        { label: 'USP', value: currentProduct.usp.split('.')[0] },
        { label: 'Dosage', value: currentProduct.dosage },
        { label: 'Specialty', value: currentProduct.specialty }
      ]
    : [];

  return (
    <div className={`fixed inset-0 z-[60] bg-[#F5F2ED] flex flex-col ${isDoctorView ? 'cursor-none' : ''}`}>
      {/* Header - Hidden for Doctor */}
      {!isDoctorView && (
        <div className="p-4 flex justify-between items-center bg-white/50 backdrop-blur-md border-b border-[#E8E2D9]">
          <h2 className="text-[#5D574F] font-black uppercase tracking-widest text-[10px]">
            {isTitleSlide ? 'Presentation Overview' : `Product Detail: ${currentProduct?.brand}`}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[#A39E96] text-[10px] font-black uppercase tracking-widest">Slide {activeIndex + 1} of {totalSlides}</span>
            <button 
              onClick={onClose}
              className="text-[#A39E96] hover:text-[#5D574F] transition-colors p-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Slide Container */}
      <div className={`flex-1 flex items-center justify-center ${isDoctorView ? 'p-0' : 'p-8'} overflow-hidden relative`}>
        {/* Background Botanical / Molecular Accents */}
        <div className="absolute top-0 left-0 p-12 opacity-[0.03] select-none pointer-events-none">
          <svg className="w-64 h-64 text-[#5D574F]" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12,2L10.5,3.5C8,6 6,8.5 6,11C6,14.5 8.5,17 12,17C15.5,17 18,14.5 18,11C18,8.5 16,6 13.5,3.5L12,2M12,15C9.8,15 8,13.2 8,11C8,9.5 9.3,7.5 12,5C14.7,7.5 16,9.5 16,11C16,13.2 14.2,15 12,15Z" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 p-12 opacity-[0.03] select-none pointer-events-none transform rotate-180">
          <svg className="w-64 h-64 text-[#5D574F]" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12,2L10.5,3.5C8,6 6,8.5 6,11C6,14.5 8.5,17 12,17C15.5,17 18,14.5 18,11C18,8.5 16,6 13.5,3.5L12,2M12,15C9.8,15 8,13.2 8,11C8,9.5 9.3,7.5 12,5C14.7,7.5 16,9.5 16,11C16,13.2 14.2,15 12,15Z" />
          </svg>
        </div>

        <div className={`w-full h-full max-w-[1400px] flex flex-col md:flex-row items-center justify-center gap-16 relative z-10 animate-in fade-in duration-1000`}>
          
          {isTitleSlide ? (
            <div className="text-center space-y-12">
              <div className="space-y-4">
                 <p className="text-[12px] font-black text-[#A39E96] uppercase tracking-[0.4em]">Therapeutic Portfolio Presentation</p>
                 <h1 className="text-7xl md:text-9xl font-serif text-[#5D574F] italic leading-none">
                    {companyName || 'Corporate'} <br/><span className="not-italic">Briefing</span>
                 </h1>
              </div>
              <div className="h-px w-32 bg-[#E8E2D9] mx-auto"></div>
              <p className="text-xl text-[#8E877E] font-serif italic max-w-xl mx-auto leading-relaxed">
                 A curated overview of clinical indications and therapeutic advancements in {companyName || 'our'} global division.
              </p>
            </div>
          ) : currentProduct ? (
            <>
              {/* Product Visual Area */}
              <div className="md:w-1/2 flex flex-col items-center justify-center relative">
                 {/* Product Pedestal / Platform */}
                 <div className="absolute bottom-0 w-80 h-12 bg-white/40 blur-2xl rounded-full"></div>
                 <div className="absolute w-[400px] h-[400px] border border-[#E8E2D9] rounded-full opacity-40 animate-[spin_20s_linear_infinite]"></div>
                 
                 <div className="relative z-10 transition-transform duration-700 hover:scale-105">
                   {currentProduct.imageUrl ? (
                     <img 
                        src={currentProduct.imageUrl} 
                        alt={currentProduct.brand} 
                        className="max-h-[500px] w-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] object-contain"
                     />
                   ) : (
                     <div className="w-64 h-80 bg-white shadow-2xl rounded-3xl border border-[#E8E2D9] flex flex-col items-center justify-center p-8 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-[#F5F2ED] flex items-center justify-center">
                          <span className="text-4xl font-serif text-[#A39E96]">{currentProduct.brand.charAt(0)}</span>
                        </div>
                        <div className="text-[10px] font-black text-[#A39E96] uppercase tracking-widest">{currentProduct.brand}</div>
                     </div>
                   )}
                 </div>

                 <div className="mt-12 text-center">
                   <p className="text-[10px] font-black text-[#A39E96] uppercase tracking-[0.5em] mb-2">@pharma_intel_hq</p>
                 </div>
              </div>

              {/* Product Content Area */}
              <div className="md:w-1/2 space-y-12">
                <div className="space-y-4">
                   <p className="text-[14px] font-serif text-[#8E877E] italic">Core Indications of</p>
                   <h2 className="text-6xl md:text-8xl font-serif text-[#5D574F] tracking-tight leading-none uppercase">
                      {currentProduct.brand}
                   </h2>
                </div>

                <div className="space-y-6">
                   {featurePoints.map((point, idx) => (
                     <div key={idx} className="flex items-center gap-6 group">
                        <div className="w-16 h-16 flex-none rounded-full bg-white shadow-lg border border-[#E8E2D9] flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
                           {/* Ingredient-style icon placeholder or brand initial */}
                           <span className="text-[10px] font-black text-[#A39E96] uppercase">{point.label.charAt(0)}</span>
                        </div>
                        <div className="flex-1 bg-white/40 border border-[#E8E2D9] px-8 py-4 rounded-2xl group-hover:bg-white/80 transition-all">
                           <div className="text-[10px] font-black text-[#A39E96] uppercase tracking-widest mb-1">{point.label}</div>
                           <div className="text-sm font-serif text-[#5D574F] leading-tight italic">{point.value}</div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>

      {/* Footer Controls - Hidden for Doctor */}
      {!isDoctorView && (
        <div className="p-10 flex justify-center items-center gap-8 relative z-20">
          <button onClick={prevSlide} className="text-[#A39E96] hover:text-[#5D574F] transition-all hover:scale-125">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex gap-4">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-700 ${i === activeIndex ? 'w-12 bg-[#5D574F]' : 'w-2 bg-[#E8E2D9]'}`} />
            ))}
          </div>
          <button onClick={nextSlide} className="text-[#A39E96] hover:text-[#5D574F] transition-all hover:scale-125">
            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PresentationView;
