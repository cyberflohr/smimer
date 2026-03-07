# SMIMEr — Trust Engine

**SMIMEr** is a high-performance, browser-native S/MIME certificate generation gateway. It allows users to initialize a private Certificate Authority (CA) and issue secure email identities (Class 1-style) entirely within the client-side memory sandbox.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Vue](https://img.shields.io/badge/vue-3.5-brightgreen.svg)
![Vite](https://img.shields.io/badge/vite-7.0-blueviolet.svg)

---

## 🛡️ Core Features

- **Local-Only Cryptography**: All RSA key generation and X.509 signing happens in the browser's memory. No private keys ever touch a server.
- **Enterprise-Grade Security**:
  - **SHA-256 Signatures**: Modern hash algorithms (sha256WithRSAEncryption) for maximum compatibility and security.
  - **4096-bit Root CA**: Industrial-strength authority setup.
  - **2048-bit S/MIME Identity**: Standard RSA keys for email clients.
- **Interoperability**:
  - **PKCS#12 (.p12) Bundles**: Secure, password-protected archives containing the identity, private key, and CA chain.
  - **CA Backup/Restore**: Import or export your Root CA as a password-protected `.p12` file to resume operations across sessions.
  - **Chain ZIP Export**: Download a professional ZIP bundle containing `.cer` files (PEM format) for the Root CA and User certificate to update system-wide trust stores.
- **Advanced X.509 Attributes**: Support for `commonName` (Email), `givenName` (First Name), and `surname` (Last Name) OIDs according to X.500 standards.
- **Premium UX**: Modern, responsive interface featuring custom modals, real-time validation, and progress tracking.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation
```bash
# Clone the repository
git clone https://github.com/cyberflohr/smimer.git
cd smimer

# Install dependencies
npm install
```

### Development
```bash
# Start dev server with hot-reload
npm run dev
```

### Production Build
```bash
# Type-check and build for production
npm run build
```
The optimized assets will be available in the `dist/` directory.

---

## 🛠️ Technology Stack

- **Framework**: [Vue.js 3](https://vuejs.org/) (Composition API)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Cryptography**: [node-forge](https://github.com/digitalbazaar/forge)
- **Utilities**: [JSZip](https://stuk.github.io/jszip/), [Lucide Vue](https://lucide.dev/)
- **Type Safety**: [TypeScript](https://www.typescriptlang.org/)

---

## 🔐 Security & Privacy

**SMIMEr is built with a "Privacy by Design" philosophy:**

1. **Isolation**: No telemetry, no backend API, and no data persistence. Your data exists only as long as the browser tab is open.
2. **Entropy**: Uses `window.crypto.getRandomValues` via `node-forge` for high-quality random number generation.
3. **Transparency**: The entire cryptographic logic is open and inspectable in `src/services/certificate.service.ts`.
4. **Purge Mechanism**: A dedicated "Purge Memory" feature allows you to instantly scrub all sensitive material from the session.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

*Handcrafted for secure digital communication.*
