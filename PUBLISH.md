# Publishing @roastnest/react

This document outlines the standard process for publishing the `@roastnest/react` widget package to the npm registry.

## Prerequisites

1. Ensure you have Node.js and Yarn installed.
2. You must have an npm account that is part of the `@roastnest` organization.

## Publishing Steps

### 1. Build the Production Bundle

Before publishing, always ensure you are building the latest production-ready code.

```bash
yarn build-pro
```
This command runs a clean-up script and uses Rollup to generate the optimized, production-ready bundles inside the `dist` folder.

### 2. Log In to npm

If you haven't authenticated with the npm CLI on your current machine, log in with your npm credentials:

```bash
npm login
```
Follow the prompts for your username, password, and email.

### 3. Increment the Package Version

Every published package must have a unique version number. Determine the type of changes you've made and bump the version accordingly using npm's version command:

```bash
# For backwards-compatible bug fixes
npm version patch

# For backwards-compatible new features
npm version minor

# For breaking changes
npm version major
```
*Note: This command will automatically update the `version` field in `package.json` and create a corresponding git commit and tag.*

### 4. Publish the Package

Publish the new version to the npm registry. Since this is a scoped package (`@roastnest/react`), use the following command to ensure it's publicly accessible:

```bash
npm publish --access public
```

---

### Quick Publish Flow

If you are already logged in and simply want to build and publish a patch version, you can run:

```bash
yarn build-pro
npm version patch
npm publish --access public
```
