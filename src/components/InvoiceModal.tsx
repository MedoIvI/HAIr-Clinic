import React from 'react';
import { Invoice } from '../types';

interface InvoiceModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, isOpen, onClose }) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]">
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <i className="ri-file-text-line text-teal-400 text-lg"></i>
            <span className="text-xs font-bold tracking-tight">Official Egyptian Tax Invoice & Receipt</span>
            <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
              {invoice.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <i className="ri-printer-line"></i>
              <span>Print / Save PDF (طباعة الفاتورة)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 bg-white" id="printable-invoice">
          {/* Clinic Header */}
          <div className="flex flex-col sm:flex-row items-start justify-between border-b-2 border-slate-900 pb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-teal-400 flex items-center justify-center text-xl font-bold">
                  <i className="ri-microscope-line"></i>
                </div>
                <div>
                  <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Novahair Clinical Suite</h1>
                  <p className="text-xs text-slate-500 font-medium">نوفاهير لجراحة وتجميل وزراعة الشعر الميكروسكوبية</p>
                </div>
              </div>
              <div className="mt-3 text-[11px] text-slate-600 space-y-0.5">
                <p>Cairo Hub: Sector 1, North 90th St, New Cairo (التجمع الخامس، القاهرة)</p>
                <p>Delta Center: El-Gomhoria St, Mansoura (شارع الجمهورية، المنصورة)</p>
                <p className="font-mono">Commercial Reg (س.ت): 18492 · Tax Card (بطاقة ضريبية): 592-814-201</p>
              </div>
            </div>

            <div className="text-left sm:text-right font-mono">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                Official Clinical Invoice
              </span>
              <div className="text-lg font-bold text-slate-900 mt-2">{invoice.id}</div>
              <div className="text-xs text-slate-500">Date: {invoice.date}</div>
              <div className="text-xs text-slate-500">MOH Clearance Reg #NH-EG-2026</div>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Patient Information / بيانات المريض
              </span>
              <p className="text-sm font-bold text-slate-900">{invoice.clientNameEn}</p>
              <p className="text-xs font-arabic font-semibold text-slate-700">{invoice.clientNameAr}</p>
              <div className="mt-2 space-y-0.5 font-mono text-[11px] text-slate-600">
                <p>
                  <strong className="text-slate-800">Egyptian National ID:</strong> {invoice.clientNationalId}
                </p>
                <p>
                  <strong className="text-slate-800">Mobile:</strong> {invoice.clientPhone}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Procedure & Payment Method
              </span>
              <p className="font-semibold text-slate-800">{invoice.procedure}</p>
              <p className="text-slate-600 mt-1 font-sans">{invoice.clientAddress}</p>
              <div className="mt-2 text-[11px]">
                <span className="font-semibold text-slate-700">Settlement Channel: </span>
                <span className="font-mono px-2 py-0.5 rounded bg-white border border-slate-200 font-semibold text-slate-800">
                  {invoice.paymentMethod}
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">Item Description (الوصف الطبي)</th>
                  <th className="py-2.5 px-3 text-center">Qty / Grafts</th>
                  <th className="py-2.5 px-3 text-right">Unit Price (EGP)</th>
                  <th className="py-2.5 px-3 text-right">Total (ج.م)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{item.description}</div>
                      <div className="text-[11px] text-slate-500 font-arabic">{item.descriptionAr}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-medium text-slate-800">
                      {item.quantity.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-700 tabular-nums">
                      {item.unitPriceEGP.toLocaleString()} ج.م
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {item.totalEGP.toLocaleString()} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t-2 border-slate-300 pt-4 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-xs text-slate-600 max-w-sm space-y-1">
              <p className="font-semibold text-slate-800">Payment Notes & Reconciliations:</p>
              <p className="font-mono text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                {invoice.notes || 'Verified through Central Bank of Egypt electronic payment framework.'}
              </p>
              <p className="text-[10px] text-slate-400 italic">
                * Medical and surgical procedures are exempt from Value Added Tax under Law No. 67/2016.
              </p>
            </div>

            <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (المجموع الفرعي):</span>
                <span>{invoice.subtotalEGP.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT (ضريبة القيمة المضافة):</span>
                <span>0.00 ج.م (Exempt)</span>
              </div>
              <div className="border-t border-slate-300 pt-2 flex justify-between text-base font-bold text-slate-900">
                <span>Total Due (الإجمالي):</span>
                <span className="text-teal-800">{invoice.totalEGP.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Paid (المدفوع):</span>
                <span>{invoice.paidAmountEGP.toLocaleString()} ج.م</span>
              </div>
              <div className="flex justify-between text-amber-800 font-semibold border-t border-slate-200 pt-1">
                <span>Balance Due (المتبقي):</span>
                <span>{invoice.remainingEGP.toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>

          {/* Official Signatures & Stamp */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <p className="text-slate-400 mb-8">Authorized Medical Controller</p>
              <p className="font-bold text-slate-800">Dr. Sherif El-Gazzar, MD</p>
              <p className="text-[10px] text-slate-500">Chief Hair Restoration Surgeon (FISHRS)</p>
            </div>
            <div>
              <p className="text-slate-400 mb-8">Clinical Treasury Stamp & Seal</p>
              <div className="inline-block border-2 border-dashed border-teal-600/40 px-6 py-2 rounded-lg text-teal-800 font-semibold font-mono text-[11px]">
                NOVAHAIR CLINICAL TREASURY · EGYPT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
