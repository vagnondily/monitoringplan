
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import * as serviceWorker from './serviceWorker';

// Ensure DOM is fully loaded before mounting React
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
