import React, { useEffect, useState } from 'react';

const currencyOptions = ['WBNB', 'USDT', 'BUSD'];

function CronJobWithData() {
  const [interval, setIntervalValue] = useState(5000); // 默认时间间隔为 5000 毫秒
  const [currency, setCurrency] = useState(currencyOptions[0]); // 默认选择 WBNB
  const [isRunning, setIsRunning] = useState(false); // 控制是否启动定时器
  const [transactions, setTransactions] = useState([]); // 存储鲸鱼交易数据

  useEffect(() => {
    let timer;

    if (isRunning) {
      console.log('Starting to fetch data with currency:', currency);
      timer = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/api/transactions/whale-transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currencyName: currency })
          });

          if (response.ok) {
            const data = await response.json();
            setTransactions(data);
          } else {
            console.error('Failed to fetch data:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }, interval);
    } else {
      setTransactions([]); // 停止时清空交易数据
    }

    return () => {
      if (timer) {
        clearInterval(timer);
        console.log('Cron job stopped');
      }
    };
  }, [isRunning, interval, currency]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsRunning(!isRunning);
  };

  return (
    <div className="cron-job-settings" style={{ padding: '20px' }}>
      <h2>Set Interval and Currency to Monitor Whale Transactions</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <label>
          Time interval (milliseconds):
          <input
            type="number"
            value={interval}
            onChange={(e) => setIntervalValue(Number(e.target.value))}
            placeholder="5000"
            style={{ marginLeft: '10px', marginRight: '10px' }}
          />
        </label>

        <label>
          Select Currency:
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ marginLeft: '10px', marginRight: '10px' }}
          >
            {currencyOptions.map((currencyOption, index) => (
              <option key={index} value={currencyOption}>
                {currencyOption}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" style={{ padding: '5px 10px' }}>
          {isRunning ? 'Stop Fetching Data' : 'Start Fetching Data'}
        </button>
      </form>

      <div className="transactions-display" style={{ background: '#333', color: '#fff', padding: '10px', borderRadius: '10px' }}>
        <h3>Transaction Data</h3>
        {transactions && transactions.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {transactions.map((tx, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                <strong>Transaction Hash:</strong> {tx.transaction?.hash || 'N/A'} <br />
                <strong>Amount:</strong> {tx.amount || 'N/A'} <br />
                <strong>Sender:</strong> {tx.sender?.address || 'N/A'} <br />
                <strong>Receiver:</strong> {tx.receiver?.address || 'N/A'} <br />
                <strong>Block Height:</strong> {tx.block?.height || 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No transaction data available for {currency}</p>
        )}
      </div>
    </div>
  );
}

export default CronJobWithData;
