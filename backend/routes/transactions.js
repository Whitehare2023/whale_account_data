const express = require('express');
const router = express.Router();
const BitqueryService = require('../services/BitqueryService');

// 定义 POST 路由处理鲸鱼交易请求
router.post('/whale-transactions', async (req, res) => {
  const { currencyName } = req.body;

  // 检查是否提供了货币名称
  if (!currencyName) {
    return res.status(400).json({ error: 'Currency name is required' });
  }

  try {
    console.log('Received request with currencyName:', currencyName);

    // 调用 BitqueryService 获取交易数据
    const transactions = await BitqueryService.getWhaleTransactions(currencyName);
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching whale transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
