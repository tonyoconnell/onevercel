import { z } from 'zod';
import { FC } from 'react';

// Component Types
export interface ONEProps {
  theme?: 'light' | 'dark' | 'earth';
  children?: React.ReactNode;
}

// Mock Types
export interface MockHandler {
  (data: unknown): Promise<unknown>;
}

export interface MockRegistry {
  register: (name: string, handler: MockHandler) => Promise<void>;
  execute: (name: string, data: unknown) => Promise<unknown>;
  clear: () => Promise<void>;
  handlers: Map<string, MockHandler>;
}

export interface MockMonitor {
  log: (event: string, data: unknown) => Promise<void>;
  getEvents: (filter?: string) => Promise<Array<{ event: string; data: unknown }>>;
}

export interface MockONE {
  version: string;
  init: () => Promise<boolean>;
  load: (type: string) => Promise<unknown>;
  save: (type: string, data: unknown) => Promise<boolean>;
  executeCapability: (name: string, params: unknown) => Promise<unknown>;
  handleError: (error: unknown) => Promise<never>;
  store: Record<string, unknown>;
  schemas: {
    agent: z.ZodObject<{
      name: z.ZodString;
      version: z.ZodString;
    }>;
  };
  ONEComponent: FC<ONEProps>;
}

// API Types
export interface APIResponse {
  status: number;
  message: string;
  data: unknown;
  _one: {
    version: string;
    timestamp: string;
    path: string;
  };
}

// Error Types
export const APIErrorTypes = {
  VALIDATION: 'validation_error',
  NOT_FOUND: 'not_found',
  RATE_LIMIT: 'rate_limit',
  MAINTENANCE: 'maintenance',
  SYSTEM: 'system_error'
} as const;

export type APIErrorType = keyof typeof APIErrorTypes; 