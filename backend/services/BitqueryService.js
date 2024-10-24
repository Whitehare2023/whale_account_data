const axios = require('axios');
const Transaction = require('../models/transactions'); // 导入 Transaction 模型

// 请将 'YOUR_BITQUERY_API_KEY' 替换为你的实际 Bitquery API 密钥
const API_KEY = 'BQYTU6i6tnI1Sj9ARpeoaVuzftELMIZp';

class BitqueryService {
  static async getWhaleTransactions(currencyName) {
    // 定义货币名称与合约地址的映射
    const currencyMap = {
      WBNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      USDT: '0x55d398326f99059fF775485246999027B3197955',
      USDC: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56'
      // 可以在这里添加更多的货币
    };

    const currencyAddress = currencyMap[currencyName];
    if (!currencyAddress) {
      throw new Error(`Invalid currency name: ${currencyName}`);
    }

    console.log(`Fetching whale transactions for ${currencyName} (${currencyAddress})`);

    // 构建查询，调整 amount 条件以获取更多数据
    const query = {
      query: `
        {
          ethereum(network: bsc) {
            transfers(
              options: {limit: 10, desc: "amount"},
              amount: {gt: 1000},
              currency: {is: "${currencyAddress}"}
            ) {
              transaction {
                hash
              }
              amount
              currency {
                symbol
                decimals
              }
              sender {
                address
              }
              receiver {
                address
              }
              block {
                height
              }
            }
          }
        }
      `
    };

    try {
      const response = await axios.post('https://graphql.bitquery.io/', query, {
        headers: {
          'X-API-KEY': API_KEY,
          'Content-Type': 'application/json'
        }
      });

      console.log('Bitquery response:', JSON.stringify(response.data, null, 2));

      const transfers = response.data.data.ethereum.transfers;

      if (!transfers || transfers.length === 0) {
        console.warn(`No transfers returned from Bitquery for ${currencyName}`);
        return []; // 返回空数组而不是抛出错误
      }

      // 存储交易数据到数据库（可根据需要启用或禁用）
      for (const tx of transfers) {
        // 检查所有必要的字段是否存在
        if (!tx.transaction?.hash || !tx.amount || !tx.sender?.address || !tx.receiver?.address || !tx.block?.height) {
          console.warn('Incomplete transaction data, skipping this entry.');
          continue;
        }

        // 检查数据库中是否已存在相同的 transactionHash
        const exists = await Transaction.findOne({ transactionHash: tx.transaction.hash });
        if (!exists) {
          const newTransaction = new Transaction({
            transactionHash: tx.transaction.hash,
            amount: tx.amount,
            sender: tx.sender.address,
            receiver: tx.receiver.address,
            blockHeight: tx.block.height
          });

          try {
            await newTransaction.save();
            console.log(`Stored new transaction with hash: ${tx.transaction.hash}`);
          } catch (dbError) {
            console.error('Error saving transaction to MongoDB:', dbError);
          }
        } else {
          console.log(`Transaction with hash ${tx.transaction.hash} already exists, skipping.`);
        }
      }

      return transfers;
    } catch (error) {
      console.error('Error fetching whale transactions:', error.response ? error.response.data : error.message);
      throw new Error('Failed to fetch whale transactions');
    }
  }
}

module.exports = BitqueryService;
