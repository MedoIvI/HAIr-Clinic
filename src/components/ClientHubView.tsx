import React, { useState, useMemo } from 'react';
import { Client, ProcedureType, ClientStatus } from '../types';

interface ClientHubViewProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onOpenNewPatient: () => void;
  onOpenPaymentForClient: (client: Client) => void;
  globalSearchQuery?: string;
}

export const ClientHubView: React.FC<ClientHubViewProps> = ({
  clients,
  onSelectClient,
  onOpenNewPatient,
  onOpenPaymentForClient,
  globalSearchQuery = '',
}) => {
  const [search, setSearch] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedGov, setSelectedGov] = useState<string>('all');

  const effectiveSearch = globalSearchQuery || search;

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // Search matching Arabic name, English name, National ID, Phone, Address, Code
      const query = effectiveSearch.toLowerCase().trim();
      if (query) {
        const matchNameEn = client.nameEn.toLowerCase().includes(query);
        const matchNameAr = client.nameAr.includes(query);
        const matchNatId = client.nationalId.includes(query);
        const matchPhone = client.phone.toLowerCase().includes(query);
        const matchGov = client.governorate.toLowerCase().includes(query);
        const matchCode = client.code.toLowerCase().includes(query);
        if (!matchNameEn && !matchNameAr && !matchNatId && !matchPhone && !matchGov && !matchCode) {
          return false;
        }
      }

      // Procedure filter
      if (selectedProcedure !== 'all' && client.procedureType !== selectedProcedure) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && client.status !== selectedStatus) {
        return false;
      }

      // Governorate filter
      if (selectedGov !== 'all' && client.governorateCode !== selectedGov) {
        return false;
      }

      return true;
    });
  }, [clients, effectiveSearch, selectedProcedure, selectedStatus, selectedGov]);

  const procedureOptions: ProcedureType[] = [
    'Sapphire FUE',
    'DHI Micro-Choi',
    'Beard & Mustache',
    'Eyebrow Restoration',
    'Stem Cell & PRP Therapy',
  ];

  const statusOptions: ClientStatus[] = [
    'Consultation',
    'Cleared',
    'In Surgery',
    'Post-Op Care',
    'Completed',
  ];

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
      {/* Header & Intake Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Egyptian Client CRM & Clinical Records Hub
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono font-medium">
              {clients.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Biometric donor records, 14-digit National IDs, and localized medical documentation
          </p>
        </div>

        <button
          onClick={onOpenNewPatient}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <i className="ri-user-add-line text-sm"></i>
          <span>Register New Patient (تسجيل مريض جديد)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 transition-colors">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Arabic name (زياد / طارق), English name, 14-digit National ID, or Phone..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>

          {/* Procedure Type Filter */}
          <div className="w-full md:w-56 shrink-0">
            <select
              value={selectedProcedure}
              onChange={(e) => setSelectedProcedure(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Procedures (جميع التقنيات)</option>
              {procedureOptions.map((proc) => (
                <option key={proc} value={proc}>
                  {proc}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Clinical Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {/* Governorate Filter */}
          <div className="w-full md:w-44 shrink-0">
            <select
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Governorates</option>
              <option value="01">Cairo (القاهرة)</option>
              <option value="02">Alexandria (الإسكندرية)</option>
              <option value="12">Dakahlia (الدقهلية - المنصورة)</option>
              <option value="21">Giza (الجيزة)</option>
            </select>
          </div>
        </div>

        {/* Quick filter pills */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pt-1">
          <span className="font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">Quick Views:</span>
          <button
            onClick={() => {
              setSelectedStatus('In Surgery');
              setSelectedProcedure('all');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
              selectedStatus === 'In Surgery'
                ? 'bg-emerald-600 text-white font-medium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            In Operating Theater
          </button>
          <button
            onClick={() => {
              setSelectedProcedure('Sapphire FUE');
              setSelectedStatus('all');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
              selectedProcedure === 'Sapphire FUE'
                ? 'bg-teal-700 text-white font-medium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Sapphire FUE Mega-Sessions
          </button>
          <button
            onClick={() => {
              setSelectedGov('12');
              setSelectedProcedure('all');
              setSelectedStatus('all');
            }}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition-colors ${
              selectedGov === '12'
                ? 'bg-slate-800 text-white font-medium'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Dakahlia / Mansoura Patients
          </button>
          {(selectedProcedure !== 'all' || selectedStatus !== 'all' || selectedGov !== 'all' || search) && (
            <button
              onClick={() => {
                setSelectedProcedure('all');
                setSelectedStatus('all');
                setSelectedGov('all');
                setSearch('');
              }}
              className="text-xs text-rose-600 dark:text-rose-400 hover:underline font-medium ml-auto whitespace-nowrap"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main CRM Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Client (Arabic & English)</th>
                <th className="py-3 px-4">Egyptian National ID</th>
                <th className="py-3 px-4">Contact & Governorate</th>
                <th className="py-3 px-4">Norwood Scale & Grafts</th>
                <th className="py-3 px-4">Procedure & Room</th>
                <th className="py-3 px-4">Billing Status (EGP)</th>
                <th className="py-3 px-4">Clinical Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 dark:text-slate-500">
                    <i className="ri-folder-user-line text-4xl block mb-2 text-slate-300 dark:text-slate-600"></i>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No matching Egyptian client records found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try modifying your search term or filter parameters</p>
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const balanceEGP = client.totalPriceEGP - client.paidAmountEGP;
                  return (
                    <tr
                      key={client.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors group cursor-pointer"
                      onClick={() => onSelectClient(client)}
                    >
                      {/* Client Name */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center shrink-0">
                            {client.gender === 'female' ? '♀' : '♂'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                              {client.nameEn}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-arabic font-medium">
                              {client.nameAr}
                            </div>
                            <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                              {client.code}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Egyptian National ID */}
                      <td className="py-3 px-4 font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                            {client.nationalId}
                          </span>
                          <i className="ri-shield-check-line text-emerald-600 dark:text-emerald-400 text-xs" title="14-Digit Format Validated"></i>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>Age {client.age}</span>
                          <span className="mx-1">·</span>
                          <span>Gov: {client.governorateCode}</span>
                        </div>
                      </td>

                      {/* Phone & Governorate */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-700 dark:text-slate-300">{client.phone}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs" title={client.address}>
                          {client.governorate}
                        </div>
                      </td>

                      {/* Norwood & Grafts */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{client.norwood}</div>
                        <div className="text-[11px] font-mono text-teal-700 dark:text-teal-400 font-medium">
                          {client.surgicalPlan.targetGrafts.toLocaleString()} Grafts
                        </div>
                      </td>

                      {/* Procedure & Room */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{client.procedureType}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {client.surgicalPlan.surgeryTheater}
                        </div>
                      </td>

                      {/* Billing Status */}
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900 dark:text-white tabular-nums">
                          {client.totalPriceEGP.toLocaleString()} ج.م
                        </div>
                        <div className="text-[10px] mt-0.5">
                          {balanceEGP === 0 ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">Settled in Full</span>
                          ) : (
                            <span className="text-amber-700 dark:text-amber-400 font-medium">
                              {balanceEGP.toLocaleString()} ج.م Due
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Clinical Status */}
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                            client.status === 'In Surgery'
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                              : client.status === 'Cleared'
                              ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                              : client.status === 'Post-Op Care'
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                              : client.status === 'Completed'
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                              : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onSelectClient(client)}
                            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-teal-700 dark:hover:text-teal-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="Open Detailed Clinical Record"
                          >
                            <i className="ri-folder-open-line text-sm"></i>
                          </button>
                          <button
                            onClick={() => onOpenPaymentForClient(client)}
                            className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                            title="Record Payment / View Invoices"
                          >
                            <i className="ri-bank-card-line text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer summary */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <span>
            Showing <strong className="text-slate-800">{filteredClients.length}</strong> of {clients.length} Egyptian patients
          </span>
          <span className="font-mono text-[11px]">
            National ID Algorithm: Modulo-11 Egyptian Civil Registry Compliant
          </span>
        </div>
      </div>
    </div>
  );
};
