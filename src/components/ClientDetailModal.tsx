import React, { useState } from 'react';
import { Client, TreatmentLog, UserProfile } from '../types';

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onAddTreatmentNote: (clientId: string, note: TreatmentLog) => void;
  onUpdateClearance: (clientId: string, field: string, value: boolean) => void;
  onUpdateStatus: (clientId: string, newStatus: Client['status']) => void;
  onOpenInvoiceModal: (client: Client) => void;
  onOpenRecordPayment: (client: Client) => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({
  client,
  isOpen,
  onClose,
  currentUser,
  onAddTreatmentNote,
  onUpdateClearance,
  onUpdateStatus,
  onOpenInvoiceModal,
  onOpenRecordPayment,
}) => {
  const [activeTab, setActiveTab] = useState<'norwood' | 'donor' | 'surgical' | 'medical' | 'media' | 'billing'>('norwood');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteStage, setNewNoteStage] = useState('Clinical Progression');
  const [photoViewMode, setPhotoViewMode] = useState<'side-by-side' | 'before' | 'after'>('side-by-side');

  if (!isOpen || !client) return null;

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const log: TreatmentLog = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      stage: newNoteStage,
      notes: newNoteText.trim(),
      recordedBy: `${currentUser.name} (${currentUser.badge})`,
    };

    onAddTreatmentNote(client.id, log);
    setNewNoteText('');
  };

  const norwoodStages = [
    { name: 'Stage I', desc: 'Minimal hairline recession', male: true },
    { name: 'Stage II', desc: 'Mild temporal recession', male: true },
    { name: 'Stage III', desc: 'Deep fronto-temporal recession', male: true },
    { name: 'Stage III Vertex', desc: 'Recession + crown vertex thinning', male: true },
    { name: 'Stage IV', desc: 'Severe front recession & vertex baldness', male: true },
    { name: 'Stage V', desc: 'Narrow band between front & crown', male: true },
    { name: 'Stage VI', desc: 'Confluent bridge loss', male: true },
    { name: 'Stage VII', desc: 'Extensive horseshoe band', male: true },
    { name: 'Ludwig II (Female)', desc: 'Diffuse central parting widening', male: false },
  ];

  const balanceEGP = client.totalPriceEGP - client.paidAmountEGP;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center text-xl font-bold shrink-0">
              <i className="ri-user-heart-line"></i>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">{client.nameEn}</h2>
                <span className="text-base text-slate-300 font-arabic font-medium">({client.nameAr})</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-teal-300 border border-slate-700">
                  {client.code}
                </span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded font-medium ${
                    client.status === 'In Surgery'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : client.status === 'Cleared'
                      ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap font-mono">
                <span>National ID: {client.nationalId}</span>
                <span>·</span>
                <span>{client.phone}</span>
                <span>·</span>
                <span className="text-slate-300 font-sans">{client.address}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {/* Status Switcher */}
            <select
              value={client.status}
              onChange={(e) => onUpdateStatus(client.id, e.target.value as Client['status'])}
              className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="Consultation">Consultation</option>
              <option value="Cleared">Cleared for Surgery</option>
              <option value="In Surgery">In Surgery (Theater)</option>
              <option value="Post-Op Care">Post-Op Care</option>
              <option value="Completed">Completed</option>
            </select>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 px-5 flex items-center gap-1 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('norwood')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'norwood'
                ? 'border-teal-600 text-teal-800 dark:text-teal-300 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <i className="ri-pulse-line"></i>
            <span>Norwood & Trichoscopy</span>
          </button>
          <button
            onClick={() => setActiveTab('donor')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'donor'
                ? 'border-teal-600 text-teal-800 dark:text-teal-300 font-semibold'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <i className="ri-microscope-line"></i>
            <span>Donor & Scalp Metrics</span>
          </button>
          <button
            onClick={() => setActiveTab('surgical')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'surgical'
                ? 'border-teal-600 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="ri-hospital-line"></i>
            <span>Surgical Plan ({client.surgicalPlan.targetGrafts} Grafts)</span>
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'medical'
                ? 'border-teal-600 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="ri-shield-cross-line"></i>
            <span>Medical History & Clearances</span>
            {!client.medicalHistory.isCleared && (
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'media'
                ? 'border-teal-600 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="ri-image-line"></i>
            <span>Before / After & Clinical Logs ({client.treatmentLogs.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`py-3 px-3.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'billing'
                ? 'border-teal-600 text-teal-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="ri-money-cny-box-line"></i>
            <span>Billing & Invoices (EGP)</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
          {/* TAB 1: Norwood & Hair Loss Assessment */}
          {activeTab === 'norwood' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Current Classification
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                      {client.norwood}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Hamilton-Norwood Clinical Mapping
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Evaluated by {client.assignedDoctor} on {client.consultationDate}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono bg-white px-4 py-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px]">MINIATURIZATION</span>
                    <span className="font-bold text-slate-800">{client.donorMetrics.miniaturizationRate}</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400 block text-[10px]">ANAGEN/TELOGEN</span>
                    <span className="font-bold text-slate-800">88% / 12%</span>
                  </div>
                  <div className="border-l border-slate-200 pl-4">
                    <span className="text-slate-400 block text-[10px]">SCALP STATUS</span>
                    <span className="font-bold text-emerald-700">Healthy / Non-Fibrotic</span>
                  </div>
                </div>
              </div>

              {/* Norwood Visual Grid */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                  Norwood Pattern Reference & Clinical Assessment
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {norwoodStages.map((stage) => {
                    const isSelected = client.norwood === stage.name;
                    return (
                      <div
                        key={stage.name}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500 shadow-sm'
                            : 'bg-white border-slate-200 opacity-75'
                        }`}
                      >
                        <div className="w-10 h-10 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-700 mb-2">
                          <i className={`ri-user-${isSelected ? 'star' : 'line'} text-lg ${isSelected ? 'text-teal-600' : ''}`}></i>
                        </div>
                        <div className="text-xs font-bold text-slate-900">{stage.name}</div>
                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{stage.desc}</p>
                        {isSelected && (
                          <div className="mt-2 text-[10px] font-semibold text-teal-700 bg-teal-100 py-0.5 rounded">
                            Diagnosed Stage
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Diagnostic Notes */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <i className="ri-file-text-line text-teal-600"></i>
                  <span>Trichoscopic Evaluation Summary</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {client.donorMetrics.evaluationNotes}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Donor & Scalp Metrics */}
          {activeTab === 'donor' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Donor Follicular Density
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-2">
                    <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                      {client.donorMetrics.density}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">hairs / cm²</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-2 font-medium">
                    High-density donor reservoir (Occipital peak)
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Hair Caliber & Structure
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-2 font-mono">
                    {client.donorMetrics.caliber}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Favorable cross-sectional surface coverage
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                    Scalp Elasticity & Laxity
                  </span>
                  <div className="text-lg font-bold text-slate-900 mt-2">
                    {client.donorMetrics.laxity} Laxity
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Minimal subdermal resistance during punch insertion
                  </p>
                </div>
              </div>

              {/* Safe Donor Zone (SDZ) Detailed Analysis */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Safe Donor Zone (SDZ) Anatomical Yield
                    </h4>
                    <p className="text-xs text-slate-500">
                      Safe extraction boundary calculation preventing donor over-harvesting
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Total Lifetime Safe Yield</span>
                    <span className="font-mono text-base font-bold text-teal-800">
                      {client.donorMetrics.safeDonorZoneYield.toLocaleString()} Grafts
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <span className="text-xs font-semibold text-slate-800 block mb-1">
                      Occipital Safe Band (Posterior)
                    </span>
                    <p className="text-xs text-slate-600 mb-2">
                      Non-androgen sensitive zone with high double and triple follicular unit density.
                    </p>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Estimated Extraction:</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(client.surgicalPlan.targetGrafts * 0.75)} grafts
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <span className="text-xs font-semibold text-slate-800 block mb-1">
                      Parietal & Temporal Safe Perimeters
                    </span>
                    <p className="text-xs text-slate-600 mb-2">
                      Finer hair calibers reserved strictly for natural hairline transition and feathering.
                    </p>
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-slate-500">Estimated Extraction:</span>
                      <span className="font-bold text-slate-800">
                        {Math.round(client.surgicalPlan.targetGrafts * 0.25)} grafts
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/60 text-xs text-amber-900 flex items-start gap-2">
                  <i className="ri-information-line text-amber-600 mt-0.5"></i>
                  <span>
                    <strong>Post-Session Donor Integrity:</strong> Harvesting {client.surgicalPlan.targetGrafts.toLocaleString()} grafts leaves approximately {(client.donorMetrics.safeDonorZoneYield - client.surgicalPlan.targetGrafts).toLocaleString()} grafts in reserve for any future refinement or crown density touch-ups.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Surgical Plan */}
          {activeTab === 'surgical' && (
            <div className="space-y-6">
              {/* Target Grafts & Breakdown */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                      Assigned Surgical Plan
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {client.procedureType} Protocol
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                      <i className="ri-hospital-line mr-1"></i>
                      {client.surgicalPlan.surgeryTheater}
                    </span>
                    <span className="text-xs text-slate-600 font-medium">
                      Lead: {client.surgicalPlan.leadSurgeon}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Total Target Grafts</span>
                    <span className="text-xl font-bold font-mono text-slate-900">
                      {client.surgicalPlan.targetGrafts.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Single-Hair Units</span>
                    <span className="text-xl font-bold font-mono text-teal-700">
                      {client.surgicalPlan.singleGrafts.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Soft Hairline Edge</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Double-Hair Units</span>
                    <span className="text-xl font-bold font-mono text-slate-800">
                      {client.surgicalPlan.doubleGrafts.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Frontal Core Density</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[11px] text-slate-500 block">Multi-Hair Units</span>
                    <span className="text-xl font-bold font-mono text-slate-800">
                      {client.surgicalPlan.multipleGrafts.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Midscalp / Vertex Mass</span>
                  </div>
                </div>
              </div>

              {/* Surgical Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Extraction & Micro-Incision Tools
                  </h4>
                  <p className="text-xs text-slate-700 font-mono">
                    {client.surgicalPlan.extractionTechnique}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Custom sapphire micro-blade geometry (0.80mm - 0.85mm) ensures minimal tissue displacement, zero lateral skin damage, and ultra-rapid vascularization.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Anesthesia & Comfort Protocol
                  </h4>
                  <p className="text-xs text-slate-700 font-mono">
                    {client.surgicalPlan.anesthesia}
                  </p>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Needleless pressure injection followed by buffered tumescent solution prevents operative discomfort and maintains physiological hemodynamic stability.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Anatomical Hairline Design Blueprint
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {client.surgicalPlan.hairlineDesign}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Medical History & Clearances */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              {/* Clearance Status Card */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Pre-Operative Safety & Infectious Clearances Panel
                    </h3>
                    <p className="text-xs text-slate-500">
                      Mandated by Egyptian Ministry of Health & Novahair Surgical Standards
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      client.medicalHistory.isCleared
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {client.medicalHistory.isCleared ? 'Medically Cleared' : 'Clearance Pending'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                  {/* CBC */}
                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Complete Blood Count (CBC)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Platelets, Hb & WBC</span>
                    </div>
                    <button
                      onClick={() => onUpdateClearance(client.id, 'cbc', !client.medicalHistory.clearances.cbc)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        client.medicalHistory.clearances.cbc
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <i className={client.medicalHistory.clearances.cbc ? 'ri-check-line' : 'ri-close-line'}></i>
                    </button>
                  </div>

                  {/* HBV / HCV / HIV */}
                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Viral Serology (HBV/HCV/HIV)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Triple Viral Screening</span>
                    </div>
                    <button
                      onClick={() => onUpdateClearance(client.id, 'hbv_hcv_hiv', !client.medicalHistory.clearances.hbv_hcv_hiv)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        client.medicalHistory.clearances.hbv_hcv_hiv
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <i className={client.medicalHistory.clearances.hbv_hcv_hiv ? 'ri-check-line' : 'ri-close-line'}></i>
                    </button>
                  </div>

                  {/* PT / INR */}
                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Coagulation Profile (PT/INR)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Bleeding / Clotting Time</span>
                    </div>
                    <button
                      onClick={() => onUpdateClearance(client.id, 'pt_inr', !client.medicalHistory.clearances.pt_inr)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        client.medicalHistory.clearances.pt_inr
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <i className={client.medicalHistory.clearances.pt_inr ? 'ri-check-line' : 'ri-close-line'}></i>
                    </button>
                  </div>

                  {/* ECG */}
                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Electrocardiogram (ECG)</span>
                      <span className="text-[10px] text-slate-500 font-mono">Cardiac Rhythm Clearance</span>
                    </div>
                    <button
                      onClick={() => onUpdateClearance(client.id, 'ecg', !client.medicalHistory.clearances.ecg)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        client.medicalHistory.clearances.ecg
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <i className={client.medicalHistory.clearances.ecg ? 'ri-check-line' : 'ri-close-line'}></i>
                    </button>
                  </div>

                  {/* Glucose */}
                  <div className="p-3 rounded-lg border border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">Fasting Blood Glucose</span>
                      <span className="text-[10px] text-slate-500 font-mono">Diabetic Screening</span>
                    </div>
                    <button
                      onClick={() => onUpdateClearance(client.id, 'glucose', !client.medicalHistory.clearances.glucose)}
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-colors ${
                        client.medicalHistory.clearances.glucose
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <i className={client.medicalHistory.clearances.glucose ? 'ri-check-line' : 'ri-close-line'}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Anamnesis / Medical History Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Blood Group & Allergies
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Blood Type:</span>
                    <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-mono font-bold text-xs">
                      {client.medicalHistory.bloodType}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Drug Allergies:</span>
                    <div className="flex flex-wrap gap-1">
                      {client.medicalHistory.allergies.map((allergy, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Chronic Conditions & Medications
                  </span>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Chronic Illnesses:</span>
                    <p className="text-xs text-slate-700">{client.medicalHistory.chronicConditions.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Current Medications:</span>
                    <p className="text-xs text-slate-700">{client.medicalHistory.medications.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Before / After Media & Clinical Logs */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              {/* Photo Comparison Module */}
              <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Trichoscopy & Clinical Photographic Progression
                    </h3>
                    <p className="text-xs text-slate-400">
                      Standardized medical clinical lighting & macro lens angles
                    </p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                    <button
                      onClick={() => setPhotoViewMode('side-by-side')}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        photoViewMode === 'side-by-side'
                          ? 'bg-slate-700 text-white font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Side by Side
                    </button>
                    <button
                      onClick={() => setPhotoViewMode('before')}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        photoViewMode === 'before'
                          ? 'bg-slate-700 text-white font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pre-Op Only
                    </button>
                    <button
                      onClick={() => setPhotoViewMode('after')}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        photoViewMode === 'after'
                          ? 'bg-slate-700 text-white font-medium'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Post-Op Result
                    </button>
                  </div>
                </div>

                {client.photos && client.photos.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(photoViewMode === 'side-by-side' || photoViewMode === 'before') && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                          <img
                            src={client.photos[0].preOpUrl}
                            alt="Pre-Op Baseline"
                            className="w-full h-64 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-1 rounded">
                            Baseline / Pre-Op
                          </div>
                        </div>
                      )}

                      {(photoViewMode === 'side-by-side' || photoViewMode === 'after') && (
                        <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-950">
                          <img
                            src={client.photos[0].postOpUrl}
                            alt="Post-Op Clinical Result"
                            className="w-full h-64 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-2 left-2 bg-teal-900/80 backdrop-blur-xs text-teal-200 text-[11px] font-semibold px-2 py-1 rounded">
                            Clinical Result ({client.photos[0].timeframe})
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 italic text-center pt-1">
                      {client.photos[0].notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Treatment Progression Timeline */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900">
                  Clinical Session Logs & Surgeon Notes
                </h3>

                <div className="space-y-3">
                  {client.treatmentLogs.map((log) => (
                    <div key={log.id} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-teal-800">{log.stage}</span>
                        <span className="font-mono text-slate-400">{log.date}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{log.notes}</p>
                      <div className="text-[10px] text-slate-400 pt-1">
                        Recorded by: {log.recordedBy}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form to append new clinical note */}
                <form onSubmit={handleCreateNote} className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800">Add Clinical Progress Entry:</span>
                    <select
                      value={newNoteStage}
                      onChange={(e) => setNewNoteStage(e.target.value)}
                      className="text-xs px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-md"
                    >
                      <option value="Surgical Milestone">Surgical Milestone</option>
                      <option value="1-Month Follow-up">1-Month Follow-up</option>
                      <option value="3-Month Neovascularization">3-Month Neovascularization</option>
                      <option value="6-Month Density Check">6-Month Density Check</option>
                      <option value="Trichoscopy Evaluation">Trichoscopy Evaluation</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    placeholder="Enter clinical observations, graft survival indicators, or post-operative instructions..."
                    className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none"
                  ></textarea>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!newNoteText.trim()}
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <i className="ri-save-line text-teal-400"></i>
                      <span>Record Clinical Note</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: Billing & Invoices */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="bg-white p-5 rounded-xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Patient Financial Ledger (EGP / ج.م)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Surgical fees, consumables, and localized payments (InstaPay / Vodafone Cash)
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenRecordPayment(client)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <i className="ri-hand-coin-line"></i>
                      <span>Record Installment</span>
                    </button>
                    <button
                      onClick={() => onOpenInvoiceModal(client)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <i className="ri-printer-line"></i>
                      <span>Preview Official Invoice</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono">
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Invoiced Amount</span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums">
                      {client.totalPriceEGP.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Total Collected Payments</span>
                    <span className="text-xl font-bold text-emerald-700 tabular-nums">
                      {client.paidAmountEGP.toLocaleString()} ج.م
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">Outstanding Balance</span>
                    <span className={`text-xl font-bold tabular-nums ${balanceEGP === 0 ? 'text-slate-500' : 'text-amber-700'}`}>
                      {balanceEGP.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Record Synchronized with Central Novahair Vault</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInvoiceModal(client)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 font-medium transition-colors"
            >
              <i className="ri-file-pdf-line text-rose-600 mr-1"></i>
              Official Tax Invoice
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
