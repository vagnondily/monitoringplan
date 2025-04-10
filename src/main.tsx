
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import * as serviceWorker from './serviceWorker';

// Ensure React is properly available in the global scope
window.React = React;

// Define a function to render the application
const renderApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  try {
    // Create the root using React 18's createRoot API
    const root = ReactDOM.createRoot(rootElement);
    
    // Render the app with proper context providers
    root.render(
      <React.StrictMode>
        <AppProvider>
          <App />
        </AppProvider>
      </React.StrictMode>
    );

    // Register service worker for offline capabilities
    serviceWorker.register();
  } catch (error) {
    console.error('Error rendering the application:', error);
  }
};

// Check if the DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOM is already loaded, render immediately
  renderApp();
}
