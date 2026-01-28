
import React from 'react';
import { VerificationRequest } from '../types';

interface VerificationCenterProps {
  requests: VerificationRequest[];
  onApprove: (requestId: string, level: 'IT' | 'SENIOR') => void;
  onReject: (requestId: string) => void;
  onBack?: () => void;
}

const VerificationCenter: React.FC<VerificationCenterProps> = ({ requests, onApprove, onReject, onBack }) => {
  const pending = requests.filter(r => r.status === 'PENDING');

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <button 
            onClick={onBack}
            className="text-[10px] font-black text-[#1ec3c3] uppercase tracking-widest mb-4 flex items-center gap-2 hover:underline"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Portfolio
          </button>
          <h2 className="text-3xl font-black text-slate-900">Verification Queue</h2>
          <p className="text-slate-500">Dual-level verification required for all data modifications.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {pending.map(req => (
          <div key={req.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest ${
                  req.action === 'DELETE' ? 'bg-red-100 text-red-600' : 
                  req.action === 'UPDATE' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {req.action} REQUEST
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {req.type} ID: {req.entityId}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2">
                {req.proposedData?.brand || req.proposedData?.name || req.originalData?.brand || req.originalData?.name}
              </h3>
              
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Proposed Change</div>
                  <div className="text-slate-600 line-clamp-2">
                    {req.action === 'DELETE' ? 'Complete removal from database' : 'Update values to proposed schema'}
                  </div>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <div className="text-[10px] font-black text-slate-400 uppercase mb-1">Timestamp</div>
                  <div className="text-slate-600">{new Date(req.createdAt).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase">IT Team</span>
                {req.itVerified ? (
                  <span className="text-green-500 flex items-center gap-1 font-bold text-xs">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> Verified
                  </span>
                ) : (
                  <button 
                    onClick={() => onApprove(req.id, 'IT')}
                    className="bg-slate-900 text-white px-4 py-1.5 rounded-lg text-[10px] font-black hover:bg-black transition-all"
                  >
                    Verify Step 1
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-black text-slate-400 uppercase">Senior Admin</span>
                {req.seniorVerified ? (
                  <span className="text-green-500 flex items-center gap-1 font-bold text-xs">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg> Verified
                  </span>
                ) : (
                  <button 
                    disabled={!req.itVerified}
                    onClick={() => onApprove(req.id, 'SENIOR')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                      req.itVerified ? 'bg-[#1ec3c3] text-white hover:bg-[#18a0a0]' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Verify Step 2
                  </button>
                )}
              </div>

              <button 
                onClick={() => onReject(req.id)}
                className="text-red-500 font-bold text-[10px] uppercase tracking-widest hover:text-red-700 transition-colors py-2"
              >
                Reject & Discard
              </button>
            </div>
          </div>
        ))}

        {pending.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-bold">No pending verification requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationCenter;
