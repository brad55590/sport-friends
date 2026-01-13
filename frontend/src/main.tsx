import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { MockProvider, useMockContext } from './context/MockContext'

// Wrapper component to conditionally start MSW
function AppWithMSW() {
  const { useMocks } = useMockContext();
  
  React.useEffect(() => {
    if (useMocks) {
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
  }, [useMocks]);

  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MockProvider>
      <AppWithMSW />
    </MockProvider>
  </React.StrictMode>,
)
