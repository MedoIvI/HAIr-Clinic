import React from 'react';
import { UserProfile } from '../types';
import { ClinicBranding, PRESET_LOGOS } from './AdminSettingsModal';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile;
  onOpenNewPatient: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  branding: ClinicBranding;
  onOpenAdminSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  onOpenNewPatient,
  isSidebarOpen,
  onToggleSidebar,
  branding,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Executive Dashboard',
      icon: 'ri-dashboard-line',
      roles: ['admin', 'surgeon', 'receptionist', 'finance'],
    },
    {
      id: 'clients',
      label: 'Patient CRM & Records',
      icon: 'ri-user-heart-line',
      badge: '7 Active',
      roles: ['admin', 'surgeon', 'receptionist', 'finance'],
    },
    {
      id: 'schedule',
      label: 'Surgical Suites & Calendar',
      icon: 'ri-calendar-event-line',
      badge: 'OR Active',
      roles: ['admin', 'surgeon', 'receptionist'],
    },
    {
      id: 'finance',
      label: 'Finance & Invoicing',
      icon: 'ri-money-cny-box-line',
      roles: ['admin', 'finance'],
    },
    {
      id: 'clearances',
      label: 'Clinical Clearances',
      icon: 'ri-test-tube-line',
      roles: ['admin', 'surgeon', 'receptionist'],
    },
  ];

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(currentUser.role)
  );

  // Render configured logo
  const renderLogo = () => {
    if (branding.logoUrl && (branding.logoUrl.startsWith('http') || branding.logoUrl.startsWith('data:'))) {
      return (
        <img
          src={branding.logoUrl}
          alt={branding.clinicName}
          className="w-full h-full object-cover"
        />
      );
    }
    const matchedPreset = PRESET_LOGOS.find((p) => p.id === branding.logoUrl);
    if (matchedPreset) {
      return <i className={`${matchedPreset.icon} ${matchedPreset.color} text-lg`}></i>;
    }
    return <i className="ri-microscope-line text-teal-400 text-lg"></i>;
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-slate-950/60 z-30 lg:hidden transition-opacity duration-200 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggleSidebar}
      />

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 bg-slate-900 text-slate-200 flex flex-col shrink-0 h-screen border-r border-slate-800 select-none transition-all duration-300 ease-in-out ${
          isSidebarOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center gap-3 h-16">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 overflow-hidden flex items-center justify-center shrink-0">
            {renderLogo()}
          </div>
          {isSidebarOpen && (
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-base tracking-tight truncate">
                  {branding.clinicName}
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold">
                  ERP
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">{branding.tagline}</p>
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <div className="p-3">
          {isSidebarOpen ? (
            <button
              onClick={onOpenNewPatient}
              className="w-full py-2.5 px-3 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <i className="ri-user-add-line text-sm"></i>
              <span>Register New Patient</span>
            </button>
          ) : (
            <button
              onClick={onOpenNewPatient}
              className="w-full h-10 bg-teal-600 hover:bg-teal-500 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm"
              title="Register New Patient"
            >
              <i className="ri-user-add-line text-base"></i>
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {isSidebarOpen && (
            <div className="px-3 py-1.5 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Modules
            </div>
          )}
          {filteredNav.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center ${
                  isSidebarOpen ? 'justify-between px-3' : 'justify-center px-0'
                } py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-teal-300 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <i
                    className={`${item.icon} text-lg ${
                      isActive ? 'text-teal-400' : 'text-slate-400'
                    }`}
                  ></i>
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </div>
                {isSidebarOpen && item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      isActive
                        ? 'bg-teal-900/60 text-teal-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

        </nav>

        {/* Operating Suites Badge (Expanded mode only) */}
        {isSidebarOpen && (
          <div className="p-3 mx-3 mb-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px]">
            <div className="flex items-center justify-between text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5">
                <i className="ri-hospital-line text-teal-400"></i>
                <span>Cairo & Mansoura Hub</span>
              </span>
              <span className="font-mono text-[10px] text-teal-400">EGP (ج.م)</span>
            </div>
            <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
              <div className="flex justify-between">
                <span>OR 1 (Sapphire):</span>
                <span className="text-emerald-400">In Surgery</span>
              </div>
              <div className="flex justify-between">
                <span>OR 2 (DHI Pen):</span>
                <span className="text-teal-300">Ready</span>
              </div>
            </div>
          </div>
        )}

        {/* User Role Card */}
        <div className="p-3 border-t border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-teal-300 flex items-center justify-center font-bold text-xs shrink-0">
              {currentUser.avatarInitials}
            </div>
            {isSidebarOpen && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-teal-400 truncate">{currentUser.badge}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
