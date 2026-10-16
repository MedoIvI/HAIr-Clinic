import React, { useState } from 'react';
import { Client, PaymentMethod, Transaction, UserProfile } from '../types';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  initialClient?: Client | null;
  currentUser: UserProfile;
  onAddTransaction: (transaction: Transaction) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  clients,
  initialClient,
  currentUser,
  onAddTransaction,
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialClient ? initialClient.id : clients[0]?.id || ''
  );
  const [amount, setAmount] = useState<number>(20000);
  const [method, setMethod] = useState<PaymentMethod>('InstaPay');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('Procedure installment deposit');

  if (!isOpen) return null;

  const currentSelectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];
  const remainingDue = currentSelectedClient
    ? currentSelectedClient.totalPriceEGP - currentSelectedClient.paidAmountEGP
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSelectedClient || amount <= 0) return;

    const newTx: Transaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: currentSelectedClient.id,
      clientNameEn: currentSelectedClient.nameEn,
      clientNameAr: currentSelectedClient.nameAr,
      amountEGP: amount,
      method,
      reference:
        reference.trim() ||
        (method === 'InstaPay'
          ? `${currentSelectedClient.nameEn.toLowerCase().replace(/\s+/g, '.')}@instapay`
          : method === 'Vodafone Cash'
          ? `VF-Wallet ${currentSelectedClient.phone.replace(/[^0-9]/g, '')}`
          : method === 'Cash'
          ? `Receipt #CSH-${Math.floor(1000 + Math.random() * 9000)}`
          : `POS Visa Auth #${Math.floor(100000 + Math.random() * 900000)}`),
      status: 'Paid',
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes: notes.trim(),
      receivedBy: `${currentUser.name} (${currentUser.badge})`,
    };

    onAddTransaction(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg font-bold">
              <i className="ri-hand-coin-line"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Record Clinical Payment (تسجيل دفعة نقدية أو إلكترونية)
              </h2>
              <p className="text-xs text-slate-400">InstaPay, Vodafone Cash, POS Terminal & Treasury Cash</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Patient Selection */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Patient (اختر المريض)
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-teal-500 font-medium"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nameEn} ({c.nameAr}) — Remaining: {(c.totalPriceEGP - c.paidAmountEGP).toLocaleString()} ج.م
                </option>
              ))}
            </select>
          </div>

          {/* Current Ledger Preview for Patient */}
          {currentSelectedClient && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between font-mono text-xs">
              <div>
                <span className="text-slate-500 text-[11px] block">TOTAL PROCEDURE FEE</span>
                <span className="font-bold text-slate-800">
                  {currentSelectedClient.totalPriceEGP.toLocaleString()} ج.م
                </span>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <span className="text-slate-500 text-[11px] block">ALREADY PAID</span>
                <span className="font-bold text-emerald-700">
                  {currentSelectedClient.paidAmountEGP.toLocaleString()} ج.م
                </span>
              </div>
              <div className="border-l border-slate-200 pl-3">
                <span className="text-slate-500 text-[11px] block">OUTSTANDING DUE</span>
                <span className={`font-bold ${remainingDue > 0 ? 'text-amber-700' : 'text-slate-400'}`}>
                  {remainingDue.toLocaleString()} ج.م
                </span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Payment Amount (EGP / ج.م) *</label>
              {remainingDue > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(remainingDue)}
                  className="text-teal-700 hover:underline text-[11px] font-semibold"
                >
                  Pay Remaining ({remainingDue.toLocaleString()} ج.م)
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="number"
                required
                min={100}
                value={amount}
                onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
                className="w-full pl-3 pr-16 py-2 border border-slate-200 rounded-lg font-mono text-base font-bold text-slate-900 focus:ring-1 focus:ring-teal-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-slate-500">
                EGP (ج.م)
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Egyptian Payment Channel (وسيلة السداد)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'InstaPay', name: 'InstaPay Network', icon: 'ri-flashlight-line', color: 'text-teal-600' },
                { id: 'Vodafone Cash', name: 'Vodafone Cash', icon: 'ri-smartphone-line', color: 'text-red-600' },
                { id: 'Credit/Debit Card', name: 'Card (POS)', icon: 'ri-bank-card-line', color: 'text-blue-600' },
                { id: 'Cash', name: 'Front Desk Cash', icon: 'ri-cash-line', color: 'text-emerald-600' },
              ].map((m) => {
                const isSelected = method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id as PaymentMethod)}
                    className={`p-2.5 rounded-lg border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50/60 ring-1 ring-teal-500 font-semibold text-slate-900'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <i className={`${m.icon} ${m.color} text-base`}></i>
                    <span className="truncate">{m.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transaction Reference */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Gateway Reference / Bank Transaction ID
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={
                method === 'InstaPay'
                  ? 'e.g. ziad.eldib@instapay (Ref #IP-892401)'
                  : method === 'Vodafone Cash'
                  ? 'e.g. VF-Wallet 01099248812 (Txn #VF-83910)'
                  : method === 'Cash'
                  ? 'e.g. Cash Receipt #CSH-3391'
                  : 'e.g. CIB POS Terminal Auth #559102'
              }
              className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Internal Ledger Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-teal-600 hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <i className="ri-check-double-line"></i>
              <span>Confirm & Post Transaction</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
