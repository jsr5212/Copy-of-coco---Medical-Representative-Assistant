
import React, { useState, useRef, useMemo, useEffect } from 'react';
import Header from './components/Header';
import ExtractionTable from './components/ExtractionTable';
import PresentationView from './components/PresentationView';
import VoiceAssistant from './components/VoiceAssistant';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import InternalStaffLogin from './components/InternalStaffLogin';
import AdminDashboard from './components/AdminDashboard';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import ITDashboard from './components/ITDashboard';
import SmartAssistant from './components/SmartAssistant';
import TeamManagement from './components/TeamManagement';
import RegionalStrategy from './components/RegionalStrategy';
import EditMedicineModal from './components/EditMedicineModal';
import EditRepModal from './components/EditRepModal';
import VerificationCenter from './components/VerificationCenter';
import SeniorDashboard from './components/SeniorDashboard';
import AppMap from './components/AppMap';
import DoctorSyncPortal from './components/DoctorSyncPortal';
import SyncController from './components/SyncController';
import DoctorManagement from './components/DoctorManagement';
import ClientAdminDashboard from './components/ClientAdminDashboard';
import { MedicineData, AppState, Company, UserRole, MedicalRep, CompanySubView, VerificationRequest, Doctor } from './types';
import { extractMedicineInfo } from './services/geminiService';
import { encryptData, decryptData } from './services/securityService';

const STORAGE_KEY = 'pharma_intel_vault_meds';
const REPS_KEY = 'pharma_intel_vault_reps';
const COMPANIES_KEY = 'pharma_intel_vault_companies';
const CURRENT_USER_KEY = 'pharma_intel_current_user';
const VERIFY_KEY = 'pharma_intel_vault_verify';
const DOCTORS_KEY = 'pharma_intel_vault_doctors';

const MOCK_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Novartis Global',
    adminName: 'Dr. Sarah Smith',
    contact: '+1 234 567 890',
    email: 'sarah.smith@novartis.com',
    sector: 'Oncology',
    status: 'VERIFIED',
    productCount: 142,
    repsCount: 45,
    createdAt: '2024-01-15T10:00:00Z',
    dataSanctityScore: 88,
    subscription: {
      id: 'sub-1', plan: 'ENTERPRISE', status: 'ACTIVE', billingCycle: 'YEARLY', amount: 45000, lastPaymentDate: '2024-01-15', nextPaymentDate: '2025-01-15'
    }
  }
];

const MOCK_DATA: MedicineData[] = [
  { id: 'med-1', brand: 'CardioFlow Plus', division: 'Cardiovascular', specialty: 'Cardiologist', indications: 'Management of hypertension.', dosage: '10mg once daily.', usp: '24-hour control.', targetAudience: 'Senior Consultants', adminLocked: true, itLocked: false, seniorLocked: false }
];

