---
name: Bug report
about: Report a bug with the Prettier OpenAPI plugin
title: '[BUG] '
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is with the Prettier OpenAPI plugin.

**To Reproduce**
Steps to reproduce the behavior:
1. Create an OpenAPI file with the following content:
```yaml
# or JSON
```
2. Run Prettier with the plugin: `npx prettier --plugin=prettier-plugin-openapi your-file.yaml`
3. See the formatting issue

**Expected behavior**
A clear and concise description of how the OpenAPI file should be formatted.

**OpenAPI file example**
Please provide a minimal OpenAPI file that demonstrates the issue:

```yaml
openapi: 3.0.0
info:
  title: Test API
  version: 1.0.0
# ... rest of your OpenAPI content
```

**Prettier configuration**
Please share your `.prettierrc` or Prettier configuration:

```json
{
  "plugins": ["prettier-plugin-openapi"],
  "tabWidth": 2,
  "printWidth": 80
}
```

**Environment (please complete the following information):**
- OS: [e.g. macOS, Windows, Linux]
- Node.js version: [e.g. 18.0.0]
- Prettier version: [e.g. 3.0.0]
- Plugin version: [e.g. 1.0.0]
- OpenAPI version: [e.g. 3.0.0, 2.0]

**Additional context**
Add any other context about the problem here. Include:
- Whether this affects JSON or YAML files (or both)
- If it's related to key ordering, formatting, or parsing
- Any error messages from the console

**Screenshots**
If applicable, add screenshots showing the before/after formatting to help explain the problem.
