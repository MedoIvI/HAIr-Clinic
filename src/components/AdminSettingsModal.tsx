import React, { useState } from 'react';

export interface ClinicBranding {
  clinicName: string;
  tagline: string;
  logoUrl: string;
  logoType: 'preset' | 'custom' | 'upload';
}

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branding: ClinicBranding;
  onUpdateBranding: (newBranding: ClinicBranding) => void;
}

export const PRESET_LOGOS = [
  {
    id: 'follicle-teal',
    name: 'Teal Micro-Follicle Seal',
    icon: 'ri-microscope-line',
    bg: 'bg-teal-600',
    color: 'text-white',
  },
  {
    id: 'sapphire-blade',
    name: 'Sapphire Precision Blade',
    icon: 'ri-compasses-2-line',
    bg: 'bg-emerald-600',
    color: 'text-white',
  },
  {
    id: 'medical-shield',
    name: 'Clinical Health Shield',
    icon: 'ri-shield-cross-line',
    bg: 'bg-slate-900',
    color: 'text-teal-400',
  },
  {
    id: 'trichology-dna',
    name: 'Trichology Helix Emblem',
    icon: 'ri-dna-line',
    bg: 'bg-cyan-700',
    color: 'text-white',
  },
];

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  branding,
  onUpdateBranding,
}) => {
  const [clinicName, setClinicName] = useState(branding.clinicName);
  const [tagline, setTagline] = useState(branding.tagline);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl);
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please select a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
        setPreviewError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBranding({
      clinicName: clinicName.trim() || 'Novahair',
      tagline: tagline.trim() || 'Clinical & Enterprise Suite',
      logoUrl: logoUrl.trim(),
      logoType: activeTab === 'presets' ? 'preset' : 'custom',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/40 flex items-center justify-center text-xl">
              <i className="ri-settings-4-line"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Clinic Brand & Logo Customization
              </h2>
              <p className="text-xs text-slate-400">
                Executive Administrator configuration panel
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
        <form onSubmit={handleSave} className="p-6 space-y-5 text-xs text-slate-700 dark:text-slate-300">
          {/* Current Live Preview */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
              Live Top Navbar Preview
            </span>
            <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
              <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-teal-600 text-white font-bold text-lg shrink-0 border border-slate-200 dark:border-slate-700">
                {(() => {
                  const matched = PRESET_LOGOS.find((p) => p.id === logoUrl);
                  if (matched) {
                    return (
                      <div className={`w-full h-full ${matched.bg} ${matched.color} flex items-center justify-center text-lg`}>
                        <i className={matched.icon}></i>
                      </div>
                    );
                  }
                  if (logoUrl && !previewError) {
                    return (
                      <img
                        src={logoUrl}
                        alt="Clinic Logo Preview"
                        className="w-full h-full object-cover"
                        onError={() => setPreviewError(true)}
                      />
                    );
                  }
                  return <i className="ri-microscope-line text-xl text-teal-300"></i>;
                })()}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {clinicName || 'Novahair'}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-semibold">
                    ERP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {tagline || 'Clinical & Enterprise Suite'}
                </p>
              </div>
            </div>
          </div>

          {/* Name & Tagline Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Clinic Display Name *
              </label>
              <input
                type="text"
                required
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="e.g. Novahair"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">
                Sub-Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Clinical & Enterprise Suite"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Logo Source Selector */}
          <div>
            <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Set Navbar & Sidebar Logo
            </label>

            <div className="flex border-b border-slate-200 dark:border-slate-700 mb-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('presets')}
                className={`py-1.5 px-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'presets'
                    ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Medical Emblems
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`py-1.5 px-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'upload'
                    ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                Upload File (PNG/JPG)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`py-1.5 px-3 font-semibold border-b-2 transition-colors ${
                  activeTab === 'url'
                    ? 'border-teal-600 text-teal-700 dark:text-teal-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                External Image URL
              </button>
            </div>

            {/* Tab 1: Presets */}
            {activeTab === 'presets' && (
              <div className="grid grid-cols-2 gap-2">
                {PRESET_LOGOS.map((preset) => {
                  const isSelected = logoUrl === preset.id || (!logoUrl && preset.id === 'follicle-teal');
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => {
                        setLogoUrl(preset.id);
                        setPreviewError(false);
                      }}
                      className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all text-left ${
                        isSelected
                          ? 'border-teal-500 bg-teal-50/70 dark:bg-teal-900/30 ring-1 ring-teal-500'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${preset.bg} ${preset.color} flex items-center justify-center shrink-0 text-base shadow-xs`}>
                        <i className={preset.icon}></i>
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-slate-900 dark:text-white block truncate">
                          {preset.name}
                        </span>
                        <span className="text-[10px] text-slate-400">Official Emblem</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Upload File */}
            {activeTab === 'upload' && (
              <div className="p-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800/40">
                <i className="ri-upload-cloud-2-line text-3xl text-slate-400 block mb-2"></i>
                <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  Upload Clinic Logo Image
                </p>
                <p className="text-[11px] text-slate-400 mb-3">
                  Recommended size: Square PNG or SVG (max 2MB)
                </p>
                <label className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer transition-colors inline-block">
                  <i className="ri-folder-open-line mr-1.5"></i>
                  <span>Browse Device</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Tab 3: URL */}
            {activeTab === 'url' && (
              <div>
                <input
                  type="url"
                  value={logoUrl.startsWith('data:') ? '' : logoUrl}
                  onChange={(e) => {
                    setLogoUrl(e.target.value);
                    setPreviewError(false);
                  }}
                  placeholder="https://example.com/clinic-logo.png"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono text-xs"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter HTTPS link to your clinic logo image
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-500 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <i className="ri-check-line"></i>
              <span>Save & Apply Clinic Branding</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
