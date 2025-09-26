import { describe, expect, it, beforeEach, afterEach } from 'bun:test';
import { defineConfig } from '../src/extensions/index';
import { getVendorExtensions } from '../src/extensions/vendor-loader';

// Mock console.warn to capture collision warnings
let consoleWarnSpy: any;
let capturedWarnings: string[] = [];

describe('Vendor Extension Collision Detection', () => {
  beforeEach(() => {
    // Capture console.warn calls
    consoleWarnSpy = console.warn;
    capturedWarnings = [];
    console.warn = (...args: any[]) => {
      capturedWarnings.push(args.join(' '));
    };
  });

  afterEach(() => {
    // Restore console.warn
    console.warn = consoleWarnSpy;
  });

  it('should detect collisions when vendors define the same extension key', () => {
    // Create test vendor modules with conflicting extension keys
    const vendorA = defineConfig({
      info: {
        name: 'VendorA',
        website: 'https://vendor-a.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-custom-extension': before('info'),
          'x-shared-extension': after('paths')
        }),
        'operation': (before, after) => ({
          'x-operation-extension': after('summary')
        })
      }
    });

    const vendorB = defineConfig({
      info: {
        name: 'VendorB',
        website: 'https://vendor-b.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-different-extension': before('info'),
          'x-shared-extension': after('paths') // Collision with VendorA
        }),
        'operation': (before, after) => ({
          'x-operation-extension': after('summary') // Collision with VendorA
        })
      }
    });

    const vendorC = defineConfig({
      info: {
        name: 'VendorC',
        website: 'https://vendor-c.com'
      },
      extensions: {
        'schema': (before, after) => ({
          'x-schema-extension': after('type')
        })
      }
    });

    // Load extensions with collision scenarios
    const extensions = getVendorExtensions([vendorA, vendorB, vendorC]);

    // Verify that collisions were detected and logged
    expect(capturedWarnings).toHaveLength(2); // Two collisions detected
    
    // Check that the warnings contain the expected collision information
    expect(capturedWarnings[0]).toContain('Extension collision detected!');
    expect(capturedWarnings[0]).toContain('x-shared-extension');
    expect(capturedWarnings[0]).toContain('top-level');
    expect(capturedWarnings[0]).toContain('VendorA');
    expect(capturedWarnings[0]).toContain('VendorB');

    expect(capturedWarnings[1]).toContain('Extension collision detected!');
    expect(capturedWarnings[1]).toContain('x-operation-extension');
    expect(capturedWarnings[1]).toContain('operation');
    expect(capturedWarnings[1]).toContain('VendorA');
    expect(capturedWarnings[1]).toContain('VendorB');

    // Verify that the first vendor's position is used (VendorA wins)
    expect(extensions['top-level']['x-shared-extension']).toBeDefined();
    expect(extensions['operation']['x-operation-extension']).toBeDefined();

    // Verify that non-colliding extensions are still present
    expect(extensions['top-level']['x-custom-extension']).toBeDefined();
    expect(extensions['top-level']['x-different-extension']).toBeDefined();
    expect(extensions['schema']['x-schema-extension']).toBeDefined();
  });

  it('should handle collisions across different contexts', () => {
    const vendorA = defineConfig({
      info: {
        name: 'VendorA',
        website: 'https://vendor-a.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-global-extension': before('info')
        }),
        'operation': (before, after) => ({
          'x-global-extension': after('summary') // Same key, different context
        }),
        'schema': (before, after) => ({
          'x-global-extension': after('type') // Same key, different context
        })
      }
    });

    const vendorB = defineConfig({
      info: {
        name: 'VendorB',
        website: 'https://vendor-b.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-global-extension': before('info') // Collision in top-level
        }),
        'operation': (before, after) => ({
          'x-different-extension': after('summary') // No collision
        })
      }
    });

    const extensions = getVendorExtensions([vendorA, vendorB]);

    // Should only have one collision warning (top-level context)
    expect(capturedWarnings).toHaveLength(1);
    expect(capturedWarnings[0]).toContain('x-global-extension');
    expect(capturedWarnings[0]).toContain('top-level');

    // Verify that extensions in different contexts don't collide
    expect(extensions['top-level']['x-global-extension']).toBeDefined();
    expect(extensions['operation']['x-global-extension']).toBeDefined();
    expect(extensions['schema']['x-global-extension']).toBeDefined();
    expect(extensions['operation']['x-different-extension']).toBeDefined();
  });

  it('should handle multiple collisions from the same vendor', () => {
    const vendorA = defineConfig({
      info: {
        name: 'VendorA',
        website: 'https://vendor-a.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-extension-1': before('info'),
          'x-extension-2': after('paths')
        })
      }
    });

    const vendorB = defineConfig({
      info: {
        name: 'VendorB',
        website: 'https://vendor-b.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-extension-1': before('info'), // Collision 1
          'x-extension-2': after('paths'), // Collision 2
          'x-extension-3': before('info') // No collision
        })
      }
    });

    const extensions = getVendorExtensions([vendorA, vendorB]);

    // Should have two collision warnings
    expect(capturedWarnings).toHaveLength(2);
    
    // Both collisions should be detected
    const collisionKeys = capturedWarnings.map(warning => {
      const match = warning.match(/Key: "([^"]+)"/);
      return match ? match[1] : null;
    }).filter(Boolean);

    expect(collisionKeys).toContain('x-extension-1');
    expect(collisionKeys).toContain('x-extension-2');

    // Verify that all extensions are present (first vendor wins for collisions)
    expect(extensions['top-level']['x-extension-1']).toBeDefined();
    expect(extensions['top-level']['x-extension-2']).toBeDefined();
    expect(extensions['top-level']['x-extension-3']).toBeDefined();
  });

  it('should handle vendor loading failures gracefully', () => {
    // Create a vendor module that will throw an error
    const faultyVendor = defineConfig({
      info: {
        name: 'FaultyVendor',
        website: 'https://faulty-vendor.com'
      },
      extensions: {
        'top-level': (before, after) => {
          throw new Error('Simulated vendor loading error');
        }
      }
    });

    const workingVendor = defineConfig({
      info: {
        name: 'WorkingVendor',
        website: 'https://working-vendor.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-working-extension': before('info')
        })
      }
    });

    const extensions = getVendorExtensions([faultyVendor, workingVendor]);

    // Should have a warning about the faulty vendor
    expect(capturedWarnings).toHaveLength(1);
    expect(capturedWarnings[0]).toContain('Failed to load FaultyVendor extensions');

    // Working vendor's extensions should still be loaded
    expect(extensions['top-level']['x-working-extension']).toBeDefined();
  });

  it('should handle vendors with no extensions', () => {
    const vendorWithNoExtensions = defineConfig({
      info: {
        name: 'NoExtensionsVendor',
        website: 'https://no-extensions.com'
      }
      // No extensions property
    });

    const vendorWithExtensions = defineConfig({
      info: {
        name: 'WithExtensionsVendor',
        website: 'https://with-extensions.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-extension': before('info')
        })
      }
    });

    const extensions = getVendorExtensions([vendorWithNoExtensions, vendorWithExtensions]);

    // Should not have any collision warnings
    expect(capturedWarnings).toHaveLength(0);

    // Extensions from the working vendor should be present
    expect(extensions['top-level']['x-extension']).toBeDefined();
  });

  it('should handle vendors with invalid extension functions', () => {
    const vendorWithInvalidFunction = defineConfig({
      info: {
        name: 'InvalidFunctionVendor',
        website: 'https://invalid-function.com'
      },
      extensions: {
        'top-level': 'not-a-function' as any // Invalid function
      }
    });

    const vendorWithValidFunction = defineConfig({
      info: {
        name: 'ValidFunctionVendor',
        website: 'https://valid-function.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-valid-extension': before('info')
        })
      }
    });

    const extensions = getVendorExtensions([vendorWithInvalidFunction, vendorWithValidFunction]);

    // Should not have any collision warnings (invalid function is ignored)
    expect(capturedWarnings).toHaveLength(0);

    // Valid extensions should still be present
    expect(extensions['top-level']['x-valid-extension']).toBeDefined();
  });

  it('should preserve extension positions correctly', () => {
    const vendorA = defineConfig({
      info: {
        name: 'VendorA',
        website: 'https://vendor-a.com'
      },
      extensions: {
        'top-level': (before, after) => ({
          'x-before-info': before('info'), // Should be position 3
          'x-after-paths': after('paths')  // Should be position 15
        })
      }
    });

    const extensions = getVendorExtensions([vendorA]);

    // Verify positions are correct
    expect(extensions['top-level']['x-before-info']).toBe(3); // Before 'info' at position 3
    expect(extensions['top-level']['x-after-paths']).toBe(14); // After 'paths' at position 13
  });

  it('should handle empty vendor modules array', () => {
    const extensions = getVendorExtensions([]);

    // Should return empty extensions object
    expect(extensions).toEqual({});
    expect(capturedWarnings).toHaveLength(0);
  });
});
