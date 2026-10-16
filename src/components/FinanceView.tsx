import React, { useState, useMemo } from 'react';
import { Invoice, Transaction, PaymentMethod, PaymentStatus, Client } from '../types';

interface FinanceViewProps {
  invoices: Invoice[];
  transactions: Transaction[];
  clients: Client[];
  onOpenRecordPayment: () => void;
  onPreviewInvoice: (invoice: Invoice) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  invoices,
  transactions,
  clients,
  onOpenRecordPayment,
  onPreviewInvoice,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'invoices' | 'transactions'>('invoices');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Financial aggregates
  const totalInvoicedEGP = useMemo(() => invoices.reduce((acc, inv) => acc + inv.totalEGP, 0), [invoices]);
  const totalCollectedEGP = useMemo(() => invoices.reduce((acc, inv) => acc + inv.paidAmountEGP, 0), [invoices]);
  const totalPendingEGP = useMemo(() => invoices.reduce((acc, inv) => acc + inv.remainingEGP, 0), [invoices]);

  const instaPayTotal = useMemo(
    () => transactions.filter((t) => t.method === 'InstaPay').reduce((acc, t) => acc + t.amountEGP, 0),
    [transactions]
  );
  const vodafoneCashTotal = useMemo(
    () => transactions.filter((t) => t.method === 'Vodafone Cash').reduce((acc, t) => acc + t.amountEGP, 0),
    [transactions]
  );

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const q = searchTerm.toLowerCase();
      if (q && !inv.id.toLowerCase().includes(q) && !inv.clientNameEn.toLowerCase().includes(q) && !inv.clientNameAr.includes(q)) {
        return false;
      }
      if (methodFilter !== 'all' && inv.paymentMethod !== methodFilter) {
        return false;
      }
      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [invoices, searchTerm, methodFilter, statusFilter]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const q = searchTerm.toLowerCase();
      if (q && !tx.id.toLowerCase().includes(q) && !tx.clientNameEn.toLowerCase().includes(q) && !tx.clientNameAr.includes(q) && !tx.reference.toLowerCase().includes(q)) {
        return false;
      }
      if (methodFilter !== 'all' && tx.method !== methodFilter) {
        return false;
      }
      return true;
    });
  }, [transactions, searchTerm, methodFilter]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              Finance, Billing & Payment Management Module
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 font-mono font-semibold border border-teal-200 dark:border-teal-800">
              EGP / ج.م
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Itemized clinical billing, Egyptian payment gateway reconciliation (InstaPay & Vodafone Cash), and Tax Invoices
          </p>
        </div>

        <button
          onClick={onOpenRecordPayment}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors shrink-0 shadow-sm"
        >
          <i className="ri-hand-coin-line text-sm"></i>
          <span>Record New Transaction / Installment</span>
        </button>
      </div>

      {/* Financial Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Invoiced Billing</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
              {totalInvoicedEGP.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">ج.م</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>6 Active Invoices</span>
            <span className="text-teal-700 dark:text-teal-400 font-medium">100% Tax Compliant</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Total Collections Settled</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold font-mono text-emerald-700 dark:text-emerald-400 tabular-nums">
              {totalCollectedEGP.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">ج.م</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Bank & Cash Vault</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium font-mono">
              {Math.round((totalCollectedEGP / totalInvoicedEGP) * 100)}% Collected
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Pending Receivables (Due)</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold font-mono text-amber-700 dark:text-amber-400 tabular-nums">
              {totalPendingEGP.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">ج.م</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Surgery Day Balances</span>
            <span className="text-amber-700 dark:text-amber-400 font-medium">3 Installments</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">InstaPay + Vodafone Cash</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-bold font-mono text-teal-800 dark:text-teal-300 tabular-nums">
              {(instaPayTotal + vodafoneCashTotal).toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">ج.م</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Egyptian Mobile Wallets</span>
            <span className="text-teal-700 dark:text-teal-400 font-medium font-mono">Real-time Verified</span>
          </div>
        </div>
      </div>

      {/* Filter and Tab Switching Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Segmented Controls for Invoices vs Transactions */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={() => setActiveSubTab('invoices')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'invoices'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="ri-file-list-3-line"></i>
              <span>Patient Invoices ({invoices.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('transactions')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeSubTab === 'transactions'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <i className="ri-history-line"></i>
              <span>Transaction & Deposit Logs ({transactions.length})</span>
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Payment Methods</option>
              <option value="InstaPay">InstaPay Network</option>
              <option value="Vodafone Cash">Vodafone Cash</option>
              <option value="Credit/Debit Card">Credit/Debit Card (POS)</option>
              <option value="Cash">Cash Treasury</option>
            </select>

            {activeSubTab === 'invoices' && (
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="all">All Payment Statuses</option>
                <option value="Paid">Fully Paid (مسدد بالكامل)</option>
                <option value="Partial">Partial / Deposit (دفعة مقدمة)</option>
                <option value="Pending">Pending (معلق)</option>
              </select>
            )}
          </div>
        </div>
      </div>

      {/* Sub-Tab 1: Invoices Table */}
      {activeSubTab === 'invoices' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Invoice # & Date</th>
                  <th className="py-3 px-4">Client Name</th>
                  <th className="py-3 px-4">Clinical Procedure</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid Amount</th>
                  <th className="py-3 px-4">Remaining Balance</th>
                  <th className="py-3 px-4">Payment Method</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    {/* Invoice ID & Date */}
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{inv.id}</div>
                      <div className="text-[10px] text-slate-400">{inv.date}</div>
                    </td>

                    {/* Client */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{inv.clientNameEn}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-arabic">{inv.clientNameAr}</div>
                    </td>

                    {/* Procedure */}
                    <td className="py-3 px-4">
                      <span className="text-slate-800 dark:text-slate-200 line-clamp-1">{inv.procedure}</span>
                    </td>

                    {/* Total EGP */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                      {inv.totalEGP.toLocaleString()} ج.م
                    </td>

                    {/* Paid EGP */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {inv.paidAmountEGP.toLocaleString()} ج.م
                    </td>

                    {/* Remaining */}
                    <td className="py-3 px-4 font-mono">
                      {inv.remainingEGP === 0 ? (
                        <span className="text-slate-400 font-medium">—</span>
                      ) : (
                        <span className="font-bold text-amber-700 dark:text-amber-400 tabular-nums">
                          {inv.remainingEGP.toLocaleString()} ج.م
                        </span>
                      )}
                    </td>

                    {/* Payment Method Badge */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                          inv.paymentMethod === 'InstaPay'
                            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                            : inv.paymentMethod === 'Vodafone Cash'
                            ? 'bg-red-50 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                            : inv.paymentMethod === 'Cash'
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        }`}
                      >
                        <i
                          className={
                            inv.paymentMethod === 'InstaPay'
                              ? 'ri-flashlight-line'
                              : inv.paymentMethod === 'Vodafone Cash'
                              ? 'ri-smartphone-line'
                              : inv.paymentMethod === 'Cash'
                              ? 'ri-cash-line'
                              : 'ri-bank-card-line'
                          }
                        ></i>
                        <span>{inv.paymentMethod}</span>
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${
                          inv.status === 'Paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                            : inv.status === 'Partial'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onPreviewInvoice(inv)}
                        className="px-2.5 py-1.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 text-white rounded-md text-[11px] font-semibold flex items-center gap-1.5 ml-auto transition-colors"
                      >
                        <i className="ri-printer-line"></i>
                        <span>Preview & Print</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 2: Transactions Ledger */}
      {activeSubTab === 'transactions' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Txn ID & Date</th>
                  <th className="py-3 px-4">Patient (AR/EN)</th>
                  <th className="py-3 px-4">Amount Deposited</th>
                  <th className="py-3 px-4">Payment Channel</th>
                  <th className="py-3 px-4">Egyptian Gateway Reference</th>
                  <th className="py-3 px-4">Received By</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <div className="font-bold text-slate-900 dark:text-white">{tx.id}</div>
                      <div className="text-[10px] text-slate-400">{tx.date}</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">{tx.clientNameEn}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-arabic">{tx.clientNameAr}</div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-emerald-700 dark:text-emerald-400 text-sm tabular-nums">
                      +{tx.amountEGP.toLocaleString()} ج.م
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{tx.method}</span>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">
                      <div className="text-[11px] truncate max-w-xs" title={tx.reference}>
                        {tx.reference}
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <span>{tx.receivedBy}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
