import React from 'react';
import { Client, UserProfile } from '../types';

interface ClearancesViewProps {
  clients: Client[];
  currentUser: UserProfile;
  onSelectClient: (client: Client) => void;
  onUpdateClearance: (clientId: string, field: string, value: boolean) => void;
  onCertifyClearance: (clientId: string) => void;
}

export const ClearancesView: React.FC<ClearancesViewProps> = ({
  clients,
  currentUser,
  onSelectClient,
  onUpdateClearance,
  onCertifyClearance,
}) => {
  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Clinical & Infectious Pre-Operative Clearances
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-semibold border border-rose-200 dark:border-rose-800">
              Mandatory Safety Protocol
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Triple viral serology (HBV, HCV, HIV), coagulation profile (PT/INR), and cardiac risk stratification
          </p>
        </div>
      </div>

      {/* Grid of Patients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {clients.map((client) => {
          const { clearances, isCleared } = client.medicalHistory;

          return (
            <div
              key={client.id}
              className={`p-5 rounded-xl border transition-all ${
                isCleared
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  : 'bg-rose-50/30 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 ring-1 ring-rose-200 dark:ring-rose-900/40'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">{client.nameEn}</h3>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-arabic">({client.nameAr})</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    <span>ID: {client.nationalId}</span>
                    <span className="mx-1">·</span>
                    <span>Blood: {client.medicalHistory.bloodType}</span>
                  </div>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-bold ${
                    isCleared
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                      : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                  }`}
                >
                  {isCleared ? 'Cleared for OR' : 'Labs Pending'}
                </span>
              </div>

              {/* Lab Panel Checklist */}
              <div className="space-y-2 text-xs pt-1">
                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Triple Serology (HBV, HCV, HIV)</span>
                  <button
                    onClick={() => onUpdateClearance(client.id, 'hbv_hcv_hiv', !clearances.hbv_hcv_hiv)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      clearances.hbv_hcv_hiv
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {clearances.hbv_hcv_hiv ? 'Negative (Cleared)' : 'Pending Test'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Coagulation Profile (PT / INR)</span>
                  <button
                    onClick={() => onUpdateClearance(client.id, 'pt_inr', !clearances.pt_inr)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      clearances.pt_inr
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {clearances.pt_inr ? 'Normal Range' : 'Pending Test'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="font-medium text-slate-700 dark:text-slate-300">12-Lead Electrocardiogram (ECG)</span>
                  <button
                    onClick={() => onUpdateClearance(client.id, 'ecg', !clearances.ecg)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      clearances.ecg
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {clearances.ecg ? 'Sinus Rhythm' : 'Pending ECG'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Complete Blood Count (CBC)</span>
                  <button
                    onClick={() => onUpdateClearance(client.id, 'cbc', !clearances.cbc)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      clearances.cbc
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                  >
                    {clearances.cbc ? 'Verified' : 'Pending'}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => onSelectClient(client)}
                  className="text-xs text-teal-600 dark:text-teal-400 font-semibold hover:underline flex items-center gap-1"
                >
                  <i className="ri-folder-open-line"></i>
                  <span>Full Medical Chart</span>
                </button>

                {!isCleared && (
                  <button
                    onClick={() => onCertifyClearance(client.id)}
                    className="px-3 py-1 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <i className="ri-shield-check-line text-emerald-400"></i>
                    <span>Sign & Certify for OR</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
