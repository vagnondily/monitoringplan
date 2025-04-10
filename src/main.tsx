
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import * as serviceWorker from './serviceWorker';

// Initialize React correctly and ensure it's available globally
if (!window.React) {
  window.React = React;
}

// Make sure we have a consistent React context
window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};

// Ensure DOM is ready before mounting React
const mountApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    // Create the root with React 18's createRoot API
    const root = ReactDOM.createRoot(rootElement);
    
    // Render the app with proper React context
    root.render(
      <React.StrictMode>
        <AppProvider>
          <App />
        </AppProvider>
      </React.StrictMode>
    );

    // Register service worker
    serviceWorker.register();
  } catch (error) {
    console.error('Error rendering the application:', error);
  }
};

// Use DOMContentLoaded for initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  // DOM already loaded, mount immediately
  mountApp();
}
