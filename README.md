# Google Translate Picker React

A highly customizable, lightweight, and modern React language picker component for Google Translate.

Built with accessibility and performance in mind, this picker allows you to integrate Google Translate into your React applications with a beautiful, responsive UI that matches your brand identity.

## 🚀 Features

- 🌍 **100+ Languages** supported via the official Google Translate Element API.
- 🏳️ **Native Emoji Flags**: Uses high-performance native emojis for flags, reducing external requests and ensuring privacy.
- 🎨 **Fully Customizable** via the `theme` prop or CSS custom properties.
- 📱 **Responsive Design** with dedicated mobile layouts and touch-friendly controls.
- 🛠 **Multiple Variants**: Choose between Modal, Sidebar (Left/Right), or Dropdown layouts.
- 🔍 **Real-time Search**: Built-in language filtering for a better user experience.
- 📦 **Lightweight**: Zero heavy dependencies, optimized for production.
- ♿ **Accessible**: ARIA-compliant, keyboard navigable, and screen-reader friendly.

## 📦 Installation

```bash
npm install google-translate-picker-react
# or
yarn add google-translate-picker-react
```

## ⚡ Quick Start

1. Import the component and its styles:

```tsx
import { GoogleTranslate } from 'google-translate-picker-react';
import 'google-translate-picker-react/dist/index.css';

function App() {
  return (
    <div className="App">
      <h1>Hello World</h1>

      <GoogleTranslate
        defaultLanguage="en"
        variant="modal"
      />
    </div>
  );
}
```

## 🛠 Configuration Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `defaultLanguage` | `string` | `'en'` | The initial language code (e.g., 'en', 'es', 'fr'). |
| `variant` | `'modal' \| 'sidebar-left' \| 'sidebar-right' \| 'dropdown'` | `'modal'` | The UI layout style of the language picker. |
| `theme` | `ThemeConfig` | `defaultTheme` | Object containing custom colors, borders, and effects. |
| `buttonConfig` | `ButtonConfig` | `defaultButtonConfig` | Configuration for the floating trigger button. |
| `mobileConfig` | `MobileConfig` | `undefined` | Overrides for mobile devices (<1024px). |
| `availableLanguages` | `string[]` | `undefined` | Restrict the picker to specific language codes. |
| `columns` | `number` | `3` | Number of columns in the language grid (Desktop). |
| `mobileColumns` | `number` | `1` | Number of columns in the language grid (Mobile). |
| `showFloatingButton` | `boolean` | `true` | Show/hide the floating trigger button. |
| `showSearch` | `boolean` | `true` | Show/hide the search bar inside the picker. |
| `showFlags` | `boolean` | `true` | Show/hide country flags next to language names. |
| `showNativeNames` | `boolean` | `true` | Show/hide language names in their native script. |
| `showTitle` | `boolean` | `true` | Show/hide the "Select Language" header title. |
| `showToolbar` | `boolean` | `false` | Show/hide the Google Translate toolbar at the top. |
| `labels` | `LabelsConfig` | `undefined` | Custom text for labels (title, search, no results, buttons). |
| `onLanguageChange` | `(code: string) => void` | `undefined` | Callback function when a language is selected. |
| `className` | `string` | `undefined` | Custom class name for the wrapper. |
| `style` | `CSSProperties` | `undefined` | Custom inline styles for the wrapper. |

### Theme Configuration (`theme`)

```tsx
<GoogleTranslate
  theme={{
    primaryColor: '#005EB8',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    borderRadius: '12px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)',
    backdropBlur: '8px',
  }}
/>
```

### Button Configuration (`buttonConfig`)

```tsx
<GoogleTranslate
  buttonConfig={{
    position: 'bottom-right',
    shape: 'pill', // 'pill' | 'circle' | 'square'
    showGlobe: true,
    showLabel: true,
    showFlag: true,
    offset: { x: 24, y: 24 }
  }}
/>
```

### Mobile Configuration (`mobileConfig`)

Override specific settings for mobile devices (screens narrower than 1024px).

```tsx
<GoogleTranslate
  mobileConfig={{
    variant: 'sidebar-left', // Use sidebar on mobile
    showSearch: false,       // Hide search on mobile
    showFloatingButton: true, // Show/hide floating button on mobile
    columns: 2,              // 2 columns grid on mobile
    buttonConfig: {          // Custom button position for mobile
      position: 'bottom-left',
      shape: 'circle'
    }
  }}
/>
```

### Labels Configuration (`labels`)

```tsx
<GoogleTranslate
  labels={{
    title: "Choose Language",
    searchPlaceholder: "Filter...",
    noResults: "Nothing found",
    buttonTitle: "Translate",
    closeAction: "Dismiss"
  }}
/>
```

## 🎨 Custom Styling

In addition to the `theme` prop, you can override the following CSS variables in your global stylesheet:

```css
:root {
  --gtw-primary-color: #005EB8;
  --gtw-accent-color: rgba(0, 94, 184, 0.05);
  --gtw-background-color: #ffffff;
  --gtw-text-color: #1e293b;
  --gtw-border-radius: 12px;
  --gtw-font-family: 'Inter', system-ui, sans-serif;
  --gtw-box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  --gtw-backdrop-blur: 12px;
}
```

## 📄 License

MIT © Google Translate Picker React
