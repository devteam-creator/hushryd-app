# GitHub CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. `ci.yml` - Main CI Pipeline
- **Triggers**: Push/PR to main/develop branches
- **Jobs**:
  - Frontend tests (TypeScript type checking)
  - Backend tests (API server health check with MySQL)
  - Android APK build
- **Runs on**: Ubuntu latest

### 2. `android-build.yml` - Android Build
- **Triggers**: Changes to frontend, push/PR, manual dispatch
- **Purpose**: Build Android release APK
- **Output**: APK artifact uploaded for 30 days

### 3. `backend-test.yml` - Backend Tests
- **Triggers**: Changes to backend, push/PR, manual dispatch
- **Purpose**: Test backend API with MySQL service
- **Services**: MySQL 8.0

### 4. `frontend-test.yml` - Frontend Tests
- **Triggers**: Changes to frontend, push/PR, manual dispatch
- **Purpose**: Type checking and linting

### 5. `release.yml` - Release Build
- **Triggers**: GitHub release creation, manual dispatch
- **Purpose**: Build and attach release APK to GitHub releases
- **Optional**: APK signing if keystore is configured

## Setup Requirements

### Secrets (Optional)
- `ANDROID_KEYSTORE_BASE64`: Base64 encoded keystore for APK signing (for release builds)

### Environment
- Node.js 20.x
- Java 17 (Temurin)
- Android SDK with API level 36, build-tools 36.0.0, NDK 27.0.12077973

## Usage

Workflows run automatically on push/PR. To trigger manually:
1. Go to Actions tab in GitHub
2. Select the workflow
3. Click "Run workflow"

