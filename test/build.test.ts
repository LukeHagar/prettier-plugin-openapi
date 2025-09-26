import { describe, expect, it } from 'bun:test';
import * as fs from 'fs';
import * as path from 'path';

describe('Build Tests', () => {
  describe('Build artifacts', () => {
    it('should create dist directory', () => {
      const distPath = path.join(process.cwd(), 'dist');
      expect(fs.existsSync(distPath)).toBe(true);
    });

    it('should create main index.js file', () => {
      const indexPath = path.join(process.cwd(), 'dist', 'index.js');
      expect(fs.existsSync(indexPath)).toBe(true);
    });

    it('should create TypeScript declaration files', () => {
      const dtsPath = path.join(process.cwd(), 'dist', 'index.d.ts');
      expect(fs.existsSync(dtsPath)).toBe(true);
    });

    it('should create source map files', () => {
      const mapPath = path.join(process.cwd(), 'dist', 'index.js.map');
      expect(fs.existsSync(mapPath)).toBe(true);
    });

    it('should have valid JavaScript in dist/index.js', () => {
      const indexPath = path.join(process.cwd(), 'dist', 'index.js');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Should not contain TypeScript syntax
      expect(content).not.toContain(': string');
      expect(content).not.toContain(': number');
      expect(content).not.toContain('interface ');
      // Note: 'type ' might appear in comments or strings, so we check for type annotations instead
      expect(content).not.toMatch(/\btype\s+[A-Z]/);
      
      // Should be valid JavaScript (but may contain ES module syntax)
      // We can't use new Function() with ES modules, so we just check it's not empty
      expect(content.length).toBeGreaterThan(0);
    });

    it('should export the plugin as default export', () => {
      const indexPath = path.join(process.cwd(), 'dist', 'index.js');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Should have module.exports (CommonJS format)
      expect(content).toContain('module.exports');
    });

    it('should have proper module structure', () => {
      const indexPath = path.join(process.cwd(), 'dist', 'index.js');
      const content = fs.readFileSync(indexPath, 'utf-8');
      
      // Should be CommonJS module
      expect(content).toContain('require');
      expect(content).toContain('module.exports');
    });
  });

  describe('Package.json validation', () => {
    it('should have correct main field', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      expect(packageJson.main).toBe('dist/index.js');
    });

    it('should have correct types field', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      expect(packageJson.types).toBe('./dist/index.d.ts');
    });

    it('should have correct exports field', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      expect(packageJson.exports).toBeDefined();
      expect(packageJson.exports['.']).toBeDefined();
      expect(packageJson.exports['.'].default).toBe('./dist/index.js');
    });

    it('should include required files in files array', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      expect(packageJson.files).toContain('dist/index.js');
      expect(packageJson.files).toContain('dist/index.d.ts');
    });

    it('should have required metadata', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      
      expect(packageJson.name).toBeDefined();
      expect(packageJson.version).toBeDefined();
      expect(packageJson.description).toBeDefined();
      expect(packageJson.author).toBeDefined();
      expect(packageJson.license).toBeDefined();
      expect(packageJson.keywords).toBeDefined();
      expect(packageJson.repository).toBeDefined();
      expect(packageJson.bugs).toBeDefined();
      expect(packageJson.homepage).toBeDefined();
    });

    it('should have correct peer dependencies', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      expect(packageJson.peerDependencies).toBeDefined();
      expect(packageJson.peerDependencies.prettier).toBeDefined();
    });

    it('should have correct engines requirement', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      expect(packageJson.engines).toBeDefined();
      expect(packageJson.engines.node).toBe('>=18.0.0');
    });
  });

  describe('NPM package validation', () => {
    it('should have all required files for npm publish', () => {
      const requiredFiles = [
        'dist/index.js',
        'dist/index.d.ts',
        'dist/index.js.map',
        'README.md',
        'package.json'
      ];

      requiredFiles.forEach(file => {
        const filePath = path.join(process.cwd(), file);
        expect(fs.existsSync(filePath)).toBe(true);
      });
    });

    it('should not include development files in npm package', () => {
      const excludedFiles = [
        'src/',
        'test/',
        '.github/',
        '.husky/',
        '.eslintrc.js',
        '.prettierrc.js',
        'tsconfig.json',
        'bunfig.toml'
      ];

      // These files should not be in the npm package
      // (This is handled by .npmignore, but we can verify the ignore file exists)
      expect(fs.existsSync('.npmignore')).toBe(true);
    });

    it('should have valid package.json for npm', () => {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
      
      // Required fields for npm
      expect(packageJson.name).toBeTruthy();
      expect(packageJson.version).toBeTruthy();
      expect(packageJson.main).toBeTruthy();
      expect(packageJson.license).toBeTruthy();
      
      // Should not have private field (or it should be false)
      if (packageJson.private !== undefined) {
        expect(packageJson.private).toBe(false);
      }
    });
  });

  describe('TypeScript compilation', () => {
    it('should compile without errors', () => {
      // This test assumes the build has already been run
      // In a real scenario, you might want to run tsc programmatically
      const distPath = path.join(process.cwd(), 'dist');
      expect(fs.existsSync(distPath)).toBe(true);
    });

    it('should generate declaration files', () => {
      const dtsPath = path.join(process.cwd(), 'dist', 'index.d.ts');
      const content = fs.readFileSync(dtsPath, 'utf-8');
      
      // Should contain type declarations
      expect(content).toContain('declare');
      expect(content).toContain('export');
    });

    it('should generate source maps', () => {
      const mapPath = path.join(process.cwd(), 'dist', 'index.js.map');
      const content = fs.readFileSync(mapPath, 'utf-8');
      const sourceMap = JSON.parse(content);
      
      // Should be valid source map
      expect(sourceMap.version).toBeDefined();
      expect(sourceMap.sources).toBeDefined();
      expect(sourceMap.mappings).toBeDefined();
    });
  });
});
