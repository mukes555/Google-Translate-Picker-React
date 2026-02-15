'use client';

import { useState, useEffect, useRef, useCallback, useMemo, CSSProperties } from 'react';
import { Globe, X, Search } from 'lucide-react';
import LANGUAGE_DATA from '../lib/gtranslate-languages.json';
import '../GoogleTranslate.css';

/* ═══════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════ */

export interface Language {
  code: string;
  name: string;
  native: string;
  flag_emoji: string;
  country_code: string;
  flag_verified: boolean;
}

export interface LanguageData {
  metadata: {
    version: string;
    last_updated: string;
    available_sizes: number[];
  };
  languages: Language[];
}

const DEFAULT_LABELS = {
  title: "Select Language",
  searchPlaceholder: "Search languages...",
  noResults: "No languages found",
  buttonTitle: "Translate",
  closeAction: "Close"
};

export interface GoogleTranslateProps {
  /** Default language code (default: 'en') */
  defaultLanguage?: string;
  /** Array of language codes to show. If not provided, all languages are shown. */
  availableLanguages?: string[];
  /** Custom theme configuration */
  theme?: {
    primaryColor?: string;
    primaryLight?: string;
    backgroundColor?: string;
    textColor?: string;
    secondaryTextColor?: string;
    accentColor?: string;
    borderRadius?: string;
    fontFamily?: string;
    zIndex?: number;
    boxShadow?: string;
    backdropBlur?: string;
    overlayColor?: string;
    searchBackgroundColor?: string;
    searchBorderColor?: string;
    searchTextColor?: string;
    panelBorder?: string;
    buttonPadding?: string;
    buttonBorderRadius?: string;
    buttonBackgroundColor?: string;
    buttonTextColor?: string;
    buttonBorder?: string;
  };
  /** Localization labels */
  labels?: {
    title?: string;
    searchPlaceholder?: string;
    noResults?: string;
    buttonTitle?: string;
    closeAction?: string;
  };
  /** Display variant (default: 'modal') */
  variant?: 'modal' | 'sidebar-left' | 'sidebar-right' | 'dropdown';
  /** Floating button configuration */
  buttonConfig?: {
    position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
    offset?: { x: number; y: number };
    shape?: 'circle' | 'square' | 'pill';
    showGlobe?: boolean;
    showLabel?: boolean;
    showFlag?: boolean;
  };
  /** Whether to show the floating button (default: true) */
  showFloatingButton?: boolean;
  /** Whether to show the search bar (default: true) */
  showSearch?: boolean;
  /** Whether to show flags in the grid (default: true) */
  showFlags?: boolean;
  /** Whether to show native names (default: true) */
  showNativeNames?: boolean;
  /** Whether to show the title (default: true) */
  showTitle?: boolean;
  /** Number of columns in the grid (default: 3) */
  columns?: number;
  /** Number of columns on mobile (default: 1) */
  mobileColumns?: number;
  /** Mobile-specific overrides */
  mobileConfig?: {
    variant?: 'modal' | 'sidebar-left' | 'sidebar-right' | 'dropdown';
    showSearch?: boolean;
    showFlags?: boolean;
    showNativeNames?: boolean;
    showTitle?: boolean;
    columns?: number;
    showFloatingButton?: boolean;
    /** Override button configuration on mobile */
    buttonConfig?: {
      position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
      offset?: { x: number; y: number };
      shape?: 'circle' | 'square' | 'pill';
      showGlobe?: boolean;
      showLabel?: boolean;
      showFlag?: boolean;
    };
  };
  /** Whether to show the Google Translate toolbar (default: false) */
  showToolbar?: boolean;
  /** Callback when language changes */
  onLanguageChange?: (code: string) => void;
  /** Custom class name for the wrapper */
  className?: string;
  /** Custom style for the wrapper */
  style?: CSSProperties;
}

const LANGUAGES = (LANGUAGE_DATA as LanguageData).languages;

/* ═══════════════════════════════════════════════════════════════
   Utilities
   ═══════════════════════════════════════════════════════════════ */

/**
 * Detects current language from Google Translate cookie
 */
