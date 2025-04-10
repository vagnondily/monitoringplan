
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

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
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
});
