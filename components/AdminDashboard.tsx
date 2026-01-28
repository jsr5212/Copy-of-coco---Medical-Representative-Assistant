
import React, { useState } from 'react';
import { Company } from '../types';

interface AdminDashboardProps {
  companies: Company[];
  onVerify: (id: string) => void;
  onExit?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ companies, onVerify, onExit }) => {
  const [filter, setFilter] = useState<'ALL' | 'PENDING'>('PENDING');

  const filtered = companies.filter(c => filter === 'ALL' || c.status === 'PENDING');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h2 className="text-4xl font-black text-slate-900">Master Control Panel</h2>
            {onExit && (
              <button 
                onClick={onExit}
                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 flex items-center gap-1"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Exit to User Workspace
              </button>
            )}
          </div>
          <p className="text-slate-500">Sales & IT Administrative Dashboard</p>
        </div>
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button onClick={() => setFilter('PENDING')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'PENDING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>Pending</button>
          <button onClick={() => setFilter('ALL')} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>All Companies</button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registered At</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Management</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(company => (
              <tr key={company.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-6">
                  <div className="font-black text-slate-900">{company.name}</div>
                  <div className="text-xs text-slate-400">{company.sector}</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-sm font-bold text-slate-800">{company.adminName}</div>
                  <div className="text-xs text-slate-400">{company.email}</div>
                </td>
                <td className="px-8 py-6 text-sm text-slate-500">
                  {new Date(company.createdAt).toLocaleDateString()}
                </td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 text-[10px] font-black rounded-lg ${company.status === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    {company.status}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  {company.status === 'PENDING' ? (
                    <button 
                      onClick={() => onVerify(company.id)}
                      className="bg-[#1ec3c3] text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-[#1ec3c3]/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      Verify Company
                    </button>
                  ) : (
                    <button className="text-slate-300 text-xs font-bold px-5 py-2 cursor-not-allowed">Verified</button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-20 text-center text-slate-400 font-bold italic">No pending applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="bg-[#2d2d2d] text-white p-8 rounded-[2.5rem]">
          <div className="text-xs font-black text-white/40 uppercase tracking-widest mb-2">Total Managed</div>
          <div className="text-4xl font-black">{companies.length}</div>
          <div className="text-xs text-white/40 mt-1">Pharmaceutical Entities</div>
        </div>
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm">
          <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Pending Sales</div>
          <div className="text-4xl font-black text-[#1ec3c3]">{companies.filter(c => c.status === 'PENDING').length}</div>
          <div className="text-xs text-slate-400 mt-1">Awaiting Review</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
