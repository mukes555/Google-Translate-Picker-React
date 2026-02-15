'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleTranslate } from 'google-translate-picker-react';
import LANGUAGE_DATA from '../../src/lib/gtranslate-languages.json';
import { Globe, Palette, Code, Sparkles, Github, Check, Languages, Monitor, Smartphone, Layout, Settings, Sun, Moon, Zap, Search, ChevronDown, ChevronUp, X as CloseIcon, Copy } from 'lucide-react';

export default function Home() {
  const defaultTheme = {
    primaryColor: '#005EB8',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    textColor: '#1e293b',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
    backdropBlur: '12px',
    searchBackgroundColor: 'rgba(0, 0, 0, 0.04)',
    buttonBorderRadius: '16px',
    buttonBackgroundColor: '#ffffff',
    buttonTextColor: '#1e293b',
    buttonBorder: '2px solid #005EB8',
    panelBorder: '1.5px solid #005EB8',
  };

  const [theme, setTheme] = useState(defaultTheme);

  const themes = [
    {
      id: 'default',
      name: 'Modern Blue',
      icon: Sun,
      config: defaultTheme
    },
    {
      id: 'dark',
      name: 'Midnight',
      icon: Moon,
      config: {
        ...defaultTheme,
        backgroundColor: '#0f172a',
        textColor: '#f8fafc',
        primaryColor: '#38bdf8',
        searchBackgroundColor: 'rgba(255, 255, 255, 0.08)',
        buttonBackgroundColor: '#1e293b',
        buttonTextColor: '#f8fafc',
        buttonBorder: '1px solid #334155',
        panelBorder: '1px solid #334155',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      }
    },
    {
      id: 'glass',
      name: 'Glassmorphism',
      icon: Zap,
      config: {
        ...defaultTheme,
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        backdropBlur: '20px',
        panelBorder: '1px solid rgba(255, 255, 255, 0.4)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
        textColor: '#0f172a',
      }
    },
    {
      id: 'purple',
      name: 'Royal Purple',
      icon: Sparkles,
      config: {
        ...defaultTheme,
        primaryColor: '#7c3aed',
        buttonBorder: '2px solid #7c3aed',
        panelBorder: '1.5px solid #7c3aed',
      }
    }
  ];

  const [activeTab, setActiveTab] = useState<'style' | 'layout' | 'advanced'>('style');
  const [variant, setVariant] = useState<'modal' | 'sidebar-left' | 'sidebar-right' | 'dropdown'>('modal');
  const [showFlags, setShowFlags] = useState(true);
  const [showSearch, setShowSearch] = useState(true);
  const [showNativeNames, setShowNativeNames] = useState(true);
  const [showTitle, setShowTitle] = useState(true);
  const [columns, setColumns] = useState(3);
  const [mobileColumns, setMobileColumns] = useState(1);
  const [buttonConfig, setButtonConfig] = useState<{
    position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    shape: 'circle' | 'square' | 'pill';
    showGlobe: boolean;
    showLabel: boolean;
    showFlag: boolean;
    offset?: { x: number; y: number };
  }>({
    position: 'bottom-right',
    shape: 'pill',
    showGlobe: true,
    showLabel: true,
    showFlag: true,
    offset: { x: 24, y: 24 },
  });

  const [availableLangs, setAvailableLangs] = useState<string[] | undefined>(undefined);
  const [langSearch, setLangSearch] = useState('');
  const [showLangSelector, setShowLangSelector] = useState(false);
  const [copied, setCopied] = useState(false);

  const allLanguages = LANGUAGE_DATA.languages;

  const copyToClipboard = () => {
    const code = `<GoogleTranslate
  theme={{
${Object.entries(theme).filter(([_, v]) => v !== undefined).map(([k, v]) => `    ${k}: '${v}',`).join('\n')}
  }}
  variant="${variant}"
  buttonConfig={{
    position: '${buttonConfig.position}',
    shape: '${buttonConfig.shape}',
    showGlobe: ${buttonConfig.showGlobe},
    showLabel: ${buttonConfig.showLabel},
    showFlag: ${buttonConfig.showFlag},
    offset: { x: ${buttonConfig.offset?.x}, y: ${buttonConfig.offset?.y} }
  }}
  columns={${columns}}
  mobileColumns={${mobileColumns}}
  showFlags={${showFlags}}
  showSearch={${showSearch}}
  showNativeNames={${showNativeNames}}
  showTitle={${showTitle}}
  ${availableLangs ? `availableLanguages={[${availableLangs.map(l => `'${l}'`).join(', ')}]}` : ''}
/>`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const filteredLangs = allLanguages.filter(l =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const toggleLang = (code: string) => {
    setAvailableLangs(prev => {
      const current = prev || [];
      if (current.includes(code)) {
        const next = current.filter(c => c !== code);
        return next.length === 0 ? undefined : next;
      }
      return [...current, code];
    });
  };

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('gtw-demo-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.theme) setTheme(parsed.theme);
        if (parsed.variant) setVariant(parsed.variant);
        if (parsed.showFlags !== undefined) setShowFlags(parsed.showFlags);
        if (parsed.showSearch !== undefined) setShowSearch(parsed.showSearch);
        if (parsed.showNativeNames !== undefined) setShowNativeNames(parsed.showNativeNames);
        if (parsed.showTitle !== undefined) setShowTitle(parsed.showTitle);
        if (parsed.columns) setColumns(parsed.columns);
        if (parsed.mobileColumns) setMobileColumns(parsed.mobileColumns);
        if (parsed.buttonConfig) setButtonConfig(parsed.buttonConfig);
        if (parsed.availableLangs) setAvailableLangs(parsed.availableLangs);
      } catch (e) {
        console.error('Failed to load settings', e);
      }
    }
  }, []);

  useEffect(() => {
    const settings = {
      theme, variant, showFlags, showSearch, showNativeNames, showTitle,
      columns, mobileColumns, buttonConfig, availableLangs
    };
    localStorage.setItem('gtw-demo-settings', JSON.stringify(settings));
  }, [theme, variant, showFlags, showSearch, showNativeNames, showTitle, columns, mobileColumns, buttonConfig, availableLangs]);

  return (
    <main className="min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Globe size={24} />
            </div>
            <span>Google Translate Picker React</span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://github.com"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full font-semibold hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2"
            >
              <Github size={20} />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-6">
              <Sparkles size={16} />
              The ultimate language picker
            </span>
            <h1 className="text-6xl md:text-7xl font-black mb-8 tracking-tight text-slate-900">
              Google Translate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Picker React.
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
              A highly customizable, lightweight React language picker for Google Translate Picker React.
              Theme everything, and support 100+ languages.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => window.dispatchEvent(new Event('open-language-picker'))}
                className="w-full sm:w-auto bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-3"
              >
                <Sparkles size={20} />
                Try the Picker
              </button>
              <button className="w-full sm:w-auto bg-white border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-2xl font-black text-lg hover:border-slate-300 transition-all active:scale-95 flex items-center justify-center gap-3">
                <Github size={20} />
                View on GitHub
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Customizer */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-blue-600">
              <Palette size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight">Live Customizer</h2>
              <p className="text-slate-500">Play with the props and see the changes in real-time.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Controls */}
            <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-200 flex flex-col overflow-hidden h-full">
              {/* Tab Switcher - Accessible & Clear */}
              <div className="flex p-1.5 gap-1.5 bg-slate-100 m-6 rounded-2xl">
                {[
                  { id: 'style', label: 'Style', icon: Palette },
                  { id: 'layout', label: 'Layout', icon: Layout },
                  { id: 'advanced', label: 'Advanced', icon: Settings },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    aria-selected={activeTab === tab.id}
                    className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                    }`}
                  >
                    <tab.icon size={18} />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="px-8 pb-8 space-y-10 flex-1 overflow-y-auto custom-scrollbar">
                {activeTab === 'style' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Theme Presets */}
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1.5">
                        <label id="theme-presets-label" className="text-sm font-black text-slate-900 uppercase tracking-wider">Theme Presets</label>
                        <p className="text-sm text-slate-500">Quickly apply pre-designed professional styles.</p>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="group" aria-labelledby="theme-presets-label">
                        {themes.map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.config)}
                            aria-pressed={JSON.stringify(theme) === JSON.stringify(t.config)}
                            className={`group flex flex-col items-center gap-3 p-4 rounded-[1.5rem] border-2 transition-all ${
                              JSON.stringify(theme) === JSON.stringify(t.config)
                                ? 'border-blue-600 bg-blue-50/30 shadow-sm'
                                : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                               JSON.stringify(theme) === JSON.stringify(t.config)
                                 ? 'bg-blue-600 text-white shadow-blue-200 shadow-lg'
                                 : 'bg-white text-slate-400 group-hover:text-blue-600 group-hover:shadow-md border border-slate-100'
                            }`}>
                              <t.icon size={22} />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-tight text-center ${
                              JSON.stringify(theme) === JSON.stringify(t.config) ? 'text-blue-700' : 'text-slate-500'
                            }`}>{t.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8 pt-8 border-t border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <label id="brand-colors-label" className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          Brand Colors
                        </label>
                        <p className="text-sm text-slate-500">Match the picker to your brand identity.</p>
                      </div>
                      <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-8" role="group" aria-labelledby="brand-colors-label">
                        {[
                          { label: 'Primary', key: 'primaryColor', desc: 'Accents' },
                          { label: 'Text', key: 'textColor', desc: 'Content' },
                          { label: 'Panel', key: 'backgroundColor', desc: 'Picker' },
                          { label: 'Search', key: 'searchBackgroundColor', desc: 'Input' },
                        ].map((item) => (
                          <div key={item.key} className="space-y-4 flex flex-col items-center">
                            <label htmlFor={`color-${item.key}`} className="sr-only">{item.label} Color</label>
                            <div
                              className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl cursor-pointer relative overflow-hidden group hover:scale-110 transition-transform active:scale-95"
                              style={{ backgroundColor: (theme as any)[item.key] }}
                            >
                              <input
                                id={`color-${item.key}`}
                                type="color"
                                title={`Change ${item.label} color`}
                                value={(theme as any)[item.key].startsWith('rgba') ? '#ffffff' : (theme as any)[item.key]}
                                onChange={(e) => setTheme({ ...theme, [item.key]: e.target.value })}
                                className="absolute inset-0 opacity-0 cursor-pointer scale-[4]"
                              />
                            </div>
                            <div className="text-center">
                              <span className="text-[11px] font-black text-slate-900 block uppercase tracking-tighter">{item.label}</span>
                              <span className="text-[10px] text-slate-400 block font-bold uppercase">{item.desc}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-8 border-t border-slate-100">
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col gap-1">
                            <label htmlFor="border-radius-range" className="text-xs font-black text-slate-900 uppercase tracking-widest">Border Radius</label>
                            <span className="text-sm font-bold text-blue-600">{theme.borderRadius}</span>
                          </div>
                        </div>
                        <input
                          id="border-radius-range"
                          type="range" min="0" max="48" step="4"
                          value={parseInt(theme.borderRadius)}
                          onChange={(e) => setTheme({ ...theme, borderRadius: `${e.target.value}px`, buttonBorderRadius: `${e.target.value}px` })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                      <div className="space-y-6">
                        <div className="flex justify-between items-end">
                          <div className="flex flex-col gap-1">
                            <label htmlFor="backdrop-blur-range" className="text-xs font-black text-slate-900 uppercase tracking-widest">Backdrop Blur</label>
                            <span className="text-sm font-bold text-blue-600">{theme.backdropBlur}</span>
                          </div>
                        </div>
                        <input
                          id="backdrop-blur-range"
                          type="range" min="0" max="40" step="4"
                          value={parseInt(theme.backdropBlur)}
                          onChange={(e) => setTheme({ ...theme, backdropBlur: `${e.target.value}px` })}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'layout' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Display Mode - More Visual */}
                    <div className="space-y-6">
                      <div className="flex flex-col gap-1.5">
                        <label id="display-mode-label" className="text-sm font-black text-slate-900 uppercase tracking-wider">Display Mode</label>
                        <p className="text-sm text-slate-500">Choose how the language picker appears on your site.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4" role="group" aria-labelledby="display-mode-label">
                        {[
                          { id: 'modal', label: 'Modal Overlay', icon: Monitor, desc: 'Centered popup' },
                          { id: 'dropdown', label: 'Dropdown', icon: Layout, desc: 'Context menu' },
                          { id: 'sidebar-left', label: 'Sidebar Left', icon: Monitor, desc: 'Slide from left' },
                          { id: 'sidebar-right', label: 'Sidebar Right', icon: Monitor, desc: 'Slide from right' },
                        ].map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setVariant(v.id as any)}
                            aria-pressed={variant === v.id}
                            className={`group flex flex-col items-start p-5 rounded-3xl border-2 transition-all ${
                              variant === v.id
                                ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${
                              variant === v.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                            }`}>
                              <v.icon size={20} />
                            </div>
                            <span className="text-sm font-black mb-1">{v.label}</span>
                            <span className={`text-[11px] font-bold uppercase tracking-tight ${variant === v.id ? 'text-blue-100' : 'text-slate-400'}`}>{v.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grid Configuration - Grouped */}
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Grid Configuration</label>
                        <p className="text-sm text-slate-500">Control the number of columns for different devices.</p>
                      </div>

                      <div className="bg-slate-50/50 rounded-[2rem] p-6 border border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label id="desktop-grid-label" className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Monitor size="14" /> Desktop
                            </label>
                            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-blue-600 shadow-sm">{columns} Cols</span>
                          </div>
                          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm" role="group" aria-labelledby="desktop-grid-label">
                            {[1, 2, 3, 4, 5].map(n => (
                              <button
                                key={n}
                                onClick={() => setColumns(n)}
                                aria-pressed={columns === n}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                                  columns === n ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <label id="mobile-grid-label" className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                              <Smartphone size="14" /> Mobile
                            </label>
                            <span className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-black text-blue-600 shadow-sm">{mobileColumns} Col</span>
                          </div>
                          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm" role="group" aria-labelledby="mobile-grid-label">
                            {[1, 2, 3].map(n => (
                              <button
                                key={n}
                                onClick={() => setMobileColumns(n)}
                                aria-pressed={mobileColumns === n}
                                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                                  mobileColumns === n ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                {n}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Visibility Toggles - Premium Look */}
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <label id="visibility-options-label" className="text-sm font-black text-slate-900 uppercase tracking-wider">Visibility Options</label>
                        <p className="text-sm text-slate-500">Fine-tune which UI elements are visible.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4" role="group" aria-labelledby="visibility-options-label">
                        {[
                          { label: 'Show Flags', value: showFlags, setter: setShowFlags, desc: 'Country flags' },
                          { label: 'Search Bar', value: showSearch, setter: setShowSearch, desc: 'Quick filtering' },
                          { label: 'Native Names', value: showNativeNames, setter: setShowNativeNames, desc: 'Original script' },
                          { label: 'Header Title', value: showTitle, setter: setShowTitle, desc: 'Section header' },
                        ].map((opt) => (
                          <button
                            key={opt.label}
                            onClick={() => opt.setter(!opt.value)}
                            aria-pressed={opt.value}
                            className={`flex flex-col gap-4 p-5 rounded-3xl border-2 text-left transition-all ${
                              opt.value
                                ? 'bg-blue-50/30 border-blue-600'
                                : 'bg-white border-slate-100 hover:border-blue-200'
                            }`}
                          >
                            <div className="flex w-full items-center justify-between">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                opt.value ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {opt.label.includes('Flags') && <Languages size={18} />}
                                {opt.label.includes('Search') && <Search size={18} />}
                                {opt.label.includes('Native') && <Sparkles size={18} />}
                                {opt.label.includes('Header') && <Layout size={18} />}
                              </div>
                              <div className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${
                                opt.value ? 'bg-blue-600' : 'bg-slate-200'
                              }`}>
                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
                                  opt.value ? 'left-7' : 'left-1'
                                }`} />
                              </div>
                            </div>
                            <div>
                              <span className={`text-sm font-black block ${opt.value ? 'text-blue-900' : 'text-slate-900'}`}>{opt.label}</span>
                              <span className={`text-[11px] font-bold uppercase tracking-tight ${opt.value ? 'text-blue-500' : 'text-slate-400'}`}>{opt.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'advanced' && (
                  <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Trigger Button Section */}
                    <div className="space-y-8">
                      <div className="flex flex-col gap-1.5">
                        <label id="trigger-button-label" className="text-sm font-black text-slate-900 uppercase tracking-wider">Trigger Button</label>
                        <p className="text-sm text-slate-500">Customize the floating button behavior and appearance.</p>
                      </div>

                      <div className="bg-slate-50/50 rounded-[2rem] p-8 border border-slate-100 space-y-10">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                          <div className="space-y-4">
                            <label htmlFor="button-position" className="text-xs font-black text-slate-500 uppercase tracking-widest">Screen Position</label>
                            <div className="relative group">
                              <select
                                id="button-position"
                                value={buttonConfig.position}
                                onChange={(e) => setButtonConfig({ ...buttonConfig, position: e.target.value as any })}
                                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-slate-700 shadow-sm group-hover:border-blue-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none appearance-none"
                              >
                                <option value="bottom-left">Bottom Left</option>
                                <option value="bottom-right">Bottom Right</option>
                                <option value="top-left">Top Left</option>
                                <option value="top-right">Top Right</option>
                              </select>
                              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <Layout size={18} />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Button Shape</span>
                            <div className="flex gap-1.5 p-1.5 bg-white border-2 border-slate-100 shadow-sm rounded-2xl" role="group" aria-label="Button Shape">
                              {['pill', 'circle', 'square'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => setButtonConfig({ ...buttonConfig, shape: s as any })}
                                  aria-pressed={buttonConfig.shape === s}
                                  className={`flex-1 py-3 rounded-xl text-xs font-black transition-all uppercase tracking-wider ${
                                    buttonConfig.shape === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-6 border-t border-slate-200/50">
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <label htmlFor="offset-x" className="text-xs font-black text-slate-500 uppercase tracking-widest">Horizontal Offset</label>
                              <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-black text-blue-600 shadow-sm">{buttonConfig.offset?.x ?? 24}px</span>
                            </div>
                            <input
                              id="offset-x"
                              type="range" min="0" max="100" step="4"
                              value={buttonConfig.offset?.x ?? 24}
                              onChange={(e) => setButtonConfig({
                                ...buttonConfig,
                                offset: { ...(buttonConfig.offset || { x: 24, y: 24 }), x: parseInt(e.target.value) }
                              })}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <label htmlFor="offset-y" className="text-xs font-black text-slate-500 uppercase tracking-widest">Vertical Offset</label>
                              <span className="px-3 py-1 bg-white border border-slate-200 rounded-xl text-xs font-black text-blue-600 shadow-sm">{buttonConfig.offset?.y ?? 24}px</span>
                            </div>
                            <input
                              id="offset-y"
                              type="range" min="0" max="100" step="4"
                              value={buttonConfig.offset?.y ?? 24}
                              onChange={(e) => setButtonConfig({
                                ...buttonConfig,
                                offset: { ...(buttonConfig.offset || { x: 24, y: 24 }), y: parseInt(e.target.value) }
                              })}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-200/50">
                          {[
                            { label: 'Globe Icon', key: 'showGlobe', icon: Globe, desc: 'Show globe icon' },
                            { label: 'Text Label', key: 'showLabel', icon: Languages, desc: 'Show "Translate"' },
                            { label: 'Current Flag', key: 'showFlag', icon: Sparkles, desc: 'Show active flag' },
                          ].map((opt) => (
                            <button
                              key={opt.label}
                              onClick={() => setButtonConfig({ ...buttonConfig, [opt.key]: !((buttonConfig as any)[opt.key]) })}
                              aria-pressed={(buttonConfig as any)[opt.key]}
                              aria-label={opt.desc}
                              className={`group flex flex-col gap-4 items-start p-5 rounded-3xl border-2 transition-all ${
                                (buttonConfig as any)[opt.key]
                                  ? 'bg-white border-blue-600 shadow-xl shadow-blue-50'
                                  : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                              }`}
                            >
                              <div className="flex w-full items-center justify-between">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                  (buttonConfig as any)[opt.key] ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-blue-600'
                                }`}>
                                  <opt.icon size={18} />
                                </div>
                                <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${
                                  (buttonConfig as any)[opt.key] ? 'bg-blue-600' : 'bg-slate-200'
                                }`}>
                                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-300 ${
                                    (buttonConfig as any)[opt.key] ? 'left-6' : 'left-1'
                                  }`} />
                                </div>
                              </div>
                              <div className="text-left">
                                <span className={`text-xs font-black block uppercase tracking-wider ${
                                  (buttonConfig as any)[opt.key] ? 'text-blue-900' : 'text-slate-900'
                                }`}>{opt.label}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Language Support Section */}
                    <div className="space-y-6 pt-8 border-t border-slate-100">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-black text-slate-900 uppercase tracking-wider">Language Support</label>
                        <p className="text-sm text-slate-500">Filter available languages by region or individual choice.</p>
                      </div>

                      {/* Presets Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: 'All 100+', value: undefined, icon: Globe, desc: 'Full global support' },
                          { label: 'Most Popular', value: ['en', 'fr', 'de', 'es', 'ja', 'zh-CN', 'it', 'pt', 'ru'], icon: Sparkles, desc: 'Top 9 languages' },
                          { label: 'European', value: ['en', 'fr', 'de', 'es', 'it', 'pt', 'nl', 'pl', 'sv'], icon: Layout, desc: 'Common EU' },
                          { label: 'Asian', value: ['zh-CN', 'ja', 'ko', 'hi', 'bn', 'th', 'vi', 'id', 'ms'], icon: Languages, desc: 'Common Asian' },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => setAvailableLangs(preset.value)}
                            aria-pressed={JSON.stringify(availableLangs) === JSON.stringify(preset.value)}
                            className={`group flex flex-col items-start p-5 rounded-[1.5rem] border-2 text-left transition-all ${
                              JSON.stringify(availableLangs) === JSON.stringify(preset.value)
                                ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-4 w-full">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                JSON.stringify(availableLangs) === JSON.stringify(preset.value)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                              }`}>
                                <preset.icon size={20} />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-black block">{preset.label}</span>
                                <span className={`text-[10px] font-bold uppercase tracking-tight ${JSON.stringify(availableLangs) === JSON.stringify(preset.value) ? 'text-slate-400' : 'text-slate-400'}`}>{preset.desc}</span>
                              </div>
                              {JSON.stringify(availableLangs) === JSON.stringify(preset.value) && (
                                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                                  <Check size={12} className="text-white" />
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Individual Selector */}
                      <div className="mt-6">
                        <button
                          onClick={() => setShowLangSelector(!showLangSelector)}
                          className="w-full flex items-center justify-between p-5 bg-white border-2 border-slate-100 rounded-2xl hover:border-blue-200 transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                              <Settings size={20} />
                            </div>
                            <div className="text-left">
                              <span className="text-sm font-black block text-slate-900">Custom Selection</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                {availableLangs ? `${availableLangs.length} languages selected` : 'Select specific languages'}
                              </span>
                            </div>
                          </div>
                          {showLangSelector ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                        </button>

                        <AnimatePresence>
                          {showLangSelector && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4">
                                <div className="relative">
                                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                  <input
                                    type="text"
                                    placeholder="Search languages..."
                                    value={langSearch}
                                    onChange={(e) => setLangSearch(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
                                  />
                                </div>

                                <div className="max-h-[300px] overflow-y-auto custom-scrollbar grid grid-cols-2 gap-2 p-1">
                                  {filteredLangs.map(l => (
                                    <button
                                      key={l.code}
                                      onClick={() => toggleLang(l.code)}
                                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                        availableLangs?.includes(l.code)
                                          ? 'bg-blue-600 border-blue-600 text-white'
                                          : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                                      }`}
                                    >
                                      <span className="text-lg">{l.flag_emoji}</span>
                                      <div className="min-w-0">
                                        <span className="text-xs font-black block truncate">{l.name}</span>
                                        <span className={`text-[9px] font-bold uppercase tracking-tighter block truncate ${availableLangs?.includes(l.code) ? 'text-blue-100' : 'text-slate-400'}`}>
                                          {l.code}
                                        </span>
                                      </div>
                                      {availableLangs?.includes(l.code) && <Check size={12} className="ml-auto flex-shrink-0" />}
                                    </button>
                                  ))}
                                </div>

                                {availableLangs && (
                                  <button
                                    onClick={() => setAvailableLangs(undefined)}
                                    className="w-full py-3 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-all uppercase tracking-widest flex items-center justify-center gap-2"
                                  >
                                    <CloseIcon size={14} />
                                    Clear Selection
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Code Preview */}
            <div className="bg-slate-900 rounded-3xl p-8 text-slate-300 font-mono text-sm relative overflow-hidden group flex flex-col h-full min-h-[600px]">
              <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    copied
                      ? 'bg-green-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <div className="flex items-center gap-2 text-slate-500 bg-slate-800/50 px-3 py-2 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] font-bold uppercase tracking-widest">JSX</span>
                  <Code size={16} />
                </div>
              </div>

              <div className="flex-1 mt-12">
                <pre className="text-sm font-mono overflow-x-auto custom-scrollbar">
                  <code className="text-blue-400">{'<GoogleTranslate '}</code>
                  <div className="pl-4 border-l border-slate-700/50 my-2">
                    <div className="pt-2">
                      <span className="text-indigo-400">{'theme'}</span>
                      <span className="text-white">{'={{'}</span>
                    </div>
                    <div className="pl-4">
                      {Object.entries(theme).filter(([_, v]) => v !== undefined).map(([k, v]) => (
                        <div key={k}>
                          <span className="text-slate-500">{`${k}: `}</span>
                          <span className="text-green-400">{`'${v}'`}</span>
                          <span className="text-white">{','}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <span className="text-white">{'}}'}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'variant'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-green-400">{`"${variant}"`}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'buttonConfig'}</span>
                      <span className="text-white">{'={{'}</span>
                      <div className="pl-4">
                        <div>
                          <span className="text-slate-500">{'position: '}</span>
                          <span className="text-green-400">{`'${buttonConfig.position}'`}</span>
                          <span className="text-white">{','}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{'shape: '}</span>
                          <span className="text-green-400">{`'${buttonConfig.shape}'`}</span>
                          <span className="text-white">{','}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{'showGlobe: '}</span>
                          <span className="text-orange-400">{`${buttonConfig.showGlobe}`}</span>
                          <span className="text-white">{','}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{'showLabel: '}</span>
                          <span className="text-orange-400">{`${buttonConfig.showLabel}`}</span>
                          <span className="text-white">{','}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{'showFlag: '}</span>
                          <span className="text-orange-400">{`${buttonConfig.showFlag}`}</span>
                          <span className="text-white">{','}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">{'offset: '}</span>
                          <span className="text-white">{'{ '}</span>
                          <span className="text-slate-500">{'x: '}</span>
                          <span className="text-orange-400">{`${buttonConfig.offset?.x}`}</span>
                          <span className="text-white">{', '}</span>
                          <span className="text-slate-500">{'y: '}</span>
                          <span className="text-orange-400">{`${buttonConfig.offset?.y}`}</span>
                          <span className="text-white">{' }'}</span>
                        </div>
                      </div>
                      <span className="text-white">{'}}'}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'columns'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-orange-400">{`{${columns}}`}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'mobileColumns'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-orange-400">{`{${mobileColumns}}`}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'showFlags'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-orange-400">{`{${showFlags}}`}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'showSearch'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-orange-400">{`{${showSearch}}`}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'showNativeNames'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-orange-400">{`{${showNativeNames}}`}</span>
                    </div>

                    <div className="pt-2">
                      <span className="text-indigo-400">{'showTitle'}</span>
                      <span className="text-white">{'='}</span>
                      <span className="text-orange-400">{`{${showTitle}}`}</span>
                    </div>

                    {availableLangs && (
                      <div className="pt-2">
                        <span className="text-indigo-400">{'availableLanguages'}</span>
                        <span className="text-white">{'='}</span>
                        <span className="text-white">{'['}</span>
                        <span className="text-green-400">{availableLangs.map(l => `'${l}'`).join(', ')}</span>
                        <span className="text-white">{']'}</span>
                      </div>
                    )}
                  </div>
                  <code className="text-blue-400">{'/>'}</code>
                </pre>
              </div>

              <div className="mt-8 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Test Config</p>
                  <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-[10px] font-bold">READY</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Check className="text-blue-400" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm">Styles Synced</p>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        className="bg-blue-500 h-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <Globe size={18} />
              </div>
              <span>Google Translate Picker React</span>
            </div>
            <div className="flex gap-10 text-sm font-bold text-slate-500">
              <a href="https://github.com" className="hover:text-blue-600 transition-colors">GitHub</a>
              <a href="#" className="hover:text-blue-600 transition-colors">NPM</a>
            </div>
            <p className="text-sm text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Google Translate Picker React. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <GoogleTranslate
        theme={{
          ...theme,
          zIndex: 10000,
        }}
        variant={variant}
        showFlags={showFlags}
        showSearch={showSearch}
        showNativeNames={showNativeNames}
        showTitle={showTitle}
        columns={columns}
        mobileColumns={mobileColumns}
        availableLanguages={availableLangs}
        buttonConfig={buttonConfig}
      />
    </main>
  );
}
