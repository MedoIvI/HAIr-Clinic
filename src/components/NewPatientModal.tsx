import React, { useState, useEffect } from 'react';
import { Client, ProcedureType, NorwoodScale, PaymentMethod } from '../types';
import { parseEgyptianNationalId } from '../data/mockData';

interface NewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (client: Client, initialPayment?: { amount: number; method: PaymentMethod; ref: string }) => void;
}

export const NewPatientModal: React.FC<NewPatientModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [phone, setPhone] = useState('+20 10 ');
  const [address, setAddress] = useState('');
  const [procedureType, setProcedureType] = useState<ProcedureType>('Sapphire FUE');
  const [norwood, setNorwood] = useState<NorwoodScale>('Stage III Vertex');
  const [targetGrafts, setTargetGrafts] = useState<number>(3500);
  const [totalPriceEGP, setTotalPriceEGP] = useState<number>(63000);
  const [initialDepositEGP, setInitialDepositEGP] = useState<number>(20000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('InstaPay');
  const [paymentRef, setPaymentRef] = useState('');
  const [validationError, setValidationError] = useState('');

  // Live parsed national ID info
  const idInfo = parseEgyptianNationalId(nationalId);

  useEffect(() => {
    // Auto-calculate suggested price when grafts change: ~18 EGP per graft
    setTotalPriceEGP(targetGrafts * 18);
  }, [targetGrafts]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!nameEn.trim() || !nameAr.trim()) {
      setValidationError('Please enter both English and Arabic full patient names.');
      return;
    }

    if (!idInfo) {
      setValidationError('Please enter a valid 14-digit Egyptian National ID according to the official formula.');
      return;
    }

    if (!phone || phone.length < 11) {
      setValidationError('Please provide a valid Egyptian phone number (e.g. +20 10/11/12/15).');
      return;
    }

    const newClient: Client = {
      id: `cl-${Date.now()}`,
      code: `NH-26-${Math.floor(1000 + Math.random() * 9000)}`,
      nameEn: nameEn.trim(),
      nameAr: nameAr.trim(),
      nationalId: nationalId.trim(),
      gender: idInfo.gender as 'male' | 'female',
      birthDate: idInfo.birthDate,
      governorate: idInfo.governorate,
      governorateCode: idInfo.govCode,
      phone: phone.trim(),
      address: address.trim() || `شارع رئيسي، ${idInfo.governorate}`,
      age: idInfo.age,
      status: 'Consultation',
      procedureType,
      consultationDate: new Date().toISOString().split('T')[0],
      procedureDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
      norwood,
      donorMetrics: {
        density: 85,
        caliber: '70 µm (Medium / Dark)',
        laxity: 'Normal',
        safeDonorZoneYield: 4600,
        miniaturizationRate: '9%',
        evaluationNotes: `Initial consultation trichoscopy performed for ${nameEn}. Favorable donor capacity confirmed.`,
      },
      surgicalPlan: {
        targetGrafts,
        extractionTechnique: procedureType.includes('DHI')
          ? 'DHI Micro-Choi Implanter Pen (0.85mm)'
          : 'Sapphire FUE Micro-Canal Blades (0.80mm)',
        anesthesia: 'Tumescent local anesthesia with buffered lidocaine 0.1%',
        leadSurgeon: 'Dr. Sherif El-Gazzar, MD',
        singleGrafts: Math.round(targetGrafts * 0.2),
        doubleGrafts: Math.round(targetGrafts * 0.55),
        multipleGrafts: Math.round(targetGrafts * 0.25),
        hairlineDesign: 'Anatomical micro-irregular hairline matching temporal angles',
        surgeryTheater: procedureType.includes('DHI') ? 'OR 2 - DHI Precision' : 'OR 1 - Sapphire Suite',
      },
      medicalHistory: {
        pastSurgeries: ['None reported'],
        chronicConditions: ['None reported'],
        bloodType: 'O+',
        allergies: ['No known allergies'],
        medications: ['None reported'],
        clearances: {
          cbc: true,
          hbv_hcv_hiv: false, // Must be tested
          pt_inr: false,
          ecg: false,
          glucose: true,
        },
        isCleared: false,
      },
      treatmentLogs: [
        {
          id: `log-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          stage: 'Intake Registration',
          notes: `Patient registered into ERP system. Consultation scheduled with Dr. Sherif El-Gazzar. Norwood scale ${norwood} diagnosed.`,
          recordedBy: 'Front Desk Reception',
        },
      ],
      photos: [
        {
          preOpUrl: '/src/assets/images/fue_case_ziad_before_1791677387414.jpg',
          postOpUrl: '/src/assets/images/fue_case_ziad_after_1791677397139.jpg',
          timeframe: 'Baseline Trichoscopy Mapping',
          notes: 'Pre-op diagnostic documentation.',
        },
      ],
      totalPriceEGP,
      paidAmountEGP: initialDepositEGP,
      assignedDoctor: 'Dr. Sherif El-Gazzar, MD',
    };

    onAddPatient(
      newClient,
      initialDepositEGP > 0
        ? {
            amount: initialDepositEGP,
            method: paymentMethod,
            ref: paymentRef || `${paymentMethod} Transfer - Ref #${Math.floor(100000 + Math.random() * 900000)}`,
          }
        : undefined
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center text-lg font-bold">
              <i className="ri-user-add-line"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Register New Egyptian Patient (تسجيل مريض جديد)
              </h2>
              <p className="text-xs text-slate-400">
                Official intake with 14-digit Egyptian National ID verification
              </p>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <i className="ri-error-warning-line text-rose-600 text-base"></i>
              <span>{validationError}</span>
            </div>
          )}

          {/* Bilingual Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full English Name (الاسم بالإنجليزية) *
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Hossam Hassan"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Full Arabic Name (الاسم الرباعي بالعربية) *
              </label>
              <input
                type="text"
                required
                dir="rtl"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                placeholder="مثال: حسام حسن عبد الله"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none font-arabic"
              />
            </div>
          </div>

          {/* Egyptian National ID with Live Algorithm Decoder */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-800">
                Egyptian National ID (الرقم القومي المصري - ١٤ رقم) *
              </label>
              <span className="text-[11px] font-mono text-slate-500">
                {nationalId.length} / 14 Digits
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                maxLength={14}
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 29508140103417 or 30105121204312"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm tracking-widest focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            {/* Live Decoder Output Badge */}
            {idInfo ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1 font-bold">
                  <i className="ri-checkbox-circle-line text-emerald-600"></i>
                  <span>Valid National ID</span>
                </span>
                <span>·</span>
                <span>Birth: {idInfo.birthDate}</span>
                <span>·</span>
                <span>Age: {idInfo.age} yrs</span>
                <span>·</span>
                <span>Gov: {idInfo.governorate}</span>
                <span>·</span>
                <span>Gender: {idInfo.gender === 'male' ? 'ذكر (Male)' : 'أنثى (Female)'}</span>
              </div>
            ) : nationalId.length === 14 ? (
              <p className="text-[11px] text-rose-600">
                Invalid National ID formula. First digit must be 2 (1900s) or 3 (2000s) followed by valid YYMMDD and governorate code.
              </p>
            ) : (
              <p className="text-[11px] text-slate-400">
                Formula: Century (2/3) + BirthDate (YYMMDD) + Governorate Code (e.g. 01 Cairo, 12 Dakahlia, 21 Giza) + Serial + Check Digit
              </p>
            )}
          </div>

          {/* Contact & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Egyptian Mobile Number *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+20 10 xxxx xxxx"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Residential Address (العنوان بالتفصيل)
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. شارع مصدق، الدقي، الجيزة"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Clinical Procedure & Norwood */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Procedure</label>
              <select
                value={procedureType}
                onChange={(e) => setProcedureType(e.target.value as ProcedureType)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-teal-500"
              >
                <option value="Sapphire FUE">Sapphire FUE</option>
                <option value="DHI Micro-Choi">DHI Micro-Choi</option>
                <option value="Beard & Mustache">Beard & Mustache</option>
                <option value="Eyebrow Restoration">Eyebrow Restoration</option>
                <option value="Stem Cell & PRP Therapy">Stem Cell & PRP</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Norwood Scale</label>
              <select
                value={norwood}
                onChange={(e) => setNorwood(e.target.value as NorwoodScale)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:ring-1 focus:ring-teal-500"
              >
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage III Vertex">Stage III Vertex</option>
                <option value="Stage IV">Stage IV</option>
                <option value="Stage V">Stage V</option>
                <option value="Stage VI">Stage VI</option>
                <option value="Stage VII">Stage VII</option>
                <option value="Ludwig II (Female)">Ludwig II (Female)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Grafts</label>
              <input
                type="number"
                step={100}
                value={targetGrafts}
                onChange={(e) => setTargetGrafts(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Pricing & Deposit */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 block">Financial & Deposit Allocation (EGP / ج.م)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 mb-1">Quoted Procedure Fee (EGP)</label>
                <input
                  type="number"
                  value={totalPriceEGP}
                  onChange={(e) => setTotalPriceEGP(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Advance Booking Deposit (EGP)</label>
                <input
                  type="number"
                  value={initialDepositEGP}
                  onChange={(e) => setInitialDepositEGP(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono font-bold text-emerald-700 bg-white"
                />
              </div>
            </div>

            {initialDepositEGP > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-slate-600 mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="InstaPay">InstaPay Network</option>
                    <option value="Vodafone Cash">Vodafone Cash</option>
                    <option value="Credit/Debit Card">Credit/Debit Card (POS)</option>
                    <option value="Cash">Cash Treasury</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Gateway Reference / Wallet No.</label>
                  <input
                    type="text"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    placeholder="e.g. user@instapay or VF-010xxxx"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono bg-white"
                  />
                </div>
              </div>
            )}
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
              className="px-5 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <i className="ri-check-line text-teal-400"></i>
              <span>Register Patient & Generate File</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
