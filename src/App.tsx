/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserProfile,
  Client,
  Invoice,
  Transaction,
  Appointment,
  TreatmentLog,
  PaymentMethod,
} from './types';
import {
  MOCK_USERS,
  MOCK_CLIENTS,
  MOCK_INVOICES,
  MOCK_TRANSACTIONS,
  MOCK_APPOINTMENTS,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { ClientHubView } from './components/ClientHubView';
import { ClientDetailModal } from './components/ClientDetailModal';
import { FinanceView } from './components/FinanceView';
import { InvoiceModal } from './components/InvoiceModal';
import { NewPatientModal } from './components/NewPatientModal';
import { RecordPaymentModal } from './components/RecordPaymentModal';
import { ScheduleView } from './components/ScheduleView';
import { ClearancesView } from './components/ClearancesView';
import { AuthModal } from './components/AuthModal';
import { AdminSettingsModal, ClinicBranding } from './components/AdminSettingsModal';

export default function App() {
  // Theme & Layout States
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Clinic Branding & Logo State (Configurable in Admin Section)
  const [branding, setBranding] = useState<ClinicBranding>({
    clinicName: 'Novahair',
    tagline: 'Clinical & Enterprise Suite',
    logoUrl: 'follicle-teal',
    logoType: 'preset',
  });
  const [isAdminSettingsOpen, setIsAdminSettingsOpen] = useState(false);

  // Authentication & Active Role State
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS[0]); // Administrator by default
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Active Navigation Tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  // Application Data States
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);

  // Modals & Drawers
  const [selectedClientForDetail, setSelectedClientForDetail] = useState<Client | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [isRecordPaymentModalOpen, setIsRecordPaymentModalOpen] = useState(false);
  const [paymentClientTarget, setPaymentClientTarget] = useState<Client | null>(null);
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);

  // Global Search Filter
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Synchronize Dark / Light mode class on document element
  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Handlers
  const handleSelectClient = (client: Client) => {
    // Keep reference updated with current state
    const current = clients.find((c) => c.id === client.id) || client;
    setSelectedClientForDetail(current);
  };

  const handleAddTreatmentNote = (clientId: string, note: TreatmentLog) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const updated = {
            ...c,
            treatmentLogs: [note, ...c.treatmentLogs],
          };
          if (selectedClientForDetail?.id === clientId) {
            setSelectedClientForDetail(updated);
          }
          return updated;
        }
        return c;
      })
    );
    showToast(`Clinical note recorded by ${currentUser.name}`);
  };

  const handleUpdateClearance = (clientId: string, field: string, value: boolean) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const updatedClearances = {
            ...c.medicalHistory.clearances,
            [field]: value,
          };
          const allCleared = Object.values(updatedClearances).every(Boolean);
          const updated = {
            ...c,
            medicalHistory: {
              ...c.medicalHistory,
              clearances: updatedClearances,
              isCleared: allCleared,
            },
          };
          if (selectedClientForDetail?.id === clientId) {
            setSelectedClientForDetail(updated);
          }
          return updated;
        }
        return c;
      })
    );
    showToast(`Laboratory clearance status updated for ${field.toUpperCase()}`);
  };

  const handleCertifyClearance = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const updatedClearances = {
            cbc: true,
            hbv_hcv_hiv: true,
            pt_inr: true,
            ecg: true,
            glucose: true,
          };
          const updated: Client = {
            ...c,
            status: 'Cleared',
            medicalHistory: {
              ...c.medicalHistory,
              clearances: updatedClearances,
              isCleared: true,
            },
          };
          if (selectedClientForDetail?.id === clientId) {
            setSelectedClientForDetail(updated);
          }
          return updated;
        }
        return c;
      })
    );
    showToast(`Surgical Clearance Certified for Operating Theater`);
  };

  const handleUpdateStatus = (clientId: string, newStatus: Client['status']) => {
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === clientId) {
          const updated = { ...c, status: newStatus };
          if (selectedClientForDetail?.id === clientId) {
            setSelectedClientForDetail(updated);
          }
          return updated;
        }
        return c;
      })
    );
    showToast(`Patient status updated to "${newStatus}"`);
  };

  const handleAddPatient = (
    newClient: Client,
    initialPayment?: { amount: number; method: PaymentMethod; ref: string }
  ) => {
    setClients((prev) => [newClient, ...prev]);

    // Create corresponding invoice
    const newInvoice: Invoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      clientId: newClient.id,
      clientNameEn: newClient.nameEn,
      clientNameAr: newClient.nameAr,
      clientNationalId: newClient.nationalId,
      clientPhone: newClient.phone,
      clientAddress: newClient.address,
      date: new Date().toISOString().split('T')[0],
      dueDate: newClient.procedureDate,
      procedure: `${newClient.procedureType} (${newClient.surgicalPlan.targetGrafts.toLocaleString()} Grafts)`,
      items: [
        {
          description: `${newClient.procedureType} Implantation (${newClient.surgicalPlan.targetGrafts} Grafts)`,
          descriptionAr: `زراعة بصيلات بتقنية ${newClient.procedureType} (${newClient.surgicalPlan.targetGrafts} بصيلة)`,
          quantity: newClient.surgicalPlan.targetGrafts,
          unitPriceEGP: Math.round(newClient.totalPriceEGP / newClient.surgicalPlan.targetGrafts),
          totalEGP: newClient.totalPriceEGP,
        },
      ],
      subtotalEGP: newClient.totalPriceEGP,
      taxEGP: 0,
      totalEGP: newClient.totalPriceEGP,
      paidAmountEGP: initialPayment ? initialPayment.amount : 0,
      remainingEGP: newClient.totalPriceEGP - (initialPayment ? initialPayment.amount : 0),
      status: initialPayment && initialPayment.amount >= newClient.totalPriceEGP
        ? 'Paid'
        : initialPayment && initialPayment.amount > 0
        ? 'Partial'
        : 'Pending',
      paymentMethod: initialPayment ? initialPayment.method : 'InstaPay',
      notes: initialPayment ? `Advance deposit via ${initialPayment.method}` : undefined,
    };

    setInvoices((prev) => [newInvoice, ...prev]);

    if (initialPayment && initialPayment.amount > 0) {
      const newTx: Transaction = {
        id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
        invoiceId: newInvoice.id,
        clientId: newClient.id,
        clientNameEn: newClient.nameEn,
        clientNameAr: newClient.nameAr,
        amountEGP: initialPayment.amount,
        method: initialPayment.method,
        reference: initialPayment.ref,
        status: 'Paid',
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        notes: 'Initial registration deposit',
        receivedBy: `${currentUser.name} (${currentUser.badge})`,
      };
      setTransactions((prev) => [newTx, ...prev]);
    }

    // Add appointment for consultation
    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientId: newClient.id,
      clientNameEn: newClient.nameEn,
      clientNameAr: newClient.nameAr,
      type: 'Consultation',
      room: 'Consultation Clinic A',
      doctor: 'Dr. Sherif El-Gazzar, MD',
      time: '17:00 - 17:45',
      duration: '45 mins',
      status: 'Scheduled',
    };
    setAppointments((prev) => [newApt, ...prev]);

    showToast(`Patient ${newClient.nameEn} (${newClient.nameAr}) registered successfully`);
  };

  const handleAddTransaction = (newTx: Transaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Update client paid amount
    setClients((prev) =>
      prev.map((c) => {
        if (c.id === newTx.clientId) {
          const updatedPaid = c.paidAmountEGP + newTx.amountEGP;
          const updated = {
            ...c,
            paidAmountEGP: updatedPaid,
          };
          if (selectedClientForDetail?.id === c.id) {
            setSelectedClientForDetail(updated);
          }
          return updated;
        }
        return c;
      })
    );

    // Update invoice
    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.clientId === newTx.clientId) {
          const updatedPaid = inv.paidAmountEGP + newTx.amountEGP;
          const updatedRemaining = Math.max(0, inv.totalEGP - updatedPaid);
          return {
            ...inv,
            paidAmountEGP: updatedPaid,
            remainingEGP: updatedRemaining,
            status: updatedRemaining === 0 ? 'Paid' : 'Partial',
            paymentMethod: newTx.method,
          };
        }
        return inv;
      })
    );

    showToast(
      `Received ${newTx.amountEGP.toLocaleString()} EGP via ${newTx.method} (${newTx.clientNameEn})`
    );
  };

  const handleOpenPaymentForClient = (client: Client) => {
    setPaymentClientTarget(client);
    setIsRecordPaymentModalOpen(true);
  };

  const handleOpenInvoiceModalForClient = (client: Client) => {
    const existing = invoices.find((inv) => inv.clientId === client.id);
    if (existing) {
      setSelectedInvoiceForModal(existing);
    } else {
      // Create quick on-the-fly invoice
      const fallbackInv: Invoice = {
        id: `INV-2026-${client.code.replace('NH-26-', '')}`,
        clientId: client.id,
        clientNameEn: client.nameEn,
        clientNameAr: client.nameAr,
        clientNationalId: client.nationalId,
        clientPhone: client.phone,
        clientAddress: client.address,
        date: client.consultationDate,
        dueDate: client.procedureDate,
        procedure: `${client.procedureType} (${client.surgicalPlan.targetGrafts.toLocaleString()} Grafts)`,
        items: [
          {
            description: `${client.procedureType} Surgical Protocol`,
            descriptionAr: `إجراء جراحة زراعة الشعر بتقنية ${client.procedureType}`,
            quantity: client.surgicalPlan.targetGrafts,
            unitPriceEGP: Math.round(client.totalPriceEGP / client.surgicalPlan.targetGrafts),
            totalEGP: client.totalPriceEGP,
          },
        ],
        subtotalEGP: client.totalPriceEGP,
        taxEGP: 0,
        totalEGP: client.totalPriceEGP,
        paidAmountEGP: client.paidAmountEGP,
        remainingEGP: client.totalPriceEGP - client.paidAmountEGP,
        status: client.paidAmountEGP >= client.totalPriceEGP ? 'Paid' : 'Partial',
        paymentMethod: 'InstaPay',
      };
      setSelectedInvoiceForModal(fallbackInv);
    }
  };

  return (
    <div
      className={`flex h-screen w-screen overflow-hidden font-sans transition-colors duration-200 ${
        theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-800'
      }`}
    >
      {/* Sidebar Navigation (Collapsible via burger toggle) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        branding={branding}
        onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
      />

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Header
          currentTab={currentTab}
          currentUser={currentUser}
          onSwitchUser={(user) => {
            setCurrentUser(user);
            showToast(`Role switched to: ${user.badge} (${user.name})`);
          }}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onGlobalSearch={(q) => {
            setGlobalSearchQuery(q);
            if (q && currentTab !== 'clients') {
              setCurrentTab('clients');
            }
          }}
          onOpenNewPayment={() => {
            setPaymentClientTarget(null);
            setIsRecordPaymentModalOpen(true);
          }}
          onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          theme={theme}
          onToggleTheme={toggleTheme}
          branding={branding}
          onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
        />

        {/* Tab Content Canvas */}
        <main className="flex-1 overflow-y-auto bg-slate-100 dark:bg-slate-950 transition-colors duration-200">
          {currentTab === 'dashboard' && (
            <DashboardView
              clients={clients}
              appointments={appointments}
              transactions={transactions}
              currentUser={currentUser}
              onSelectClient={handleSelectClient}
              onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
              onOpenNewPayment={() => {
                setPaymentClientTarget(null);
                setIsRecordPaymentModalOpen(true);
              }}
              onViewAllClients={() => setCurrentTab('clients')}
              onViewAllFinance={() => setCurrentTab('finance')}
              onOpenAdminSettings={() => setIsAdminSettingsOpen(true)}
              branding={branding}
              onUpdateBranding={(newB) => {
                setBranding(newB);
                showToast(`Clinic identity updated: ${newB.clinicName}`);
              }}
            />
          )}

          {currentTab === 'clients' && (
            <ClientHubView
              clients={clients}
              onSelectClient={handleSelectClient}
              onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
              onOpenPaymentForClient={handleOpenPaymentForClient}
              globalSearchQuery={globalSearchQuery}
            />
          )}

          {currentTab === 'schedule' && (
            <ScheduleView
              appointments={appointments}
              clients={clients}
              currentUser={currentUser}
              onSelectClient={handleSelectClient}
              onOpenNewPatient={() => setIsNewPatientModalOpen(true)}
            />
          )}

          {currentTab === 'finance' && (
            <FinanceView
              invoices={invoices}
              transactions={transactions}
              clients={clients}
              onOpenRecordPayment={() => {
                setPaymentClientTarget(null);
                setIsRecordPaymentModalOpen(true);
              }}
              onPreviewInvoice={(inv) => setSelectedInvoiceForModal(inv)}
            />
          )}

          {currentTab === 'clearances' && (
            <ClearancesView
              clients={clients}
              currentUser={currentUser}
              onSelectClient={handleSelectClient}
              onUpdateClearance={handleUpdateClearance}
              onCertifyClearance={handleCertifyClearance}
            />
          )}
        </main>
      </div>

      {/* MODALS */}

      {/* 1. Clinical Detail Modal */}
      <ClientDetailModal
        client={selectedClientForDetail}
        isOpen={!!selectedClientForDetail}
        onClose={() => setSelectedClientForDetail(null)}
        currentUser={currentUser}
        onAddTreatmentNote={handleAddTreatmentNote}
        onUpdateClearance={handleUpdateClearance}
        onUpdateStatus={handleUpdateStatus}
        onOpenInvoiceModal={handleOpenInvoiceModalForClient}
        onOpenRecordPayment={handleOpenPaymentForClient}
      />

      {/* 2. New Patient Registration Modal */}
      <NewPatientModal
        isOpen={isNewPatientModalOpen}
        onClose={() => setIsNewPatientModalOpen(false)}
        onAddPatient={handleAddPatient}
      />

      {/* 3. Record Payment Modal */}
      <RecordPaymentModal
        isOpen={isRecordPaymentModalOpen}
        onClose={() => setIsRecordPaymentModalOpen(false)}
        clients={clients}
        initialClient={paymentClientTarget}
        currentUser={currentUser}
        onAddTransaction={handleAddTransaction}
      />

      {/* 4. Official Egyptian Invoice Preview Modal */}
      <InvoiceModal
        invoice={selectedInvoiceForModal}
        isOpen={!!selectedInvoiceForModal}
        onClose={() => setSelectedInvoiceForModal(null)}
      />

      {/* 5. Authentication & Role Switcher Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Signed in as ${user.name} (${user.badge})`);
        }}
      />

      {/* 6. Admin Clinic Branding & Logo Configuration Modal */}
      <AdminSettingsModal
        isOpen={isAdminSettingsOpen}
        onClose={() => setIsAdminSettingsOpen(false)}
        branding={branding}
        onUpdateBranding={(newB) => {
          setBranding(newB);
          showToast(`Clinic logo & branding updated: ${newB.clinicName}`);
        }}
      />

      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <i className="ri-checkbox-circle-fill text-teal-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
