import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { ClinicBranding } from './AdminSettingsModal';

interface HeaderProps {
  currentTab: string;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  onOpenAuthModal: () => void;
  onGlobalSearch: (query: string) => void;
  onOpenNewPayment: () => void;
  onOpenNewPatient: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  branding: ClinicBranding;
  onOpenAdminSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentUser,
  onSwitchUser,
  onOpenAuthModal,
  onGlobalSearch,
  onOpenNewPayment,
  onOpenNewPatient,
  isSidebarOpen,
  onToggleSidebar,
  theme,
  onToggleTheme,
  branding,
  onOpenAdminSettings,
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return 'Executive Overview & Live Surgical Feeds';
      case 'clients':
        return 'Egyptian Client CRM & Clinical Records';
      case 'schedule':
        return 'Surgical Suites & Appointment Timeline';
      case 'finance':
        return 'Finance, Invoicing & Localized Collections';
      case 'clearances':
        return 'Infectious & Hematologic Clearances';
      default:
        return 'Novahair Suite';
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    const user = MOCK_USERS.find((u) => u.role === role);
    if (user) {
      onSwitchUser(user);
    }
    setShowRoleDropdown(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    onGlobalSearch(e.target.value);
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between gap-4 shrink-0 z-20 transition-colors duration-200">
      {/* Zone 1: Burger Toggle + Logo + Contextual Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle Burger Button */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={isSidebarOpen ? 'Collapse Navigation' : 'Expand Navigation'}
        >
          <i className="ri-menu-line text-lg"></i>
        </button>

        {/* Breadcrumb Title */}
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
          {getBreadcrumbTitle()}
        </span>
      </div>

      {/* Zone 2: Global Search Input */}
      <div className="flex-1 max-w-sm hidden md:block">
        <div className="relative">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search patient, National ID, phone, or invoice..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                onGlobalSearch('');
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
            >
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>
      </div>

      {/* Zone 3: Quick Role Switcher, Dark/Light Mode & Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Admin 'Set Logo' Button (Visible only to Administrator) */}
        {currentUser.role === 'admin' && onOpenAdminSettings && (
          <button
            onClick={onOpenAdminSettings}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
            title="Set Clinic Logo & Branding"
          >
            <i className="ri-palette-line text-teal-600 dark:text-teal-400 text-sm"></i>
            <span>Set Logo</span>
          </button>
        )}

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <i className="ri-sun-line text-amber-400 text-sm"></i>
          ) : (
            <i className="ri-moon-line text-slate-600 text-sm"></i>
          )}
        </button>

        {/* Quick action buttons depending on role */}
        {(currentUser.role === 'admin' || currentUser.role === 'finance') && (
          <button
            onClick={onOpenNewPayment}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <i className="ri-hand-coin-line text-emerald-600 text-sm"></i>
            <span>Record Payment</span>
          </button>
        )}

        {(currentUser.role === 'admin' || currentUser.role === 'receptionist') && (
          <button
            onClick={onOpenNewPatient}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-teal-800 dark:text-teal-300 rounded-lg text-xs font-medium border border-teal-200/60 dark:border-teal-700/60 transition-colors"
          >
            <i className="ri-user-add-line text-teal-600 dark:text-teal-400 text-sm"></i>
            <span>New Intake</span>
          </button>
        )}

        {/* Role Switcher Menu */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-xs text-slate-700 dark:text-slate-200 transition-colors"
            title="Switch Simulated Role"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">{currentUser.badge}</span>
            <i className="ri-arrow-down-s-line text-slate-400 text-xs"></i>
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Switch Active ERP Role
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Preview role-specific interface & actions</p>
              </div>

              {MOCK_USERS.map((user) => {
                const isCurrent = currentUser.role === user.role;
                return (
                  <button
                    key={user.id}
                    onClick={() => handleRoleSelect(user.role)}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      isCurrent
                        ? 'bg-teal-50/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-semibold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isCurrent && <i className="ri-check-line text-teal-600 dark:text-teal-400 text-xs"></i>}
                      </div>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 block">{user.badge}</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{user.avatarInitials}</span>
                  </button>
                );
              })}

              <div className="px-3 pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setShowRoleDropdown(false);
                    onOpenAuthModal();
                  }}
                  className="w-full py-1.5 text-center text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                >
                  <i className="ri-login-box-line mr-1 text-slate-400"></i>
                  Sign-In / Switch Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Auth / Avatar Quick trigger */}
        <button
          onClick={onOpenAuthModal}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Account / Session Manager"
        >
          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-teal-950 text-teal-300 border border-slate-700 dark:border-teal-700 flex items-center justify-center font-bold text-xs">
            {currentUser.avatarInitials}
          </div>
        </button>
      </div>
    </header>
  );
};
