import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// Start MSW worker in development
if (import.meta.env.MODE === 'development') {
  import('./mocks/browser').then(({ worker }) => {
    console.log('[MSW] Starting Mock Service Worker...');
    worker.start({ onUnhandledRequest: 'warn' }).then(() => {
      console.log('[MSW] Mock Service Worker started successfully');
    }).catch((error) => {
      console.error('[MSW] Failed to start:', error);
    });
  }).catch((error) => {
    console.error('[MSW] Failed to import worker:', error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