function detectLang(): string {
  if (typeof document === 'undefined') return 'en';
  const m = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return m?.[1] ?? 'en';
}

/**
 * Applies translation by setting Google Translate cookie
 */
function applyTranslation(code: string) {
  if (typeof window === 'undefined') return;

  const host = window.location.hostname;
  const parts = host.split('.');
  const isLocalhost = host === 'localhost' || host === '127.0.0.1';
  const domain = parts.length > 2 ? `.${parts.slice(-2).join('.')}` : host;

  const cookieName = 'googtrans';
  const cookieValue = `/en/${code}`;
  const expires = new Date(Date.now() + 365 * 864e5).toUTCString();

  const setCookie = (value: string, dom?: string) => {
    let cookieStr = `${cookieName}=${value}; expires=${expires}; path=/;`;
    if (dom && !isLocalhost) cookieStr += ` domain=${dom};`;
    document.cookie = cookieStr;
  };

  if (code === 'en') {
    const clearCookie = (dom?: string) => {
      let str = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      if (dom && !isLocalhost) str += ` domain=${dom};`;
      document.cookie = str;
    };

    clearCookie();
    clearCookie(host);
    clearCookie(domain);
  } else {
    setCookie(cookieValue);
    setCookie(cookieValue, host);
    if (domain !== host) {
      setCookie(cookieValue, domain);
    }
  }

  // Brief delay to ensure cookie is written before reload
  setTimeout(() => {
    window.location.reload();
  }, 100);
}

/* ═══════════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════════ */

