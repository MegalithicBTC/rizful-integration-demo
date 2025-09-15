# Rizful Integration Demo

A React + TypeScript demonstration of integrating with Rizful's OAuth-like flow to obtain Nostr Wallet Connect (NWC) URIs and Lightning addresses.

## Overview

This demo application showcases how to integrate with Rizful's authentication system to securely obtain credentials. It demonstrates a three-step process that external applications can implement to enable their users to connect their Rizful vault.

## Features

- **Secure Authentication Flow**: OAuth-like process without exposing private keys
- **NWC URI Generation**: Get Nostr Wallet Connect URI
- **Lightning Address Retrieval**: Obtain Lightning address for receiving payments
- **Responsive Design**: Works on desktop and mobile devices

## Workflow

The application implements a three-step authentication flow:

### 1. Account Creation (Optional)

- New users can create a Rizful account by clicking "Sign up for Rizful"
- Opens Rizful's signup page in a popup window
- Existing users can skip this step

### 2. Authorization Code Generation

- Users click "Get Code" to open Rizful's token generation page
- They authorize the integration and receive a one-time code
- This code is time-limited and single-use for security

### 3. Token Exchange

- Users paste their one-time code into the demo app
- Users provide their Nostr public key (hex format, 64 characters)
- The app exchanges these credentials with Rizful's server
- On success, receives:
  - **NWC URI**: For making Bitcoin transactions
  - **Lightning Address**: For receiving payments
  - **Confirmed Public Key**: Verification of the provided key

### Technical Flow

```
User → Rizful (Get Code) → Demo App (Exchange) → Rizful API → Credentials
```

1. **GET** `https://rizful.com/nostr_onboarding_auth_token/get_token` - Get authorization code
2. **POST** `https://rizful.com/nostr_onboarding_auth_token/post_for_secrets` - Exchange for credentials

## Configuration

### Custom Rizful URL

You can configure the application to use a custom Rizful instance by setting the `VITE_RIZFUL_ORIGIN` environment variable.

#### Using .env File

Create a `.env` file in the project root:

```env
VITE_RIZFUL_ORIGIN=https://your-custom-rizful-instance.com
```

## Getting Started

### Prerequisites

- Node.js 22.12 or higher
- npm or yarn package manager

### Local Development

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd rizful-integration-demo
   npm install
   ```

2. **Configure Rizful URL (optional):**

   ```bash
   # Create .env.local file with your custom Rizful instance
   echo "VITE_RIZFUL_ORIGIN=https://your-rizful-instance.com" > .env.local
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:3008`

## Project Structure

```
src/
├── App.tsx              # Main application component
├── App.css              # Application styles
├── main.tsx             # React entry point
├── index.css            # Global styles
└── utils/
    └── utils.ts         # Utility functions
        ├── openPopup()     # Popup window management
        ├── isValidHex()    # Hex validation
        └── getRizfulOrigin() # Environment config
```

## API Integration

### Token Exchange Endpoint

**POST** `rizful.com/nostr_onboarding_auth_token/post_for_secrets`

**Request:**

```json
{
  "secret_code": "one-time-code-from-rizful",
  "nostr_public_key": "64-character-hex-public-key"
}
```

**Response:**

```json
{
  "nwc_uri": "nostr+walletconnect://...",
  "lightning_address": "user@rizful.com",
  "nostr_public_key": "64-character-hex-public-key"
}
```

## Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Support**: iOS Safari, Chrome Mobile, Firefox Mobile
- **Features Used**: ES2020+, Fetch API, CSS Grid, Flexbox

## Development Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint for code quality
```

## Environment Variables

| Variable             | Description              | Default              | Example                      |
| -------------------- | ------------------------ | -------------------- | ---------------------------- |
| `VITE_RIZFUL_ORIGIN` | Custom Rizful server URL | `https://rizful.com` | `https://staging.rizful.com` |

## License

This project is provided as a demonstration and reference implementation.
