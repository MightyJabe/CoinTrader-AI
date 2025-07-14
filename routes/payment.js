const express = require('express');
const { Web3 } = require('web3');
const axios = require('axios');
const QRCode = require('qrcode');
const router = express.Router();

const web3 = new Web3(process.env.ETHEREUM_RPC_URL);

const CRYPTO_PRICES_API = 'https://api.coingecko.com/api/v3/simple/price';

// Product configuration
const PRODUCT = {
  name: 'CoinTrader AI Complete',
  price: 297,
  type: 'one-time',
  features: [
    'Unlimited Exchange Connections',
    'All AI Trading Strategies + Custom Builder', 
    'Unlimited Portfolio Size',
    'AI-Powered Risk Management',
    'Cross-Exchange Arbitrage',
    'Developer API Access',
    '24/7 Priority Support',
    'Lifetime Updates'
  ]
};

router.post('/create-payment', async (req, res) => {
  try {
    const { amount = PRODUCT.price, currency = 'btc', metadata = {} } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    if (!['btc', 'eth'].includes(currency.toLowerCase())) {
      return res.status(400).json({ error: 'Supported currencies: BTC, ETH' });
    }

    const crypto = currency.toLowerCase();
    const walletAddress = crypto === 'btc' ? 
      process.env.WALLET_ADDRESS_BTC : 
      process.env.WALLET_ADDRESS_ETH;

    if (!walletAddress) {
      return res.status(500).json({ error: 'Wallet address not configured' });
    }

    const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const qrCodeData = `${crypto}:${walletAddress}?amount=${amount}`;
    const qrCode = await QRCode.toDataURL(qrCodeData);

    res.json({
      paymentId,
      currency: crypto.toUpperCase(),
      amount,
      walletAddress,
      qrCode,
      product: PRODUCT.name,
      metadata: {
        service: 'cointrader-ai',
        type: 'one-time',
        product: PRODUCT.name,
        ...metadata
      }
    });
  } catch (error) {
    console.error('Payment creation failed:', error);
    res.status(500).json({ error: 'Payment processing failed' });
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    const { paymentId, txHash, currency } = req.body;

    if (!paymentId || !txHash || !currency) {
      return res.status(400).json({ error: 'Payment ID, transaction hash, and currency are required' });
    }

    const crypto = currency.toLowerCase();
    let verified = false;
    let transaction = null;

    if (crypto === 'btc') {
      const response = await axios.get(`${process.env.BITCOIN_API_URL}/tx/${txHash}`);
      transaction = response.data;
      verified = transaction.status.confirmed;
    } else if (crypto === 'eth') {
      transaction = await web3.eth.getTransaction(txHash);
      const receipt = await web3.eth.getTransactionReceipt(txHash);
      verified = receipt && receipt.status === 1n;
    }

    res.json({
      paymentId,
      verified,
      product: PRODUCT.name,
      transaction: transaction ? {
        hash: txHash,
        confirmed: verified,
        timestamp: new Date().toISOString()
      } : null,
      access: verified ? {
        status: 'active',
        type: 'lifetime',
        activatedAt: new Date().toISOString()
      } : null
    });
  } catch (error) {
    console.error('Payment verification failed:', error);
    res.status(500).json({ error: 'Payment verification failed' });
  }
});

router.get('/rates', async (req, res) => {
  try {
    const response = await axios.get(`${CRYPTO_PRICES_API}?ids=bitcoin,ethereum&vs_currencies=usd`);
    
    res.json({
      BTC: response.data.bitcoin.usd,
      ETH: response.data.ethereum.usd
    });
  } catch (error) {
    console.error('Failed to fetch crypto rates:', error);
    res.status(500).json({ error: 'Failed to fetch crypto rates' });
  }
});

// Get product info
router.get('/product', (req, res) => {
  res.json(PRODUCT);
});

module.exports = router;