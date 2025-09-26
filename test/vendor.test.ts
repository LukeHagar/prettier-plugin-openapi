import { describe, expect, it } from 'bun:test';
import { getVendorExtensions } from '../src/extensions';

describe('Vendor Extension System', () => {
  it('should load vendor extensions from TS files', () => {
    const vendorExtensions = getVendorExtensions();
    
    // Should have loaded Speakeasy and Redoc extensions
    expect(vendorExtensions).toBeDefined();
    expect(typeof vendorExtensions).toBe('object');
    
    // Check if extensions were loaded
    expect(vendorExtensions['top-level']).toBeDefined();
    expect(vendorExtensions['top-level']['x-speakeasy-sdk']).toBe(3); // before('info') = position 3
    expect(vendorExtensions['top-level']['x-speakeasy-auth']).toBe(14); // after('paths') = position 14
  });


  it('should handle vendor extensions gracefully', () => {
    // This test ensures the system doesn't crash when loading extensions
    const vendorExtensions = getVendorExtensions();
    expect(vendorExtensions).toBeDefined();
    expect(typeof vendorExtensions).toBe('object');
  });

  it('should have proper extension structure', () => {
    const vendorExtensions = getVendorExtensions();
    
    // Check that extensions have the right structure
    expect(vendorExtensions['top-level']).toBeDefined();
    expect(vendorExtensions['info']).toBeDefined();
    expect(vendorExtensions['operation']).toBeDefined();
    expect(vendorExtensions['schema']).toBeDefined();
    
    // Check specific extensions
    expect(vendorExtensions['top-level']['x-speakeasy-sdk']).toBe(3); // before('info') = position 3
    expect(vendorExtensions['top-level']['x-speakeasy-auth']).toBe(14); // after('paths') = position 14
  });
});
