// Frontend types - import shared types from /shared/types/typescript
// This file serves as a barrel export for convenience

export * from '../../shared/types/typescript/index';

// Frontend-specific types can be added here
export interface FrontendConfig {
  apiUrl: string;
  apiVersion: string;
}
