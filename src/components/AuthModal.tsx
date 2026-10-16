import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentUser.role);
  const [clinicBranch, setClinicBranch] = useState('cairo_new_cairo');
  const [fullName, setFullName] = useState('');

  if (!isOpen) return null;

  const handleRoleQuickSelect = (role: UserRole) => {
    const user = MOCK_USERS.find((u) => u.role === role);
    if (user) {
      setSelectedRole(role);
      setEmail(user.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser = MOCK_USERS.find((u) => u.role === selectedRole) || MOCK_USERS[0];
    onLoginSuccess(targetUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header Banner */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-lg"></i>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400 text-xl font-bold">
              <i className="ri-microscope-line"></i>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">Novahair ERP</h2>
                <span className="text-[10px] font-mono uppercase bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-semibold">
                  v2026.4
                </span>
              </div>
              <p className="text-xs text-slate-400">Clinical & Enterprise Hair Restoration Platform</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 mt-2">
            Secure multi-tenant authentication with role-based access for Cairo & Mansoura medical clinics.
          </p>
        </div>

        {/* Quick Role Simulation Selector */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
            Quick Role Simulator (One-Click Testing)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {MOCK_USERS.map((user) => {
              const isSelected = selectedRole === user.role;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleRoleQuickSelect(user.role)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white border-teal-500 shadow-sm ring-1 ring-teal-500 text-slate-900'
                      : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{user.badge}</span>
                    <span className="text-[10px] font-mono text-slate-400">{user.avatarInitials}</span>
                  </div>
                  <p className="text-[11px] text-slate-700 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.title}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                  !isSignUp
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className={`text-xs font-semibold pb-1 border-b-2 transition-colors ${
                  isSignUp
                    ? 'border-teal-600 text-teal-800'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Sign Up New Staff
              </button>
            </div>
            <span className="text-[11px] text-slate-400">HIPAA & MOH Compliant</span>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Full Staff Name & Credentials
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Dr. Youssef Nabil, MD"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Clinic Professional Email
            </label>
            <div className="relative">
              <i className="ri-mail-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700">Security Password</label>
              <span className="text-[11px] text-teal-600 hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <i className="ri-lock-2-line absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Clinic Branch Location
            </label>
            <select
              value={clinicBranch}
              onChange={(e) => setClinicBranch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
            >
              <option value="cairo_new_cairo">Cairo Branch - New Cairo 5th Settlement (التجمع الخامس)</option>
              <option value="cairo_heliopolis">Cairo Branch - Heliopolis Korba (مصر الجديدة)</option>
              <option value="dakahlia_mansoura">Mansoura Branch - El Gomhoria Surgical Center (المنصورة)</option>
            </select>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>{isSignUp ? 'Create Staff Profile' : 'Authenticate & Enter ERP'}</span>
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
