import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Only setup server for Node environments (tests)
export const server = setupServer(...handlers);

