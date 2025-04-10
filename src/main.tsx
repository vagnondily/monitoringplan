
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AppProvider } from './context/AppContext';
import * as serviceWorker from './serviceWorker';

// Create a root element safely
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

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