export default function GoogleTranslate({
  defaultLanguage = 'en',
  availableLanguages,
  theme,
  labels,
  variant = 'modal',
  buttonConfig,
  showFloatingButton = true,
  showSearch = true,
  showFlags = true,
  showNativeNames = true,
  showTitle = true,
  columns,
  mobileColumns,
  mobileConfig,
  onLanguageChange,
  showToolbar = false,
  className,
  style,
}: GoogleTranslateProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [currentLang, setCurrentLang] = useState(defaultLanguage);
  const [isMobile, setIsMobile] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Detect mobile
  useEffect(() => {
    // We treat anything smaller than 1024px (tablets and mobile) as mobile for configuration purposes
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Responsive settings
  const responsiveSettings = useMemo(() => {
    if (!isMobile || !mobileConfig) {
      return {
        variant,
        showSearch,
        showFlags,
        showNativeNames,
        showTitle,
        columns: (isMobile && mobileColumns) ? mobileColumns : (columns || 3),
        showFloatingButton,
      };
    }

    return {
      variant: mobileConfig.variant || variant,
      showSearch: mobileConfig.showSearch !== undefined ? mobileConfig.showSearch : showSearch,
      showFlags: mobileConfig.showFlags !== undefined ? mobileConfig.showFlags : showFlags,
      showNativeNames: mobileConfig.showNativeNames !== undefined ? mobileConfig.showNativeNames : showNativeNames,
      showTitle: mobileConfig.showTitle !== undefined ? mobileConfig.showTitle : showTitle,
      columns: mobileConfig.columns || mobileColumns || 1,
      showFloatingButton: mobileConfig.showFloatingButton !== undefined ? mobileConfig.showFloatingButton : showFloatingButton,
    };
  }, [isMobile, mobileConfig, variant, showSearch, showFlags, showNativeNames, showTitle, columns, mobileColumns, showFloatingButton]);

  // Defaults for buttonConfig
  const bConfig = useMemo(() => {
    // Determine the base config, allowing mobile overrides
    const baseConfig = (isMobile && mobileConfig?.buttonConfig)
      ? { ...buttonConfig, ...mobileConfig.buttonConfig }
      : buttonConfig;

    const showGlobe = baseConfig?.showGlobe !== false;
    const showLabel = baseConfig?.showLabel !== false;
    const showFlag = baseConfig?.showFlag !== false;

    // Safety check: ensure at least one element is visible
    const anyVisible = showGlobe || showLabel || showFlag;

    return {
      position: baseConfig?.position || 'bottom-left',
      shape: baseConfig?.shape || 'pill',
      showGlobe: anyVisible ? showGlobe : true, // Fallback to globe if all hidden
      showLabel: showLabel,
      showFlag: showFlag,
      offset: baseConfig?.offset || { x: 24, y: 24 },
    };
  }, [buttonConfig, isMobile, mobileConfig]);

  /* ── Filtered Languages ── */
  const supportedLanguages = useMemo(() => {
    if (!availableLanguages) return LANGUAGES;
    return LANGUAGES.filter(l => availableLanguages.includes(l.code));
  }, [availableLanguages]);

  /* ── Bootstrap Google Translate script ── */
  useEffect(() => {
    const initWidget = () => {
      if ((window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement({
          pageLanguage: defaultLanguage,
          includedLanguages: supportedLanguages.map(l => l.code).join(','),
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        }, 'google_translate_element');
      }
    };

    if (document.getElementById('google-translate-script')) {
       // If script is already loaded/loading, try to init
       if ((window as any).google?.translate) {
         initWidget();
       }
       return;
    }

    // Standard Google Translate Element Init
    (window as any).googleTranslateElementInit = initWidget;

    const s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    s.id = 'google-translate-script';
    document.body.appendChild(s);
  }, [defaultLanguage, supportedLanguages]);

  /* ── Sync state with cookie ── */
  useEffect(() => {
    const detected = detectLang();
    setCurrentLang(detected);
  }, []);

  /* ── Mobile trigger bridge ── */
  useEffect(() => {
    const open = () => setIsOpen(true);
    window.addEventListener('open-language-picker', open);
    return () => window.removeEventListener('open-language-picker', open);
  }, []);

  /* ── Overlay side-effects ── */
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        if (searchRef.current) {
          searchRef.current.focus();
        }
      }, 100);
      document.body.style.overflow = 'hidden';
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setSearch('');
    }
  }, [isOpen]);

  /* ── Close on outside click ── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  /* ── Language selection ── */
  const selectLanguage = useCallback((code: string) => {
    // Only proceed if it's a different language
    if (code === currentLang) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setCurrentLang(code);
    if (onLanguageChange) onLanguageChange(code);

    // Immediate feedback/loading state could be added here
    applyTranslation(code);
  }, [onLanguageChange, currentLang]);

  /* ── Derived state ── */
  const currentInfo = useMemo(
    () => supportedLanguages.find((l) => l.code === currentLang) || supportedLanguages.find(l => l.code === 'en') || LANGUAGES[0],
    [currentLang, supportedLanguages],
  );

  const filtered = useMemo(() => {
    if (!search) return supportedLanguages;
    const q = search.toLowerCase().trim();
    return supportedLanguages.filter(
      (l) => l.name.toLowerCase().includes(q) || l.native.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
    );
  }, [search, supportedLanguages]);

  /* ── Custom Theme Variables ── */
  const themeStyles = useMemo(() => {
    const vars: Record<string, string> = {};
    if (theme?.primaryColor) vars['--gtw-primary-color'] = theme.primaryColor;
    if (theme?.primaryLight) vars['--gtw-primary-light'] = theme.primaryLight;
    if (theme?.backgroundColor) vars['--gtw-background-color'] = theme.backgroundColor;
    if (theme?.textColor) vars['--gtw-text-color'] = theme.textColor;
    if (theme?.secondaryTextColor) vars['--gtw-secondary-text-color'] = theme.secondaryTextColor;
    if (theme?.accentColor) vars['--gtw-accent-color'] = theme.accentColor;
    if (theme?.borderRadius) vars['--gtw-border-radius'] = theme.borderRadius;
    if (theme?.fontFamily) vars['--gtw-font-family'] = theme.fontFamily;
    if (theme?.zIndex) vars['--gtw-z-index'] = theme.zIndex.toString();
    if (theme?.boxShadow) vars['--gtw-box-shadow'] = theme.boxShadow;
    if (theme?.backdropBlur) vars['--gtw-backdrop-blur'] = theme.backdropBlur;
    if (theme?.overlayColor) vars['--gtw-overlay-color'] = theme.overlayColor;
    if (theme?.searchBackgroundColor) vars['--gtw-search-bg'] = theme.searchBackgroundColor;
    if (theme?.searchBorderColor) vars['--gtw-search-border'] = theme.searchBorderColor;
    if (theme?.searchTextColor) vars['--gtw-search-text'] = theme.searchTextColor;
    if (theme?.panelBorder) vars['--gtw-panel-border'] = theme.panelBorder;
    if (theme?.buttonPadding) vars['--gtw-button-padding'] = theme.buttonPadding;
    if (theme?.buttonBorderRadius) vars['--gtw-button-radius'] = theme.buttonBorderRadius;
    if (theme?.buttonBackgroundColor) vars['--gtw-button-bg'] = theme.buttonBackgroundColor;
    if (theme?.buttonTextColor) vars['--gtw-button-text'] = theme.buttonTextColor;
    if (theme?.buttonBorder) vars['--gtw-button-border'] = theme.buttonBorder;

    // Fab Position & Shape
    vars['--gtw-fab-x'] = `${bConfig.offset.x}px`;
    vars['--gtw-fab-y'] = `${bConfig.offset.y}px`;
    if (bConfig.position.includes('left')) {
      vars['--gtw-fab-left'] = vars['--gtw-fab-x'];
      vars['--gtw-fab-right'] = 'auto';
    } else {
      vars['--gtw-fab-right'] = vars['--gtw-fab-x'];
      vars['--gtw-fab-left'] = 'auto';
    }
    if (bConfig.position.includes('top')) {
      vars['--gtw-fab-top'] = vars['--gtw-fab-y'];
      vars['--gtw-fab-bottom'] = 'auto';
    } else {
      vars['--gtw-fab-bottom'] = vars['--gtw-fab-y'];
      vars['--gtw-fab-top'] = 'auto';
    }

    if (bConfig.shape === 'circle') vars['--gtw-button-radius'] = '50%';
    else if (bConfig.shape === 'square') vars['--gtw-button-radius'] = '8px';
    else if (bConfig.shape === 'pill') vars['--gtw-button-radius'] = '50px';

    return vars as CSSProperties;
  }, [theme, bConfig]);

  const gridStyle = useMemo(() => {
    const vars: Record<string, string> = {};
    const cols = responsiveSettings.columns;
    vars['--gtw-grid-cols'] = cols.toString();

    // Calculate dynamic panel widths based on column count
    // Base width: ~240px per column + padding/gaps
    const calculatedWidth = Math.min(cols * 240 + 40, 1200); // Max 1200px
    vars['--gtw-panel-width'] = `${calculatedWidth}px`;
    vars['--gtw-sidebar-width'] = `${Math.min(cols * 240 + 20, 1000)}px`;
    vars['--gtw-dropdown-width'] = `${Math.min(cols * 240 + 20, 800)}px`;

    return vars as CSSProperties;
  }, [responsiveSettings.columns]);

  /* ── Render ── */
  return (
    <div
      className={`gtw-wrapper gtw-variant-${responsiveSettings.variant} ${className || ''}`}
      style={{ ...themeStyles, ...gridStyle, ...style }}
    >
      {/* Google Translate Picker React invisible wrapper */}
      <div
        id="google_translate_element"
        style={{ position: 'fixed', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}
      />

      {/* Hide toolbar if disabled */}
      {!showToolbar && (
        <style>{`
          .goog-te-banner-frame {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
          }
          .goog-te-banner-frame.skiptranslate {
            display: none !important;
            visibility: hidden !important;
            height: 0 !important;
            width: 0 !important;
          }
          body {
            top: 0px !important;
          }
          .goog-te-balloon-frame {
            display: none !important;
            visibility: hidden !important;
            box-shadow: none !important;
          }
          .goog-text-highlight {
            background: none !important;
            box-shadow: none !important;
          }
          #goog-gt-tt {
            display: none !important;
            visibility: hidden !important;
          }
          .goog-te-gadget-simple {
             background-color: transparent !important;
          }
          .VIpgJd-ZVi9od-ORHb-OEVmcd {
            display: none !important;
            visibility: hidden !important;
          }
          .VIpgJd-ZVi9od-l4eHX-hSRGPd {
            display: none !important;
            visibility: hidden !important;
          }
        `}</style>
      )}

      {/* Desktop floating button */}
      {responsiveSettings.showFloatingButton && (
        <button
            onClick={() => setIsOpen(true)}
            className="gtw-desktop-fab"
            aria-label={labels?.buttonTitle || DEFAULT_LABELS.buttonTitle}
            title={labels?.buttonTitle || DEFAULT_LABELS.buttonTitle}
          >
            {bConfig.showFlag && currentInfo?.flag_emoji && (
              <span className="gtw-fab-emoji" aria-hidden="true">
                {currentInfo.flag_emoji}
              </span>
            )}
            {bConfig.showGlobe && <Globe size={16} className="gtw-fab-globe" />}
            {bConfig.showLabel && <span className="gtw-fab-label">{labels?.buttonTitle || currentInfo?.name || DEFAULT_LABELS.buttonTitle}</span>}
          </button>
        )}

        {/* Overlay */}
        {isOpen && (
          <div className="gtw-overlay" role="presentation">
            <div className="gtw-backdrop" onClick={() => setIsOpen(false)} />
            <div
              className="gtw-panel notranslate"
              translate="no"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="gtw-title"
            >
              {/* Header */}
              {responsiveSettings.showTitle && (
                <div className="gtw-panel-header">
                  <div className="gtw-panel-title" id="gtw-title">
                    <Globe size={20} aria-hidden="true" />
                    <span>{labels?.title || DEFAULT_LABELS.title}</span>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="gtw-close-btn" aria-label={labels?.closeAction || DEFAULT_LABELS.closeAction}>
                    <X size={20} aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Search */}
              {responsiveSettings.showSearch && (
                <div className="gtw-search-wrap">
                  <label htmlFor="gtw-search-input" className="sr-only">
                    {labels?.searchPlaceholder || DEFAULT_LABELS.searchPlaceholder}
                  </label>
                  <Search size={16} className="gtw-search-icon" aria-hidden="true" />
                  <input
                    id="gtw-search-input"
                    ref={searchRef}
                    type="text"
                    placeholder={labels?.searchPlaceholder || DEFAULT_LABELS.searchPlaceholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="gtw-search-input"
                    aria-label={labels?.searchPlaceholder || DEFAULT_LABELS.searchPlaceholder}
                  />
                </div>
              )}

              {/* Grid */}
              <div
                className="gtw-lang-grid"
                style={gridStyle}
                role="list"
              >
                {filtered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => selectLanguage(lang.code)}
                    className={`gtw-lang-item${lang.code === currentLang ? ' gtw-lang-active' : ''}`}
                    role="listitem"
                    aria-current={lang.code === currentLang ? 'true' : undefined}
                    aria-label={`${lang.name}${lang.native !== lang.name ? ` (${lang.native})` : ''}`}
                  >
                    {responsiveSettings.showFlags && lang.flag_emoji && (
                      <span className="gtw-lang-emoji" aria-hidden="true">
                        {lang.flag_emoji}
                      </span>
                    )}
                    <div className="gtw-lang-info">
                      <span className="gtw-lang-name">{lang.name}</span>
                      {responsiveSettings.showNativeNames && lang.native !== lang.name && (
                        <span className="gtw-lang-native" aria-hidden="true">{lang.native}</span>
                      )}
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="gtw-no-results">
                    {labels?.noResults || DEFAULT_LABELS.noResults}
                  </div>
                )}
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Mobile trigger bridge component
   ═══════════════════════════════════════════════════════════════ */

/**
 * A mobile-optimized trigger button for the language picker.
 * Use this in your navigation bar or mobile menu.
 */
export function GoogleTranslateMobileTrigger({
  className,
  style
}: {
  className?: string;
  style?: CSSProperties
}) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    setLang(detectLang());
  }, []);

  const currentInfo = LANGUAGES.find(l => l.code === lang);

  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-language-picker'))}
      className={`gtw-mobile-trigger ${className || ''}`}
      style={style}
      aria-label="Translate this page"
    >
      {currentInfo?.flag_emoji && (
        <span className="gtw-mobile-emoji" aria-hidden="true">
          {currentInfo.flag_emoji}
        </span>
      )}
      <Globe size={16} />
    </button>
  );
}
