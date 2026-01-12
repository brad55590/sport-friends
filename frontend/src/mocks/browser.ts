import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

console.log('[MSW] Handlers loaded:', handlers.length);

export const worker = setupWorker(...handlers);
