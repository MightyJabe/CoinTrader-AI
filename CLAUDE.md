# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Node.js Express application that provides a cryptocurrency payment processing system for a CoinTrader AI landing page. The application serves a marketing/sales page with integrated crypto payment functionality.

## Core Architecture

- **Backend**: Express.js server with CORS enabled
- **Frontend**: Single HTML page with Tailwind CSS and vanilla JavaScript
- **Payment Processing**: Cryptocurrency payment system supporting BTC, ETH, and USDT
- **External APIs**: CoinGecko for live crypto rates, Infura for Ethereum, Blockstream for Bitcoin

## Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests
npm test
```

## Key Files and Structure

- `index.js` - Express server entry point, serves static files and payment routes
- `routes/payment.js` - Payment processing logic including crypto price fetching and verification
- `public/index.html` - Complete landing page with payment integration
- `.env.example` - Environment variables template

## Environment Setup

Copy `.env.example` to `.env` and configure:
- `ETHEREUM_RPC_URL` - Infura endpoint for Ethereum transactions
- `BITCOIN_API_URL` - Bitcoin blockchain API endpoint
- `WALLET_ADDRESS_ETH` - Ethereum wallet address for payments
- `WALLET_ADDRESS_BTC` - Bitcoin wallet address for payments
- `PORT` - Server port (default: 3000)

## Payment System

The payment system in `routes/payment.js` handles:
- Creating payment requests with QR codes
- Fetching live crypto rates from CoinGecko
- Verifying transactions on Bitcoin and Ethereum networks
- Serving product information and pricing

## Frontend Integration

The HTML page includes:
- Dynamic pricing display with live crypto rates
- QR code generation for payments
- Interactive chat support widget
- Mobile-responsive design with Tailwind CSS
- Real-time stat animations and user interaction
- Live profit calculator with ROI projections
- Exit-intent popup with special discount offer
- Purchase notification system showing recent buyers
- Trust badges and security seals
- Interactive ROI timeline
- Countdown timer for urgency
- Dynamic license counter that decreases over time

## Testing

No specific test files are currently implemented. The test command exists in package.json but uses Jest as the framework.

## Security Considerations

- API keys and wallet addresses are stored in environment variables
- Payment verification requires transaction hash confirmation
- No withdrawal permissions are granted to the system
- Dependencies are kept up-to-date to avoid security vulnerabilities
- Run `npm audit` regularly to check for security issues
- Use `npm audit fix --force` to apply security patches (note: may include breaking changes)