
import React from 'react';
import { MedicineData } from '../types';

interface ExtractionTableProps {
  data: MedicineData[];
  onSelect: (item: MedicineData) => void;
  onEdit: (item: MedicineData) => void;
  onDelete: (item: MedicineData) => void;
  readOnly?: boolean;
}

const ExtractionTable: React.FC<ExtractionTableProps> = ({ data, onSelect, onEdit, onDelete, readOnly = false }) => {
  const LockIcon = ({ isLocked, label }: { isLocked: boolean; label: string }) => (
    <div className="flex items-center gap-1 group/lock px-2 py-1 rounded-md bg-slate-50 border border-slate-100/50 shadow-sm">
      <div className={`transition-all duration-500 ${isLocked ? 'text-blue-600' : 'text-slate-300'}`}>
        {isLocked ? (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
          </svg>
        )}
      </div>
      <span className="text-[7px] font-black uppercase tracking-widest opacity-60 group-hover/lock:opacity-100 transition-opacity whitespace-nowrap">{label}</span>
    </div>
  );

  return (
    <div className="overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
      <table className="min-w-full divide-y divide-slate-50">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Detail</th>
            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status</th>
            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Therapeutic Area</th>
            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Indication Summary</th>
            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50/80 transition-all group cursor-pointer">
              <td className="px-8 py-6 whitespace-nowrap" onClick={() => onSelect(item)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 transition-all group-hover:shadow-md">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.brand} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="text-xs font-black text-slate-300">{item.brand.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <div className="text-base font-black text-slate-900 leading-none">{item.brand}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-tight">{item.division}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6 whitespace-nowrap">
                <div className="flex gap-2">
                  <LockIcon isLocked={!!item.itLocked} label="IT LOCK" />
                  <LockIcon isLocked={!!item.seniorLocked} label="SENIOR LOCK" />
                </div>
              </td>
              <td className="px-8 py-6 whitespace-nowrap" onClick={() => onSelect(item)}>
                <span className="px-3 py-1.5 text-[10px] font-black rounded-lg bg-slate-100 text-slate-500 uppercase">
                  {item.specialty}
                </span>
              </td>
              <td className="px-8 py-6" onClick={() => onSelect(item)}>
                <div className="text-sm text-slate-600 font-medium line-clamp-1 italic">
                   {item.indications}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-2">
                  {!readOnly && (
                    <>
                      <button 
                        disabled={!!item.seniorLocked}
                        onClick={(e) => { e.stopPropagation(); onEdit(item); }}
                        className={`p-2.5 rounded-xl transition-all ${item.seniorLocked ? 'text-slate-200 cursor-not-allowed' : 'bg-slate-100 text-slate-600 opacity-0 group-hover:opacity-100 hover:bg-slate-200 hover:text-slate-900 active:scale-90'}`}
                        title={item.seniorLocked ? "Immutable (Senior Locked)" : "Edit Product"}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        disabled={!!item.seniorLocked}
                        onClick={(e) => { e.stopPropagation(); onDelete(item); }}
                        className={`p-2.5 rounded-xl transition-all ${item.seniorLocked ? 'text-slate-100 cursor-not-allowed' : 'bg-red-50 text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-600 active:scale-90'}`}
                        title={item.seniorLocked ? "Immutable (Senior Locked)" : "Delete Product"}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); onSelect(item); }}
                    className="bg-slate-900 text-white p-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-90"
                    title="View Details"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExtractionTable;
