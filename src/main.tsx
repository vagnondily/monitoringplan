
import * as React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import * as serviceWorker from './serviceWorker';

// Make sure React is properly available globally
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

// Make sure the DOM is fully loaded before rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  // DOM is already loaded, render immediately
  renderApp();
}
