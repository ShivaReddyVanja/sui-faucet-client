

# Sui Testnet Faucet - Frontend

A modern, secure Next.js application for distributing Sui testnet tokens with built-in rate limiting and admin dashboard.

## 🚀 Quick Setup

### Prerequisites

- Node.js 18+ and npm
- Sui wallet (Suiet, Sui Wallet, etc.)
- Backend API running (see backend repository)


### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd sui-faucet-frontend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` and update the following variables:

```env
# Replace with your backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# For production deployment
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

4. **Run development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`
5. **Build for production**

```bash
npm run build
npm start
```


## 🔧 Environment Configuration

### Required Environment Variables

Refer to `.env.example` for all required environment variables:

- `NEXT_PUBLIC_API_URL`: Your backend API endpoint
- `NEXT_PUBLIC_APP_URL`: Your application's public URL (for production)


### Development vs Production

- **Development**: Use `http://localhost:8000` for API URL
- **Production**: Replace with your deployed backend URL (e.g., `https://api.yourfaucet.com`)


## 👨💼 Admin Dashboard Access

### Accessing the Dashboard

Navigate to: `{your-site-url}/admin`

Example:

- Local: `http://localhost:3000/admin`
- Production: `https://yourfaucet.com/admin`


### Admin Authentication Setup

1. **Configure admin wallets in backend**

In your backend repository, add admin wallet addresses to `.env`:

```env
ADMIN_WALLETS=0x1234...abcd,0x5678...efgh,0x9012...ijkl
```

Refer to the backend's `.env.example` for the exact variable name and format.
2. **Connect your wallet**
    - Click "Connect Wallet" on the admin page
    - Select your preferred Sui wallet
    - Ensure your wallet address is added to the backend's admin list
3. **Sign authentication message**
    - After connecting, you'll be prompted to sign a message
    - Approve the signature request in your wallet
    - You should be automatically redirected to the dashboard

### Troubleshooting Admin Access

#### Cookie Issues

If you're not redirected to the dashboard after signing:

1. **Clear site cookies**
    - Click the **lock icon** (🔒) in your browser's address bar (top-left area)
    - Select "Cookies" or "Site settings"
    - Click "Delete" or "Clear data" for this site
2. **Alternative method**
    - Open Developer Tools (F12)
    - Go to Application/Storage tab
    - Clear all cookies for the site
3. **Retry authentication**
    - Refresh the `/admin` page
    - Connect your wallet again
    - Sign the message
    - You should now be redirected successfully

#### Common Issues

- **Wallet not in admin list**: Verify your wallet address is added to backend environment variables
- **Backend not running**: Ensure your backend API is accessible
- **Network mismatch**: Make sure you're connected to the correct Sui network (testnet)


### Dashboard Features

Once authenticated, you can:

- 📊 **Monitor faucet usage** - View request statistics and transaction history
- ⚙️ **Configure settings** - Adjust faucet amount, rate limits, and cooldown periods
- 🔧 **Manage system** - Enable/disable faucet, update admin settings
- 📈 **Analytics** - Track usage patterns and identify potential abuse


## 🛠️ Development

### Project Structure

```
├── components/          # Reusable UI components
├── pages/              # Next.js pages and API routes
├── services/           # API service functions
├── lib/               # Utility functions and types
├── styles/            # CSS and styling files
└── public/            # Static assets
```


### Key Components

- **Wallet Integration**: Suiet wallet kit for Sui wallet connectivity
- **Rate Limiting**: Client-side feedback for rate limit status
- **Admin Dashboard**: Secure admin panel with wallet-based authentication


### Technology Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Wallet**: Suiet Wallet Kit
- **Icons**: Lucide React, React Icons


## 🔒 Security Features

- **Rate Limiting**: IP and wallet-based request limits
- **Wallet Authentication**: Cryptographic signature verification for admin access
- **Input Validation**: Client and server-side validation for all inputs


## 🎯 Faucet Usage

### For Users

1. **Connect your wallet** using the "Connect Wallet" button
2. **Enter your wallet address** (auto-filled if wallet is connected)
3. **Click "Request SUI"** to submit your faucet request
4. **Wait for confirmation** - tokens will be sent to your wallet

### Rate Limits

- Maximum requests per wallet: Configurable via admin dashboard
- Maximum requests per IP: Configurable via admin dashboard
- Cooldown period: Configurable via admin dashboard


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

**Need help?**

- Check the backend repository for API documentation
- Review the troubleshooting section for common issues
- Open an issue on GitHub for technical problems

**Note**: This faucet provides testnet tokens only. These tokens have no monetary value and are intended for development and testing purposes only.
