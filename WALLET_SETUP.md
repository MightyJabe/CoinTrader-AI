# Crypto Wallet Setup Guide

## Overview
This guide explains how to configure your real cryptocurrency wallet addresses for the CoinTrader AI payment system.

## Supported Cryptocurrencies

The system supports 8 major cryptocurrency options:

1. **Bitcoin (BTC)** - Native Bitcoin addresses
2. **Ethereum (ETH)** - Ethereum mainnet addresses
3. **Tether USDT (TRC20)** - TRON network addresses
4. **Tether USDT (ERC20)** - Ethereum network addresses
5. **Tether USDT (BEP20)** - BSC network addresses
6. **Binance Coin (BNB)** - BSC (Binance Smart Chain) addresses
7. **Litecoin (LTC)** - Native Litecoin addresses
8. **TRON (TRX)** - Native TRON addresses

## Configuration Steps

### 1. Create your `.env` file
```bash
cp .env.example .env
```

### 2. Add your wallet addresses to `.env`
```env
# Cryptocurrency Wallet Addresses
WALLET_ADDRESS_BTC=your_bitcoin_address_here
WALLET_ADDRESS_ETH=0x_your_ethereum_address_here
WALLET_ADDRESS_USDT_TRC20=your_usdt_trc20_address_here
WALLET_ADDRESS_USDT_ERC20=0x_your_usdt_erc20_address_here
WALLET_ADDRESS_USDT_BEP20=0x_your_usdt_bep20_address_here
WALLET_ADDRESS_BNB=0x_your_bnb_bsc_address_here
WALLET_ADDRESS_LTC=your_litecoin_address_here
WALLET_ADDRESS_TRX=your_tron_address_here
```

### 3. Address Format Requirements

#### Bitcoin (BTC)
- **Format**: Native SegWit (bech32) preferred
- **Example**: `bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh`
- **Network**: Bitcoin mainnet

#### Ethereum (ETH)
- **Format**: Standard Ethereum address
- **Example**: `0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5`
- **Network**: Ethereum mainnet

#### Tether (USDT) - TRC20
- **Format**: TRC20 TRON address
- **Example**: `TMWLhJd8E5c8QqUMXkqYFq7gWxGMEjvbZm`
- **Network**: TRON (TRC20)
- **Note**: Lower fees, faster transfers

#### Tether (USDT) - ERC20
- **Format**: Standard Ethereum address
- **Example**: `0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5`
- **Network**: Ethereum (ERC20)
- **Note**: Higher fees, more widely supported

#### Tether (USDT) - BEP20
- **Format**: BSC address (same format as Ethereum)
- **Example**: `0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5`
- **Network**: Binance Smart Chain (BEP20)
- **Note**: Medium fees, fast transfers

#### Binance Coin (BNB)
- **Format**: BSC address (same format as Ethereum)
- **Example**: `0x742d35Cc6634C0532925a3b8D45B3E88E03b59A5`
- **Network**: Binance Smart Chain (BSC)

#### Litecoin (LTC)
- **Format**: Native Litecoin address
- **Example**: `LYmpJZm1WrP5FSnxwkV2TTo5SkAF4Eha31`
- **Network**: Litecoin mainnet

#### TRON (TRX)
- **Format**: Native TRON address
- **Example**: `TMWLhJd8E5c8QqUMXkqYFq7gWxGMEjvbZm`
- **Network**: TRON mainnet

## Security Best Practices

### ✅ DO:
- Use cold storage or hardware wallets for large amounts
- Keep private keys secure and never share them
- Use separate wallets for business payments
- Monitor all wallet addresses regularly
- Keep backup copies of wallet recovery phrases

### ❌ DON'T:
- Never commit your `.env` file to version control
- Don't use exchange addresses directly
- Don't reuse personal wallet addresses
- Don't share wallet private keys with anyone

## Wallet Recommendations

### For Business Use:
1. **Hardware Wallets**: Ledger Nano S/X, Trezor
2. **Multi-sig Wallets**: Gnosis Safe, BitGo
3. **Business Wallets**: Coinbase Custody, BitPay

### For Development/Testing:
1. **MetaMask**: For ETH/BNB addresses
2. **Electrum**: For BTC/LTC addresses
3. **TronLink**: For TRX/USDT addresses

## Testing Your Setup

1. **Start the server**:
```bash
npm run dev
```

2. **Check the API endpoint**:
```bash
curl http://localhost:3000/api/payment/wallet-addresses
```

3. **Verify addresses appear correctly** in the payment interface

## Troubleshooting

### Common Issues:

1. **Addresses not updating**: Check server logs and API response
2. **Invalid format**: Verify address format matches network requirements
3. **Wrong network**: Ensure USDT is TRC20, not ERC20
4. **Missing addresses**: Check `.env` file exists and has correct variable names

### Environment Variables Check:
```bash
# Check if variables are loaded
node -e "require('dotenv').config(); console.log(process.env.WALLET_ADDRESS_BTC)"
```

## Production Deployment

### Before Going Live:
1. **Test all addresses** with small amounts
2. **Verify network compatibility** for each currency
3. **Set up monitoring** for incoming payments
4. **Configure backup systems** for wallet access
5. **Test the entire payment flow** end-to-end

### Environment Variables:
- Set all wallet addresses in your hosting provider's environment variables
- Never hardcode addresses in the source code
- Use secure secret management systems

## Support

If you need help with wallet setup:
- Check the console for error messages
- Verify address formats match the requirements
- Test with small amounts first
- Contact support if issues persist

---

**Security Note**: This system only needs wallet addresses (public keys) for receiving payments. Never provide or store private keys in the application.