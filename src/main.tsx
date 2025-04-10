
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import * as serviceWorker from './serviceWorker';

// Ensure the DOM is fully loaded before continuing
document.addEventListener('DOMContentLoaded', () => {
  // Create a root element safely
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    // Use createRoot API
    const root = ReactDOM.createRoot(rootElement);

    // Render the app with React.StrictMode
    root.render(
      <React.StrictMode>
        <AppProvider>
          <App />
        </AppProvider>
      </React.StrictMode>,
    );

    // Register service worker for offline capabilities
    serviceWorker.register();
  } catch (error) {
    console.error('Error initializing the application:', error);
  }
});
