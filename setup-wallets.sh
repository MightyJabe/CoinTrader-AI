#!/bin/bash

# CoinTrader AI - Wallet Setup Script
# This script helps you quickly set up your cryptocurrency wallet addresses

echo "🚀 CoinTrader AI Wallet Setup"
echo "=============================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created"
else
    echo "⚠️  .env file already exists"
    read -p "Do you want to overwrite it? (y/N): " overwrite
    if [[ $overwrite =~ ^[Yy]$ ]]; then
        cp .env.example .env
        echo "✅ .env file overwritten"
    fi
fi

echo ""
echo "💰 Please enter your cryptocurrency wallet addresses:"
echo "⚠️  Make sure you're using the correct network for each currency!"
echo ""

# Function to validate address format
validate_btc() {
    if [[ $1 =~ ^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,42}$ ]]; then
        return 0
    else
        return 1
    fi
}

validate_eth() {
    if [[ $1 =~ ^0x[a-fA-F0-9]{40}$ ]]; then
        return 0
    else
        return 1
    fi
}

validate_tron() {
    if [[ $1 =~ ^T[a-zA-Z0-9]{33}$ ]]; then
        return 0
    else
        return 1
    fi
}

validate_ltc() {
    if [[ $1 =~ ^[LM3][a-zA-HJ-NP-Z0-9]{26,33}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Bitcoin address
while true; do
    read -p "🟠 Bitcoin (BTC) address: " btc_address
    if validate_btc "$btc_address"; then
        sed -i "s/WALLET_ADDRESS_BTC=.*/WALLET_ADDRESS_BTC=$btc_address/" .env
        echo "✅ Bitcoin address saved"
        break
    else
        echo "❌ Invalid Bitcoin address format. Please try again."
    fi
done

# Ethereum address
while true; do
    read -p "🔵 Ethereum (ETH) address: " eth_address
    if validate_eth "$eth_address"; then
        sed -i "s/WALLET_ADDRESS_ETH=.*/WALLET_ADDRESS_ETH=$eth_address/" .env
        echo "✅ Ethereum address saved"
        break
    else
        echo "❌ Invalid Ethereum address format. Please try again."
    fi
done

# USDT TRC20 address
while true; do
    read -p "🟢 USDT (TRC20) address: " usdt_trc20_address
    if validate_tron "$usdt_trc20_address"; then
        sed -i "s/WALLET_ADDRESS_USDT_TRC20=.*/WALLET_ADDRESS_USDT_TRC20=$usdt_trc20_address/" .env
        echo "✅ USDT TRC20 address saved"
        break
    else
        echo "❌ Invalid TRON address format. Please try again."
    fi
done

# USDT ERC20 address
while true; do
    read -p "🟢 USDT (ERC20) address: " usdt_erc20_address
    if validate_eth "$usdt_erc20_address"; then
        sed -i "s/WALLET_ADDRESS_USDT_ERC20=.*/WALLET_ADDRESS_USDT_ERC20=$usdt_erc20_address/" .env
        echo "✅ USDT ERC20 address saved"
        break
    else
        echo "❌ Invalid Ethereum address format. Please try again."
    fi
done

# USDT BEP20 address
while true; do
    read -p "🟢 USDT (BEP20) address: " usdt_bep20_address
    if validate_eth "$usdt_bep20_address"; then
        sed -i "s/WALLET_ADDRESS_USDT_BEP20=.*/WALLET_ADDRESS_USDT_BEP20=$usdt_bep20_address/" .env
        echo "✅ USDT BEP20 address saved"
        break
    else
        echo "❌ Invalid BSC address format. Please try again."
    fi
done

# BNB BSC address
while true; do
    read -p "🟡 BNB (BSC) address: " bnb_address
    if validate_eth "$bnb_address"; then
        sed -i "s/WALLET_ADDRESS_BNB=.*/WALLET_ADDRESS_BNB=$bnb_address/" .env
        echo "✅ BNB BSC address saved"
        break
    else
        echo "❌ Invalid BSC address format. Please try again."
    fi
done

# Litecoin address
while true; do
    read -p "🔘 Litecoin (LTC) address: " ltc_address
    if validate_ltc "$ltc_address"; then
        sed -i "s/WALLET_ADDRESS_LTC=.*/WALLET_ADDRESS_LTC=$ltc_address/" .env
        echo "✅ Litecoin address saved"
        break
    else
        echo "❌ Invalid Litecoin address format. Please try again."
    fi
done

# TRON address
while true; do
    read -p "🔴 TRON (TRX) address: " trx_address
    if validate_tron "$trx_address"; then
        sed -i "s/WALLET_ADDRESS_TRX=.*/WALLET_ADDRESS_TRX=$trx_address/" .env
        echo "✅ TRON address saved"
        break
    else
        echo "❌ Invalid TRON address format. Please try again."
    fi
done

echo ""
echo "🎉 All wallet addresses configured!"
echo ""
echo "📋 Summary:"
echo "----------"
echo "BTC: $btc_address"
echo "ETH: $eth_address"
echo "USDT (TRC20): $usdt_trc20_address"
echo "USDT (ERC20): $usdt_erc20_address"
echo "USDT (BEP20): $usdt_bep20_address"
echo "BNB: $bnb_address"
echo "LTC: $ltc_address"
echo "TRX: $trx_address"
echo ""
echo "🔐 Security reminders:"
echo "- Never share your private keys"
echo "- Test with small amounts first"
echo "- Monitor all addresses regularly"
echo "- Keep backup copies of recovery phrases"
echo ""
echo "🚀 Ready to start the server:"
echo "npm run dev"
echo ""
echo "💡 Test your setup:"
echo "curl http://localhost:3000/api/payment/wallet-addresses"