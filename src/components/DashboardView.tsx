import React, { useState, useEffect } from 'react';
import { Client, Appointment, Transaction, UserProfile } from '../types';
import { ClinicBranding, PRESET_LOGOS } from './AdminSettingsModal';

interface DashboardViewProps {
  clients: Client[];
  appointments: Appointment[];
  transactions: Transaction[];
  currentUser: UserProfile;
  onSelectClient: (client: Client) => void;
  onOpenNewPatient: () => void;
  onOpenNewPayment: () => void;
  onViewAllClients: () => void;
  onViewAllFinance: () => void;
  onOpenAdminSettings?: () => void;
  branding?: ClinicBranding;
  onUpdateBranding?: (newBranding: ClinicBranding) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  clients,
  appointments,
  transactions,
  currentUser,
  onSelectClient,
  onOpenNewPatient,
  onOpenNewPayment,
  onViewAllClients,
  onViewAllFinance,
  onOpenAdminSettings,
  branding,
  onUpdateBranding,
}) => {
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'surgery' | 'consultation'>('all');
  const [selectedDay, setSelectedDay] = useState('Today (10 Oct 2026)');

  // Metrics calculation
  const totalRevenueEGP = transactions.reduce((acc, t) => acc + t.amountEGP, 0);
  const pendingClearancesCount = clients.filter((c) => !c.medicalHistory.isCleared).length;
  const inSurgeryCount = clients.filter((c) => c.status === 'In Surgery').length;
  const scheduledCount = clients.filter((c) => c.status === 'Cleared' || c.status === 'Consultation').length;

  const filteredAppointments = appointments.filter((apt) => {
    if (scheduleFilter === 'surgery') return apt.type.includes('Surgery');
    if (scheduleFilter === 'consultation') return apt.type === 'Consultation' || apt.type.includes('PRP');
    return true;
  });

  const canViewFinancials = currentUser.role === 'admin' || currentUser.role === 'finance';

  // Admin Clinic Brand & Logo Customization State
  const [clinicNameInput, setClinicNameInput] = useState(branding?.clinicName || 'Novahair');
  const [taglineInput, setTaglineInput] = useState(branding?.tagline || 'Clinical & Enterprise Suite');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (branding) {
      setClinicNameInput(branding.clinicName);
      setTaglineInput(branding.tagline);
    }
  }, [branding]);

  const handleApplyBrandChanges = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!onUpdateBranding || !branding) return;
    onUpdateBranding({
      ...branding,
      clinicName: clinicNameInput.trim() || 'Novahair',
      tagline: taglineInput.trim() || 'Clinical & Enterprise Suite',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSelectPreset = (presetId: string) => {
    if (!onUpdateBranding || !branding) return;
    onUpdateBranding({
      ...branding,
      logoUrl: presetId,
      logoType: 'preset',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDashboardLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateBranding && branding) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please select a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateBranding({
          ...branding,
          logoUrl: reader.result as string,
          logoType: 'custom',
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCurrentLogoIcon = () => {
    if (!branding) return <i className="ri-microscope-line text-teal-400 text-xl"></i>;
    if (branding.logoUrl && (branding.logoUrl.startsWith('http') || branding.logoUrl.startsWith('data:'))) {
      return (
        <img
          src={branding.logoUrl}
          alt={branding.clinicName}
          className="w-full h-full object-cover"
        />
      );
    }
    const matched = PRESET_LOGOS.find((p) => p.id === branding.logoUrl);
    if (matched) {
      return (
        <div className={`w-full h-full ${matched.bg} ${matched.color} flex items-center justify-center text-xl`}>
          <i className={matched.icon}></i>
        </div>
      );
    }
    return <i className="ri-microscope-line text-teal-400 text-xl"></i>;
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / Welcome with Localized Clinic Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {currentUser.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold border border-teal-200/60 dark:border-teal-700/60">
              {currentUser.badge}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Cairo & Mansoura Clinical Theaters · Surgical Shift 08:30 - 18:30 · All sterilization logs verified
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewPatient}
            className="px-3.5 py-2 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
          >
            <i className="ri-user-add-line text-sm text-teal-400 dark:text-teal-100"></i>
            <span>Register Patient</span>
          </button>
          {canViewFinancials ? (
            <button
              onClick={onOpenNewPayment}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <i className="ri-bank-card-line text-sm"></i>
              <span>Record Payment (EGP)</span>
            </button>
          ) : (
            <button
              onClick={onViewAllClients}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
            >
              <i className="ri-user-heart-line text-sm text-teal-600 dark:text-teal-400"></i>
              <span>View Clinical Records</span>
            </button>
          )}

          {currentUser.role === 'admin' && onOpenAdminSettings && (
            <button
              onClick={onOpenAdminSettings}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-200 dark:border-slate-700"
              title="Set Clinic Logo & Custom Branding"
            >
              <i className="ri-palette-line text-sm text-teal-600 dark:text-teal-400"></i>
              <span>Customize Logo & Name</span>
            </button>
          )}
        </div>
      </div>

      {/* Admin Clinic Brand & Logo Customization Console (Visible strictly on Admin Dashboard) */}
      {currentUser.role === 'admin' && branding && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-teal-600 shrink-0 flex items-center justify-center shadow-xs">
                {renderCurrentLogoIcon()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    Clinic Brand & Logo Administration
                  </h2>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-semibold uppercase">
                    Admin Exclusive
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Change your clinic logo and display name visible across top navigation, records, and invoices
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <i className="ri-checkbox-circle-fill text-sm"></i>
                  <span>Updated successfully!</span>
                </span>
              )}
              {onOpenAdminSettings && (
                <button
                  type="button"
                  onClick={onOpenAdminSettings}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                >
                  <i className="ri-settings-4-line text-sm text-teal-600 dark:text-teal-400"></i>
                  <span>Full Brand Studio</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-4">
            {/* Column 1: Preset Emblem Selector + Upload Trigger */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Select Clinic Logo Emblem:
                </span>
                <label className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline cursor-pointer flex items-center gap-1">
                  <i className="ri-upload-2-line"></i>
                  <span>Upload Image (PNG/JPG)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleDashboardLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = branding.logoUrl === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset.id)}
                      className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/80 dark:bg-teal-950/40 ring-1 ring-teal-500 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-7 h-7 rounded-lg ${preset.bg} ${preset.color} flex items-center justify-center text-sm shadow-xs`}
                        >
                          <i className={preset.icon}></i>
                        </div>
                        {isSelected && (
                          <i className="ri-check-line text-xs text-teal-600 dark:text-teal-400 font-bold"></i>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {preset.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Column 2: Edit Name & Sub-Brand Tagline */}
            <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <form onSubmit={handleApplyBrandChanges} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Clinic Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clinicNameInput}
                    onChange={(e) => setClinicNameInput(e.target.value)}
                    placeholder="e.g. Novahair"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sub-Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={taglineInput}
                    onChange={(e) => setTaglineInput(e.target.value)}
                    placeholder="e.g. Clinical & Enterprise Suite"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <i className="ri-check-line"></i>
                  <span>Save Name & Tagline Changes</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 4 Core Executive Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Consultations */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Today's Consultations</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 flex items-center justify-center text-sm">
              <i className="ri-stethoscope-line"></i>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">14</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">patients</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>8 Completed</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">2 In-Clinic Waiting</span>
          </div>
        </div>

        {/* Card 2: Scheduled FUE/DHI Procedures */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Scheduled FUE / DHI</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-sm">
              <i className="ri-hospital-line"></i>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">5</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">surgeries today</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-teal-700 dark:text-teal-400 font-medium">OR 1: 4,400 Grafts Active</span>
            <span>OR 2: 750 Eyebrow</span>
          </div>
        </div>

        {/* Card 3: Today's Revenue (EGP - ج.م) - Restricted to Finance Manager & Executive Admin */}
        {canViewFinancials ? (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">Today's Collections</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center text-sm">
                <i className="ri-wallet-3-line"></i>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {totalRevenueEGP.toLocaleString('en-US')}
              </span>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">EGP (ج.م)</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span>InstaPay + VF Cash</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium font-mono tabular-nums">100% Reconciled</span>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
              <span className="text-xs font-medium">
                {currentUser.role === 'surgeon' ? 'Daily Graft Target' : 'Reception Triage Queue'}
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center text-sm">
                <i className={currentUser.role === 'surgeon' ? 'ri-microscope-line' : 'ri-user-follow-line'}></i>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                {currentUser.role === 'surgeon' ? '12,550' : '6 Queue'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser.role === 'surgeon' ? 'grafts today' : 'intakes pending'}
              </span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                {currentUser.role === 'surgeon' ? 'OR 1 & OR 2 Total' : 'Front Desk Active'}
              </span>
              <span className="text-slate-400 font-mono flex items-center gap-1">
                <i className="ri-lock-line text-[10px]"></i>
                <span>Finance Vault Protected</span>
              </span>
            </div>
          </div>
        )}

        {/* Card 4: Pending Lab / Medical Clearances */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Clearances</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 flex items-center justify-center text-sm">
              <i className="ri-shield-cross-line"></i>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white font-mono tabular-nums">
              {pendingClearancesCount}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">awaiting serology</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="text-amber-600 dark:text-amber-400 font-medium">HBV/HCV + PT/INR</span>
            <span>Pre-op safety rule</span>
          </div>
        </div>
      </div>

      {/* Live Operating Theater Suites Monitor Strip */}
      <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h2 className="text-sm font-bold tracking-tight">Active Surgical Theaters & Precision Suites</h2>
          </div>
          <span className="text-[11px] font-mono text-slate-400">Sterile Air Cleanliness Class ISO 5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* OR 1: Sapphire Mega-Session */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">OR 1 · Sapphire Suite</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-medium">
                  In Surgery (Stage 2)
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">08:30 - 16:30</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-medium text-white">كريم عبد الرحمن / Karim Abdelrahman</span>
              <span className="text-slate-400 font-mono">NH-26-1002</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Technique:</span>
                <span className="text-teal-300 font-medium">Sapphire FUE Mega-Session</span>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="font-mono text-white">4,400 Grafts (Harvested: 4,420)</span>
              </div>
              <div className="flex justify-between">
                <span>Lead Surgeon:</span>
                <span>Dr. Sherif El-Gazzar, MD</span>
              </div>
            </div>
            {/* Live Surgical Stage Progression (Step-based, No fake percentages) */}
            <div className="mt-3 pt-2.5 border-t border-slate-700/60">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-slate-400">Current Phase:</span>
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Ongoing: Step 2 of 3 (Sapphire Canal Incisions)</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-medium">
                <div className="py-1 px-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center justify-center gap-1">
                  <i className="ri-check-line text-xs"></i>
                  <span>1. Extraction (Done)</span>
                </div>
                <div className="py-1 px-1 rounded bg-teal-900/90 text-teal-200 border border-teal-500/80 shadow-xs flex items-center justify-center gap-1">
                  <i className="ri-loader-4-line text-xs animate-spin"></i>
                  <span>2. Canals (Ongoing)</span>
                </div>
                <div className="py-1 px-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 flex items-center justify-center gap-1">
                  <i className="ri-time-line text-xs"></i>
                  <span>3. Placement (Next)</span>
                </div>
              </div>
            </div>
          </div>

          {/* OR 2: DHI Precision */}
          <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-white">OR 2 · DHI Precision Suite</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-medium">
                  Primed & Sterilized
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">15:00 - 18:00</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-medium text-white">هالة الشربيني / Hala El Sherbini</span>
              <span className="text-slate-400 font-mono">NH-26-0914</span>
            </div>
            <div className="text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Procedure:</span>
                <span className="text-teal-300 font-medium">Eyebrow Restoration (Lion Implanter)</span>
              </div>
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="font-mono text-white">750 Micro-Grafts</span>
              </div>
              <div className="flex justify-between">
                <span>Clearance:</span>
                <span className="text-emerald-400 font-medium">All Labs Cleared & Signed</span>
              </div>
            </div>
            {/* Stage Status */}
            <div className="mt-3 pt-2.5 border-t border-slate-700/60">
              <div className="flex items-center justify-between text-[11px] mb-2">
                <span className="text-slate-400">Current Phase:</span>
                <span className="text-teal-300 font-semibold flex items-center gap-1.5">
                  <i className="ri-checkbox-circle-line text-teal-400"></i>
                  <span>Primed for Micro-Extraction</span>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] text-center font-medium">
                <div className="py-1 px-1 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 flex items-center justify-center gap-1">
                  <i className="ri-check-line text-xs"></i>
                  <span>1. Sterilization (Done)</span>
                </div>
                <div className="py-1 px-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 flex items-center justify-center gap-1">
                  <i className="ri-time-line text-xs"></i>
                  <span>2. Harvest (15:00)</span>
                </div>
                <div className="py-1 px-1 rounded bg-slate-800/80 text-slate-400 border border-slate-700/60 flex items-center justify-center gap-1">
                  <i className="ri-time-line text-xs"></i>
                  <span>3. Lion Pens (Next)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Appointment Schedule Timeline & Financial Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Appointment Schedule Calendar */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Today's Clinic & Surgical Timeline</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Interactive theater bookings, triage and consultations</p>
            </div>

            {/* Interactive Filter Buttons */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <button
                onClick={() => setScheduleFilter('all')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  scheduleFilter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                All (6)
              </button>
              <button
                onClick={() => setScheduleFilter('surgery')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  scheduleFilter === 'surgery'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Surgeries
              </button>
              <button
                onClick={() => setScheduleFilter('consultation')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  scheduleFilter === 'consultation'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Consultations
              </button>
            </div>
          </div>

          {/* Timeline Items */}
          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {filteredAppointments.map((apt) => {
              const matchedClient = clients.find((c) => c.id === apt.clientId);
              return (
                <div
                  key={apt.id}
                  onClick={() => matchedClient && onSelectClient(matchedClient)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 rounded-lg cursor-pointer transition-colors group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Time pill */}
                    <div className="text-center w-24 shrink-0 font-mono text-xs">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{apt.time.split(' - ')[0]}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">{apt.duration}</div>
                    </div>

                    {/* Room and Patient */}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {apt.clientNameEn}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                          ({apt.clientNameAr})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="text-teal-700 dark:text-teal-400 font-medium">{apt.type}</span>
                        <span>·</span>
                        <span className="truncate">{apt.room}</span>
                        {apt.graftTarget && (
                          <>
                            <span>·</span>
                            <span className="font-mono">{apt.graftTarget} grafts</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status & Action */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        apt.status === 'In Surgery'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : apt.status === 'Checked In'
                          ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                          : apt.status === 'Completed'
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                          : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {apt.status}
                    </span>
                    <i className="ri-arrow-right-s-line text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors"></i>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">6 procedures booked for Dr. Sherif El-Gazzar</span>
            <button
              onClick={onViewAllClients}
              className="text-teal-700 dark:text-teal-400 hover:text-teal-900 dark:hover:text-teal-300 font-semibold flex items-center gap-1"
            >
              <span>View All Patient Records</span>
              <i className="ri-arrow-right-line text-xs"></i>
            </button>
          </div>
        </div>

        {/* Right Col: Egyptian Payment Reconciliations or Clinical Ops depending on Role */}
        {canViewFinancials ? (
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-sm font-bold text-slate-900">Egyptian Payment Gateway Mix</h2>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-50 text-teal-700 font-mono font-semibold border border-teal-200">
                      Finance Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Collections across local payment channels</p>
                </div>
                <span className="text-xs font-mono text-teal-600 font-bold">EGP (ج.م)</span>
              </div>

              {/* Channels distribution */}
              <div className="space-y-3 mt-4">
                {/* InstaPay */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <i className="ri-flashlight-line text-teal-600"></i>
                      <span>InstaPay Network</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">118,400 ج.م</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full" style={{ width: '47%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Direct CBE Instant Transfer</span>
                    <span>47% of revenue</span>
                  </div>
                </div>

                {/* Vodafone Cash */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <i className="ri-smartphone-line text-red-600"></i>
                      <span>Vodafone Cash</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">55,000 ج.م</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '22%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Smart Wallet Deposits</span>
                    <span>22% of revenue</span>
                  </div>
                </div>

                {/* Visa / CIB Card */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <i className="ri-bank-card-line text-blue-600"></i>
                      <span>Credit / Debit (POS)</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">42,000 ج.م</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full" style={{ width: '17%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>CIB & NBE Merchant Terminal</span>
                    <span>17% of revenue</span>
                  </div>
                </div>

                {/* Front Desk Cash */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                      <i className="ri-cash-line text-emerald-600"></i>
                      <span>Front Desk Cash</span>
                    </span>
                    <span className="font-mono font-bold text-slate-900">36,000 ج.م</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: '14%' }}></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Physical Treasury Inflow</span>
                    <span>14% of revenue</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={onViewAllFinance}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Egyptian Financial Ledger</span>
                <i className="ri-arrow-right-line text-xs"></i>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    {currentUser.role === 'surgeon'
                      ? 'Surgical Theater Consumables & Sterilization'
                      : 'Front Desk Patient Queue & Reception'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {currentUser.role === 'surgeon'
                      ? 'OR instrument readiness & autoclave cycle status'
                      : 'Patient check-in flow & lounge status'}
                  </p>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                  {currentUser.role === 'surgeon' ? 'OR Sterile' : 'Intake Desk'}
                </span>
              </div>

              {/* Operations Breakdown for Clinical/Front Desk */}
              <div className="space-y-3 mt-4">
                {currentUser.role === 'surgeon' ? (
                  <>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-knife-line text-teal-600"></i>
                          <span>Sapphire Micro-Blades (0.80mm)</span>
                        </span>
                        <span className="font-mono text-emerald-700">48 Sterile Units</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Loaded in OR 1 Sapphire Suite</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-syringe-line text-teal-600"></i>
                          <span>Lion/Choi Implanter Pens</span>
                        </span>
                        <span className="font-mono text-emerald-700">16 Sets Ready</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Cleaned & calibrated for OR 2 DHI session</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-test-tube-line text-teal-600"></i>
                          <span>Hypothermosol ATP Solution</span>
                        </span>
                        <span className="font-mono text-teal-800">3,500 mL Cold Stock</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Preserving 4,400 grafts in mega-session</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-shield-check-line text-emerald-600"></i>
                          <span>Class-B Autoclave Sterilizer</span>
                        </span>
                        <span className="font-mono text-emerald-700">Cycle #892 Validated</span>
                      </div>
                      <p className="text-[10px] text-slate-500">134°C · 3.1 bar pressure verification</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-user-line text-teal-600"></i>
                          <span>Waiting in Consultation Lounge</span>
                        </span>
                        <span className="font-mono text-teal-700">2 Patients</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Ahmed El Saadany & Maryam El Shennawy</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-id-card-line text-teal-600"></i>
                          <span>National ID Verifications</span>
                        </span>
                        <span className="font-mono text-emerald-700">7/7 Validated</span>
                      </div>
                      <p className="text-[10px] text-slate-500">14-digit Egyptian formula compliant</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800 mb-1">
                        <span className="flex items-center gap-1.5">
                          <i className="ri-calendar-line text-teal-600"></i>
                          <span>Evening Consultations</span>
                        </span>
                        <span className="font-mono text-slate-800">4 Booked</span>
                      </div>
                      <p className="text-[10px] text-slate-500">Scheduled 16:00 - 18:30</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-[11px] text-amber-900 flex items-center gap-2">
                <i className="ri-lock-line text-amber-700 text-sm shrink-0"></i>
                <span>
                  <strong>Finance Privacy:</strong> Egyptian payment gateway mix and collections are restricted to <strong>Executive Admin</strong> and <strong>Finance Manager</strong> roles.
                </span>
              </div>
              <button
                onClick={onViewAllClients}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Open Patient CRM Hub</span>
                <i className="ri-arrow-right-line text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
