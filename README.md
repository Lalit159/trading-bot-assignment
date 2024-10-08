
# Trading Bot Documentation

## Overview
This trading bot simulates basic trading operations in a hypothetical stock market. It continuously monitors stock prices, makes buy and sell decisions based on predefined strategies, and tracks profit/loss and performance metrics. The bot is built using Node.js and TypeScript.

## Features
- **Real-time Stock Monitoring**: Continuously fetches and monitors stock prices.
- **Basic Trading Strategies**: Implements simple strategies like percentage-based buy and sell conditions.
- **Profit/Loss Tracking**: Keeps track of the bot’s balance, trade history, and overall profit/loss.
- **API Endpoints**: Provides endpoints to check the health of the bot and retrieve trading summaries.
- **Logging**: Records all trading activities and errors for better traceability.

## Getting Started

### Prerequisites
- Node.js (version 14.x or later)
- TypeScript
- Git
- A mock API for stock prices (or you can use the provided mock implementation)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/trading-bot.git
   cd trading-bot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with the following variables:
   ```plaintext
   PORT=3000
   INITIAL_BALANCE=10000
   BUY_THRESHOLD=0.98    # Buy when the price drops by 2%
   SELL_THRESHOLD=1.03    # Sell when the price rises by 3%
   PRICE_CHECK_INTERVAL=5000  # Check prices every 5 seconds
   ```

### Running the Application
To start the server, use the following command:
```bash
npm start
```
The bot will begin monitoring stock prices based on the configured interval.

## API Endpoints

### Health Check
- **Endpoint**: `GET /`
- **Description**: Returns a message indicating that the trading bot is running.
- **Response**:
  ```json
  {
    "message": "Trading bot is running..."
  }
  ```

### Trade Summary
- **Endpoint**: `GET /trade-summary`
- **Description**: Provides a summary report showing the bot’s balance, trade history, and performance metrics.
- **Response**:
  ```json
  {
    "balance": 9800,
    "tradeHistory": [
      { "type": "buy", "price": 100, "balance": 9900 },
      { "type": "sell", "price": 102, "balance": 10100 }
    ],
    "totalTrades": 2,
    "winningTrades": 1, // incremented only on a successful sale
    "winRate": 50,
    "totalProfitLoss": 200
  }
  ```

## Trading Logic
### Buy and Sell Conditions
- The bot will **buy** a stock when the price drops by 2% from the last purchase price.
- The bot will **sell** a stock when the price rises by 3% from the last selling price.

### Profit/Loss Calculation
- The bot keeps track of the balance by adding the profit from sells and deducting the cost from buys.
- A trade history is maintained to record each transaction, including the type of trade, price, and balance after the trade.

## Logging
- The bot uses Winston for logging. Logs are saved to `combined.log` and `error.log` files.
- Log messages include information about trades executed, errors encountered, and the current stock price.

## Testing the Application
You can test the application using Postman or any other API client.

1. **Health Check**:
   - Send a `GET` request to `http://localhost:3000/`
   - You should receive a confirmation message indicating that the bot is running.

2. **Trade Summary**:
   - Send a `GET` request to `http://localhost:3000/trade-summary`
   - You will receive a JSON response with the current trading status, including balance and trade history.

## Future Improvements
- **Advanced Trading Strategies**: Implement more sophisticated strategies like moving average crossovers or momentum trading.
- **Integration with Real Stock Price APIs**: Connect the bot to live stock market data for real trading.
- **User Authentication**: Add user authentication and account management for personalized trading.

## Conclusion
This trading bot serves as a foundational project to understand trading logic, API interactions, and real-time data handling. It can be further enhanced with more complex strategies and integration with real-world APIs to operate in actual financial markets.
