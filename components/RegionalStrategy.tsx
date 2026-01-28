
import React from 'react';
import { MedicalRep, MedicineData } from '../types';

interface RegionalStrategyProps {
  reps: MedicalRep[];
  data: MedicineData[];
  onUpdateReps: (reps: MedicalRep[]) => void;
}

const RegionalStrategy: React.FC<RegionalStrategyProps> = ({ reps, data, onUpdateReps }) => {
  // Fix: Explicitly type divisions as string[] to resolve 'unknown' type inference from Set/Array.from
  const divisions = Array.from(new Set(data.map(d => d.division))) as string[];

  const toggleDivision = (repId: string, division: string) => {
    const updated = reps.map(r => {
      if (r.id === repId) {
        const has = r.assignedDivisions.includes(division);
        return {
          ...r,
          assignedDivisions: has 
            ? r.assignedDivisions.filter(d => d !== division)
            : [...r.assignedDivisions, division]
        };
      }
      return r;
    });
    onUpdateReps(updated);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-black text-slate-900">Regional Portfolio Mapping</h2>
        <p className="text-slate-500">Assign therapeutic divisions to representatives based on their regional focus.</p>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Representative</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Region</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Divisions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {reps.map(rep => (
              <tr key={rep.id}>
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900">{rep.name}</div>
                  <div className="text-xs text-slate-400">{rep.email}</div>
                </td>
                <td className="px-8 py-6">
                   <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg">{rep.region}</span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex flex-wrap gap-2">
                    {divisions.map(div => (
                      <button
                        key={div}
                        onClick={() => toggleDivision(rep.id, div)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                          rep.assignedDivisions.includes(div)
                            ? 'bg-[#1ec3c3] text-white shadow-md'
                            : 'bg-slate-50 text-slate-400 border border-slate-100 hover:bg-slate-100'
                        }`}
                      >
                        {div}
                      </button>
                    ))}
                    {divisions.length === 0 && <span className="text-xs text-slate-300 italic">No divisions extracted yet.</span>}
                  </div>
                </td>
              </tr>
            ))}
            {reps.length === 0 && (
              <tr>
                <td colSpan={3} className="py-20 text-center text-slate-400 italic">Please add Medical Representatives in the Team tab first.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegionalStrategy;