const MOCK_VERIFY: VerificationRequest[] = [
  {
    id: 'req-init-1',
    companyId: 'comp-1',
    type: 'MEDICINE',
    action: 'UPDATE',
    entityId: 'med-1',
    originalData: {
      brand: 'CardioFlow Plus',
      division: 'Cardiovascular',
      specialty: 'Cardiologist',
      indications: 'Management of hypertension.',
      dosage: '10mg once daily.',
      usp: '24-hour control.'
    },
    proposedData: {
       brand: 'CardioFlow Plus',
       division: 'Cardiovascular',
       specialty: 'Cardiologist',
       indications: 'Management of hypertension and Stage II Chronic Heart Failure.',
       dosage: '10mg once daily / 20mg for severe cases.',
       usp: 'Superior 24-hour metabolic stability and pulse regulation.',
       targetAudience: 'Senior Cardiology Consultants'
    },
    itVerified: false,
    seniorVerified: false,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

const MOCK_REPS: MedicalRep[] = [
  { id: 'rep-1', name: 'Sarah Jenkins', email: 's.jenkins@pharma.com', region: 'North Sector', username: 'sarah.j.123', tempPass: 'PHARMA2025', assignedDivisions: ['Cardiovascular'], status: 'ACTIVE', itLocked: false, seniorLocked: false }
];

const MOCK_DOCTORS: Doctor[] = [
  { id: 'doc-1', name: 'Dr. Robert Carter', specialty: 'Cardiology', hospital: 'St. Mary\'s Medical Center', alignedMedicineIds: ['med-1'], lastVisitDate: '2025-02-10', followUpDate: '2025-02-25' }
];

const App: React.FC = () => {
  const [isSecure, setIsSecure] = useState(false);
  const [state, setState] = useState<AppState>('INITIALIZING');
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [data, setData] = useState<MedicineData[]>(MOCK_DATA);
  const [reps, setReps] = useState<MedicalRep[]>(MOCK_REPS);
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>(MOCK_VERIFY);
  
  const [currentUser, setCurrentUser] = useState<{role: UserRole, companyId?: string, name?: string} | null>(null);
  
  const [activeRole, setActiveRole] = useState<UserRole>('GUEST');
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [subView, setSubView] = useState<CompanySubView>('PORTFOLIO');
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<MedicineData | null>(null);
  const [isAddingMedicine, setIsAddingMedicine] = useState(false);
  const [editingRep, setEditingRep] = useState<MedicalRep | null>(null);
  const [showPresentation, setShowPresentation] = useState(false);
  const [presentationData, setPresentationData] = useState<MedicineData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeVault = async () => {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      
      // FORCED LOGIN FOR USER REQUEST: If no user, mock an IT Verifier session
      let user = storedUser ? JSON.parse(storedUser) : {
        role: 'IT_VERIFIER',
        name: 'Technical.Audit.Lead',
        companyId: 'internal'
      };

      const decryptItems = async () => {
        const c = localStorage.getItem(COMPANIES_KEY);
        const d = localStorage.getItem(STORAGE_KEY);
        const r = localStorage.getItem(REPS_KEY);
        const v = localStorage.getItem(VERIFY_KEY);
        const docs = localStorage.getItem(DOCTORS_KEY);

        if (c) setCompanies(await decryptData(c) || MOCK_COMPANIES);
        if (d) setData(await decryptData(d) || MOCK_DATA);
        if (r) setReps(await decryptData(r) || MOCK_REPS);
        // Ensure we keep the mock verify requests for testing if storage is empty
        if (v) {
          const decryptedV = await decryptData(v);
          if (decryptedV && decryptedV.length > 0) setVerificationRequests(decryptedV);
        }
        if (docs) setDoctors(await decryptData(docs) || MOCK_DOCTORS);
      };

      await decryptItems();
      setIsSecure(true);
      
      setCurrentUser(user);
      setActiveRole(user.role);
      
      if (user.role === 'SUPER_ADMIN') {
        setState('SUPER_DASHBOARD');
      } else if (user.role === 'IT_VERIFIER' && user.companyId === 'internal') {
        setState('IT_DASHBOARD');
      } else {
        setState('VIEWING');
      }
    };

    initializeVault();
  }, []);

  useEffect(() => {
    if (!isSecure) return;
    
    const persistVault = async () => {
      localStorage.setItem(COMPANIES_KEY, await encryptData(companies));
      localStorage.setItem(STORAGE_KEY, await encryptData(data));
      localStorage.setItem(REPS_KEY, await encryptData(reps));
      localStorage.setItem(VERIFY_KEY, await encryptData(verificationRequests));
      localStorage.setItem(DOCTORS_KEY, await encryptData(doctors));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
    };

    persistVault();
  }, [companies, data, reps, currentUser, verificationRequests, doctors, isSecure]);

  const handleLogout = () => {
    setCurrentUser(null);
    setState('IDLE');
    setIsViewOnly(false);
    setActiveRole('GUEST');
    localStorage.removeItem(CURRENT_USER_KEY);
    setNotification("Session Terminated Successfully.");
  };

  const navigateHome = () => {
    if (isViewOnly) exitSimulatedMode();
    else {
      if (currentUser?.role === 'SUPER_ADMIN') setState('SUPER_DASHBOARD');
      else if (currentUser?.role === 'IT_VERIFIER' && currentUser.companyId === 'internal') setState('IT_DASHBOARD');
      else {
        setState('VIEWING');
        setSubView('PORTFOLIO');
      }
    }
  };

  const exitSimulatedMode = () => {
    setIsViewOnly(false);
    setActiveRole(currentUser?.role || 'GUEST');
    if (currentUser?.role === 'SUPER_ADMIN') setState('SUPER_DASHBOARD');
    else if (currentUser?.role === 'IT_VERIFIER' && currentUser.companyId === 'internal') setState('IT_DASHBOARD');
    else setState('VIEWING');
    setSubView('PORTFOLIO');
  };

  const enterSimulatedMode = (role: UserRole) => {
    setActiveRole(role);
    setIsViewOnly(true);
    setShowMap(false);
    if (role === 'SUPER_ADMIN') setState('SUPER_DASHBOARD');
    else if (role === 'IT_VERIFIER' && currentUser?.companyId === 'internal') setState('IT_DASHBOARD');
    else {
      setState('VIEWING');
      setSubView('PORTFOLIO');
    }
  };

  const handleApprove = (requestId: string, level: 'IT' | 'SENIOR') => {
    setVerificationRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const updatedReq = { ...req };
        if (level === 'IT') {
          updatedReq.itVerified = true;
          if (updatedReq.type === 'MEDICINE') {
            setData(d => d.map(m => m.id === updatedReq.entityId ? { ...m, itLocked: true } : m));
          } else if (updatedReq.type === 'REPRESENTATIVE') {
            setReps(r => r.map(rep => rep.id === updatedReq.entityId ? { ...rep, itLocked: true } : rep));
          }
          setNotification("Stage 1 Technical Lock applied successfully.");
        }
        if (level === 'SENIOR') {
          updatedReq.seniorVerified = true;
          updatedReq.status = 'APPROVED';
          if (updatedReq.type === 'MEDICINE') {
            if (updatedReq.action === 'UPDATE') {
              setData(d => d.map(m => m.id === updatedReq.entityId ? { ...m, ...updatedReq.proposedData, itLocked: true, seniorLocked: true } : m));
            } else if (updatedReq.action === 'DELETE') {
              setData(d => d.filter(m => m.id !== updatedReq.entityId));
            }
          } else if (updatedReq.type === 'REPRESENTATIVE') {
            if (updatedReq.action === 'UPDATE') {
              setReps(r => r.map(rep => rep.id === updatedReq.entityId ? { ...rep, ...updatedReq.proposedData, itLocked: true, seniorLocked: true } : rep));
            } else if (updatedReq.action === 'DELETE') {
              setReps(r => r.filter(rep => rep.id !== updatedReq.entityId));
            }
          }
          setNotification("Stage 2 Authority Lock complete. Record is now immutable.");
        }
        return updatedReq;
      }
      return req;
    }));
  };

  const handleReject = (requestId: string) => {
    setVerificationRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'REJECTED' as const } : req
    ));
    setNotification("Verification request rejected and discarded.");
  };

  const handleRegisterCompany = (newCompanyData: any) => {
    const newCompany: Company = {
      ...newCompanyData,
      id: `comp-${Date.now()}`,
      status: 'PENDING',
      productCount: 0,
      repsCount: 0,
      createdAt: new Date().toISOString(),
      dataSanctityScore: 100
    };
    setCompanies(prev => [...prev, newCompany]);
    setState('IDLE');
    setNotification("Registration request submitted for verification.");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setState('ANALYZING');
    try {
      const reader = new FileReader();
      const base64 = await new Promise<string>((res, rej) => {
        reader.onload = () => res((reader.result as string).split(',')[1]);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const extracted = await extractMedicineInfo(base64, file.type);
      
      setState('VIEWING');
      setSubView('PORTFOLIO');

      if (extracted && extracted.length > 0) {
        setData(prev => [...prev, ...extracted]);
        setNotification(`Extracted ${extracted.length} brands successfully. You can now lock and assign them for audit.`);
      } else {
        setNotification("No medicines were extracted. Please ensure the PDF contains clinical brand data.");
      }
    } catch (err: any) {
      console.error(err);
      setState('VIEWING');
      setNotification(`Extraction failed: ${err.message || "Unknown error"}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleBulkVerify = (medicineIds: string[]) => {
    setData(prev => prev.map(m => 
      medicineIds.includes(m.id) ? { ...m, adminLocked: true } : m
    ));

    const timestamp = Date.now();
    const newRequests: VerificationRequest[] = medicineIds.map((id, index) => {
      const medicine = data.find(m => m.id === id);
      return {
        id: `req-${timestamp}-${index}`,
        companyId: currentUser?.companyId || 'comp-demo',
        type: 'MEDICINE',
        action: 'UPDATE',
        entityId: id,
        originalData: {},
        proposedData: medicine ? { ...medicine, adminLocked: true } : {},
        itVerified: false,
        seniorVerified: false,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
    });

    setVerificationRequests(prev => [...prev, ...newRequests]);
    setNotification(`${medicineIds.length} clinical records secured by Admin and assigned to IT & Senior Audit.`);
  };

  const handleToggleAdminLock = (medicineId: string, newState: boolean) => {
    setData(prev => prev.map(m => m.id === medicineId ? { ...m, adminLocked: newState } : m));
    
    if (newState) {
      const medicine = data.find(m => m.id === medicineId);
      const newRequest: VerificationRequest = {
        id: `req-${Date.now()}`,
        companyId: currentUser?.companyId || 'comp-demo',
        type: 'MEDICINE',
        action: 'UPDATE',
        entityId: medicineId,
        originalData: {},
        proposedData: medicine ? { ...medicine, adminLocked: true } : {},
        itVerified: false,
        seniorVerified: false,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      setVerificationRequests(prev => [...prev, newRequest]);
      setNotification(`Record "${medicine?.brand}" locked by Admin and assigned for clinical audit.`);
    } else {
      setVerificationRequests(prev => prev.filter(r => !(r.entityId === medicineId && r.status === 'PENDING')));
      setNotification(`Record unlocked. Audit requests withdrawn.`);
    }
  };

  const requestVerification = (type: 'MEDICINE' | 'REPRESENTATIVE', action: 'UPDATE' | 'DELETE', entityId: string, proposedData: any) => {
    const original = type === 'MEDICINE' ? data.find(m => m.id === entityId) : reps.find(r => r.id === entityId);
    const newRequest: VerificationRequest = {
      id: `req-${Date.now()}`,
      companyId: currentUser?.companyId || 'comp-demo',
      type,
      action,
      entityId,
      originalData: original || {},
      proposedData,
      itVerified: false,
      seniorVerified: false,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    setVerificationRequests(prev => [...prev, newRequest]);
    setEditingMedicine(null);
    setEditingRep(null);
    setIsAddingMedicine(false);
  };

  const handleClientLogin = (email: string, pass: string, role: UserRole) => {
    const user = { role, name: email.split('@')[0], companyId: 'comp-1' };
    setCurrentUser(user);
    setActiveRole(role);
    setState('VIEWING');
    setNotification(`Authenticated as ${role.replace('_', ' ')} for Novartis Global.`);
  };

  const followUpDoctors = useMemo(() => {
    return doctors.filter(d => d.followUpDate);
  }, [doctors]);

  if (state === 'INITIALIZING') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="relative"><div className="w-24 h-24 border-2 border-[#1ec3c3]/20 rounded-full animate-ping"></div><div className="absolute inset-0 flex items-center justify-center"><svg className="w-10 h-10 text-[#1ec3c3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg></div></div>
        <h2 className="mt-8 text-sm font-black uppercase tracking-[0.5em] animate-pulse">Decrypting Clinical Vault</h2>
      </div>
    );
  }

  if (state === 'SUPER_DASHBOARD') return <SuperAdminDashboard companies={companies} onExit={handleLogout} />;
  
  if (state === 'IT_DASHBOARD') return (
    <ITDashboard 
      companyName={currentUser?.name || 'Technical Node'} 
      requests={verificationRequests} 
      onApprove={handleApprove} 
      onReject={handleReject} 
      onExit={handleLogout}
      medicines={data}
    />
  );

  const isSenior = activeRole === 'SENIOR_VERIFIER';
  const isAdmin = activeRole === 'ADMIN' || activeRole === 'COMPANY_USER';

  return (
    <div className="min-h-screen bg-slate-50 relative selection:bg-[#1ec3c3] selection:text-white">
      <Header 
        role={activeRole} 
        userName={isViewOnly ? `👀 PREVIEW: ${activeRole}` : currentUser?.name} 
        appState={state} 
        onLogout={handleLogout} 
        onAdmin={() => setState('VIEWING')} 
        onHome={navigateHome}
        onStaffPortal={() => setState('SUPER_LOGIN')}
      />

      {isViewOnly && (
        <div className="bg-blue-600 text-white py-2 px-6 flex items-center justify-between sticky top-[80px] z-[55] shadow-lg">
          <div className="flex items-center gap-3"><div className="animate-pulse w-2 h-2 rounded-full bg-white"></div><span className="text-[10px] font-black uppercase tracking-widest text-white/90">Preview Mode: {activeRole}</span></div>
          <button onClick={exitSimulatedMode} className="bg-white text-blue-600 px-4 py-1 rounded-full text-[10px] font-black hover:bg-blue-50 transition-colors">Exit Preview</button>
        </div>
      )}

      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl animate-in slide-in-from-top-10 flex items-center gap-4">
          <div className="w-2 h-2 rounded-full bg-[#1ec3c3] animate-pulse"></div>
          <span className="font-bold text-xs uppercase tracking-widest">{notification}</span>
          <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 font-black">×</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-12">
        {state === 'IDLE' && (
          <div className="space-y-24 py-10 animate-in fade-in duration-1000">
            <div className="text-center space-y-8 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#1ec3c3]/10 rounded-full blur-[100px] -z-10"></div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">The Intelligence Layer <br/><span className="font-serif italic text-slate-400">for Medical Forces.</span></h1>
              <div className="flex justify-center gap-6 pt-6">
                 <button onClick={() => setState('REGISTERING')} className="bg-[#1ec3c3] text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Register Organization</button>
                 <button onClick={() => setState('LOGIN')} className="bg-slate-900 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-105 transition-all">Client Login</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div onClick={() => setState('LOGIN')} className="group cursor-pointer bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl hover:border-[#1ec3c3] transition-all hover:-translate-y-2">
                <div className="w-20 h-20 bg-slate-900 rounded-[2rem] flex items-center justify-center text-white mb-10"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg></div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Authority Hub</h3>
                <p className="text-slate-400 font-medium">Full tactical oversight. Verify data, manage forces, and strategize regions.</p>
              </div>
              <div onClick={() => setState('DOCTOR_PORTAL')} className="group cursor-pointer bg-white p-12 rounded-[4rem] shadow-xl hover:border-[#1ec3c3] transition-all hover:-translate-y-2">
                <div className="w-20 h-20 bg-[#1ec3c3] rounded-[2rem] flex items-center justify-center text-white mb-10"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg></div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Doctor Sync Portal</h3>
                <p className="text-slate-400 font-medium">Join a synchronized session for a patients-centric clinical briefing.</p>
              </div>
            </div>
          </div>
        )}

        {state === 'REGISTERING' && (
          <RegistrationForm 
            onRegister={handleRegisterCompany} 
            onCancel={() => setState('IDLE')} 
          />
        )}

        {state === 'LOGIN' && <LoginForm onLogin={handleClientLogin} onCancel={() => setState('IDLE')} />}
        
        {state === 'SUPER_LOGIN' && <InternalStaffLogin onLogin={(email, role) => {
          setCurrentUser({ role, name: email.split('@')[0], companyId: 'internal' });
          setActiveRole(role);
          if (role === 'SUPER_ADMIN') setState('SUPER_DASHBOARD');
          else if (role === 'IT_VERIFIER') setState('IT_DASHBOARD');
          else setState('VIEWING');
        }} onCancel={() => setState('IDLE')} />}

        {state === 'VIEWING' && (
          <div className="animate-in fade-in duration-500">
            {isAdmin ? (
              <ClientAdminDashboard 
                userName={currentUser?.name || 'Admin'}
                companyName={currentUser?.companyId === 'comp-1' ? 'Novartis Global' : 'PharmaCorp'}
                data={data}
                reps={reps}
                subView={subView}
                setSubView={setSubView}
                verificationRequests={verificationRequests}
                onFileUpload={handleFileUpload}
                fileInputRef={fileInputRef}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAddMedicine={() => setIsAddingMedicine(true)}
                onEditMedicine={setEditingMedicine}
                onDeleteMedicine={(med) => requestVerification('MEDICINE', 'DELETE', med.id, {})}
                onAddRep={(r) => setReps([...reps, { ...r, id: `rep-${Date.now()}`, username: r.name.toLowerCase().replace(' ', '.'), tempPass: 'PHARMA2025', status: 'ACTIVE', assignedDivisions: [] }])}
                onEditRep={setEditingRep}
                onDeleteRep={(rep) => requestVerification('REPRESENTATIVE', 'DELETE', rep.id, {})}
                onApprove={handleApprove}
                onReject={handleReject}
                onShowPresentation={(sel) => { setPresentationData(sel); setShowPresentation(true); }}
                onShowMap={() => setShowMap(true)}
                activeRole={activeRole}
                onBulkVerify={handleBulkVerify}
                onToggleAdminLock={handleToggleAdminLock}
              />
            ) : isSenior ? (
              <SeniorDashboard 
                companyName={currentUser?.companyId === 'comp-1' ? 'Novartis Global' : 'PharmaCorp'} 
                requests={verificationRequests} 
                medicines={data} 
                reps={reps} 
                onApprove={handleApprove} 
                onReject={handleReject} 
                onBack={() => navigateHome()}
              />
            ) : (
              <div className="space-y-8">
                {/* Field Rep Personalized Header */}
                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-900 overflow-hidden border-4 border-slate-100 shadow-lg p-1">
                      <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.name}`} alt="Avatar" className="rounded-2xl" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                         <h1 className="text-3xl font-black text-slate-900 leading-tight">Welcome, <span className="text-[#1ec3c3]">{currentUser?.name}</span></h1>
                         <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[8px] font-black uppercase tracking-widest border border-slate-200">Field Operations</span>
                      </div>
                      <p className="text-sm text-slate-400 font-medium mt-1 uppercase tracking-[0.2em]">
                        Territory Manager // {currentUser?.companyId === 'comp-1' ? 'Novartis Global' : 'PharmaCorp'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="text-center px-6 py-4 bg-slate-50 rounded-[2rem] border border-slate-100 min-w-[120px]">
                      <div className="text-2xl font-black text-slate-900">{followUpDoctors.length}</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Follow-ups Due</div>
                    </div>
                    <div className="text-center px-6 py-4 bg-slate-50 rounded-[2rem] border border-slate-100 min-w-[120px]">
                      <div className="text-2xl font-black text-slate-900">{doctors.length}</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Managed Nodes</div>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-4 bg-red-50 text-red-600 rounded-[2rem] border border-red-100 text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2 shadow-sm"
                      title="Securely terminate session"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
                      </svg>
                      Exit Vault
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex gap-8">
                    {[
                      { id: 'PORTFOLIO', label: 'Clinical Portfolio' },
                      { id: 'MY_DOCTORS', label: 'HCP Network' },
                      { id: 'FOLLOW_UPS', label: 'Operational Focus' },
                      { id: 'SYNC_CENTER', label: 'Sync Engine' }
                    ].map(tab => (
                      <button 
                        key={tab.id}
                        onClick={() => setSubView(tab.id as any)}
                        className={`text-[10px] font-black uppercase tracking-widest pb-4 border-b-2 transition-all hover:text-slate-900 ${subView === tab.id ? 'border-[#1ec3c3] text-slate-900' : 'border-transparent text-slate-400'}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowMap(true)} className="bg-slate-950 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl active:bg-black">
                    <svg className="w-4 h-4 text-[#1ec3c3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                    Operational Ecosystem
                  </button>
                </div>

                <div className="bg-white rounded-[4rem] p-12 border border-slate-100 shadow-2xl min-h-[600px]">
                  {subView === 'PORTFOLIO' && (
                    <div className="space-y-10">
                      <div className="flex justify-between items-center">
                        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Therapeutic Portfolio</h2>
                        <div className="relative w-[340px]">
                          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                          <input type="text" placeholder="Search brands..." className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                      </div>
                      <ExtractionTable data={data.filter(m => m.brand.toLowerCase().includes(searchTerm.toLowerCase()))} onSelect={(med) => { setPresentationData([med]); setShowPresentation(true); }} onEdit={() => {}} onDelete={() => {}} readOnly={true} />
                    </div>
                  )}

                  {subView === 'MY_DOCTORS' && (
                    <DoctorManagement 
                      doctors={doctors} 
                      medicines={data}
                      onAdd={(d) => setDoctors([...doctors, { ...d, id: `doc-${Date.now()}`, alignedMedicineIds: [] }])}
                      onUpdate={(updated) => setDoctors(doctors.map(d => d.id === updated.id ? updated : d))}
                      onDelete={(id) => setDoctors(doctors.filter(d => d.id !== id))}
                      onPrepareSync={(sel) => { setPresentationData(sel); setShowPresentation(true); }}
                    />
                  )}

                  {subView === 'FOLLOW_UPS' && (
                    <div className="space-y-10">
                      <h2 className="text-4xl font-black text-slate-900 tracking-tight">Priority Operations</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {followUpDoctors.map(doc => (
                          <div key={doc.id} className="p-10 bg-slate-50 rounded-[4rem] border border-slate-200 hover:border-[#1ec3c3]/40 transition-all group hover:bg-white shadow-xl hover:shadow-2xl">
                            <div className="flex items-start justify-between mb-8">
                               <div className="w-14 h-14 rounded-2xl bg-white text-slate-900 flex items-center justify-center font-black text-xl shadow-lg group-hover:scale-110 transition-transform">
                                 {doc.name.charAt(4) || doc.name.charAt(0)}
                               </div>
                               <span className="text-[9px] font-black bg-[#1ec3c3] text-white px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">Action Required</span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2">{doc.name}</h3>
                            <p className="text-xs text-slate-400 font-bold mb-8 uppercase tracking-widest">{doc.specialty} // {doc.hospital}</p>
                            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 mb-8 group-hover:bg-slate-50 transition-colors">
                               <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Target Date</div>
                               <div className="text-lg font-black text-slate-900">{doc.followUpDate}</div>
                            </div>
                            <button onClick={() => { setSubView('MY_DOCTORS') }} className="w-full py-5 bg-slate-950 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-xl">Initiate Contact</button>
                          </div>
                        ))}
                        {followUpDoctors.length === 0 && (
                          <div className="col-span-full py-40 text-center opacity-30 italic font-black text-slate-400 text-2xl uppercase tracking-[0.2em]">Operational Queue Empty</div>
                        )}
                      </div>
                    </div>
                  )}

                  {subView === 'SYNC_CENTER' && <SyncController medicines={data} onLaunchPresentation={(sel) => { setPresentationData(sel); setShowPresentation(true); }} onBack={() => setSubView('PORTFOLIO')} />}
                </div>
              </div>
            )}
          </div>
        )}

        {state === 'DOCTOR_PORTAL' && <DoctorSyncPortal onExit={() => setState('IDLE')} />}
        {state === 'ANALYZING' && (
          <div className="fixed inset-0 z-[200] bg-slate-950/90 backdrop-blur-2xl flex flex-col items-center justify-center text-white">
            <div className="w-64 h-64 border-2 border-[#1ec3c3]/20 rounded-full animate-ping flex items-center justify-center">
               <div className="w-48 h-48 border-2 border-[#1ec3c3]/40 rounded-full animate-pulse flex items-center justify-center">
                  <svg className="w-20 h-20 text-[#1ec3c3]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
               </div>
            </div>
            <h2 className="mt-12 text-xl font-black uppercase tracking-[0.5em] animate-pulse">Neural Extraction in Progress</h2>
            <p className="text-slate-500 mt-4 font-mono text-[10px] uppercase tracking-[0.2em]">Analyzing PDF Topology • Mapping Clinical Vectors</p>
          </div>
        )}
      </main>

      {(editingMedicine || isAddingMedicine) && (
        <EditMedicineModal medicine={editingMedicine || undefined} isNew={isAddingMedicine} onSave={(updated) => {
          if (isAddingMedicine) {
            setData(prev => [...prev, updated]);
            setNotification("Record registered successfully.");
          } else {
            requestVerification('MEDICINE', 'UPDATE', updated.id, updated);
          }
          setEditingMedicine(null);
          setIsAddingMedicine(false);
        }} onClose={() => { setEditingMedicine(null); setIsAddingMedicine(false); }} />
      )}

      {editingRep && (
        <EditRepModal rep={editingRep} onSave={(updated) => requestVerification('REPRESENTATIVE', 'UPDATE', updated.id, updated)} onClose={() => setEditingRep(null)} />
      )}

      {showPresentation && <PresentationView data={presentationData} companyName={currentUser?.name} onClose={() => setShowPresentation(false)} />}
      
      {showMap && <AppMap currentRole={activeRole} onNavigateToView={enterSimulatedMode} onClose={() => setShowMap(false)} />}

      <SmartAssistant role={activeRole} appState={state} />
      <VoiceAssistant isOpen={false} onClose={() => {}} extractedData={data} />
    </div>
  );
};

export default App;
