// Test setup file for Bun
import { afterAll, beforeAll } from 'bun:test';

// Global test setup
beforeAll(() => {
  // Set up any global test configuration
  console.log('Setting up test environment...');
});

afterAll(() => {
  // Clean up after all tests
  console.log('Cleaning up test environment...');
});

// Mock console methods to reduce noise in tests
const originalConsoleWarn = console.warn;
const originalConsoleLog = console.log;

beforeAll(() => {
  // Suppress console warnings during tests unless explicitly needed
  console.warn = (...args: any[]) => {
    if (args[0]?.includes?.('Vendor extensions loaded successfully')) {
      return; // Suppress this specific message
    }
    originalConsoleWarn(...args);
  };
  
  console.log = (...args: any[]) => {
    if (args[0]?.includes?.('Vendor extensions loaded successfully')) {
      return; // Suppress this specific message
    }
    originalConsoleLog(...args);
  };
});

afterAll(() => {
  // Restore original console methods
  console.warn = originalConsoleWarn;
  console.log = originalConsoleLog;
});
