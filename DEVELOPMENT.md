# Development Guide

This document outlines the development workflow, testing, and release process for the prettier-plugin-openapi package.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/lukehagar/prettier-plugin-openapi.git
   cd prettier-plugin-openapi
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Verify setup**
   ```bash
   bun run validate
   ```

## Development Workflow

### Available Scripts

- `bun run dev` - Start development mode with TypeScript watch
- `bun run build` - Build the project
- `bun run test` - Run all tests
- `bun run test:coverage` - Run tests with coverage report
- `bun run test:watch` - Run tests in watch mode
- `bun run lint` - Run ESLint
- `bun run lint:fix` - Fix ESLint issues automatically
- `bun run format` - Format code with Prettier
- `bun run format:check` - Check code formatting
- `bun run type-check` - Run TypeScript type checking
- `bun run validate` - Run all validation checks (type-check, lint, test)
- `bun run clean` - Clean build artifacts

### Code Quality

The project uses several tools to maintain code quality:

- **ESLint** - Code linting with TypeScript support
- **Prettier** - Code formatting
- **TypeScript** - Type checking

### Commit Message Format

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Types:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat: add support for OpenAPI 3.1
fix: correct key ordering for components
docs: update README with usage examples
```

## Testing

### Running Tests

```bash
# Run all tests
bun run test

# Run tests with coverage
bun run test:coverage

# Run tests in watch mode
bun run test:watch

# Run tests for CI
bun run test:ci
```

### Test Structure

- `test/plugin.test.ts` - Core plugin functionality tests
- `test/file-detection.test.ts` - File detection and parsing tests
- `test/integration.test.ts` - Integration tests with real OpenAPI files
- `test/key-ordering.test.ts` - Key ordering and sorting tests
- `test/options.test.ts` - Plugin options and configuration tests
- `test/vendor.test.ts` - Vendor extension tests
- `test/custom-extensions.test.ts` - Custom extension tests

### Adding Tests

When adding new features or fixing bugs:

1. Write tests first (TDD approach)
2. Ensure tests cover edge cases
3. Add integration tests for complex features
4. Update existing tests if behavior changes

## Building

### Development Build

```bash
bun run dev
```

This starts TypeScript in watch mode, automatically rebuilding when files change.

### Production Build

```bash
bun run build
```

This creates a production build in the `dist/` directory.

### Build Verification

After building, verify the output:

```bash
# Check build artifacts
ls -la dist/

# Test the built package
node -e "console.log(require('./dist/index.js'))"
```

## Release Process

### Version Management

The project uses semantic versioning (semver):

- **Patch** (1.0.1): Bug fixes (automated via GitHub Actions)
- **Minor** (1.1.0): New features (manual)
- **Major** (2.0.0): Breaking changes (manual)

### Automated Releases

Releases are automatically triggered on every push to main:

1. **Smart versioning**
   - Checks if the current version already exists on NPM
   - If version exists: bumps patch version and publishes
   - If version doesn't exist: publishes current version
   - Runs tests and linting before publishing

2. **Automatic process**
   - Every push to the `main` branch triggers the release workflow
   - The workflow will automatically:
     - Run tests and linting
     - Check NPM for existing version
     - Bump patch version if needed
     - Build and publish to NPM
     - Create GitHub release with commit message

### Manual Minor/Major Releases

For minor or major releases:

1. **Update version manually**
   ```bash
   # For minor release
   bun run version:minor
   
   # For major release
   bun run version:major
   ```

2. **Push to main**
   ```bash
   git push origin main
   ```

3. **Automated release**
   - The release workflow will automatically:
     - Detect the new version
     - Build and test the package
     - Publish to NPM
     - Create GitHub release

## CI/CD Pipeline

### GitHub Actions Workflows

- **CI Pipeline** (`.github/workflows/ci.yml`)
  - Runs on every push and PR
  - Tests on multiple Node.js and Bun versions
  - Runs linting, type checking, and tests
  - Generates coverage reports
  - Builds the package
  - Runs security audits

- **Release Pipeline** (`.github/workflows/release.yml`)
  - Runs on every push to main
  - Smart versioning: checks NPM for existing versions
  - Automatically bumps patch version if needed
  - Builds, tests, and publishes to NPM
  - Creates GitHub release with commit message

### Required Secrets

Set up the following secrets in your GitHub repository:

- `NPM_TOKEN`: NPM authentication token for publishing
- `SNYK_TOKEN`: Snyk token for security scanning (optional)

## Troubleshooting

### Common Issues

1. **Build failures**
   - Check TypeScript errors: `bun run type-check`
   - Verify all dependencies are installed: `bun install`

2. **Test failures**
   - Run tests individually to isolate issues
   - Check test setup and mocks

3. **Linting errors**
   - Run `bun run lint:fix` to auto-fix issues
   - Check ESLint configuration

4. **Release issues**
   - Check if version already exists on NPM
   - Verify NPM_TOKEN secret is set correctly
   - Check workflow logs for specific error messages

### Debug Mode

Enable debug logging:

```bash
DEBUG=prettier-plugin-openapi:* bun run test
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Add tests for new functionality
5. Run the full validation: `bun run validate`
6. Commit with conventional commit format
7. Push and create a pull request

### Pull Request Process

1. Ensure all CI checks pass
2. Request review from maintainers
3. Address feedback and update PR
4. Merge after approval

## Performance Considerations

- The plugin processes files in memory
- Large OpenAPI files (>1MB) may take longer to format
- Consider file size limits for optimal performance
- Monitor memory usage with very large files

## Security

- Regular dependency updates
- Security audits via GitHub Actions
- No external network requests during formatting
- Input validation for all parsed content

## Release Workflow Benefits

The new consolidated release workflow provides:

- **Smart Versioning**: Automatically detects if versions exist on NPM
- **No Manual Intervention**: Patch releases happen automatically on every push
- **Efficient Publishing**: Only bumps versions when necessary
- **Comprehensive Testing**: Full test suite runs before every release
- **Automatic Documentation**: GitHub releases created with commit messages
- **Seamless Integration**: Works with both automatic and manual version bumps
