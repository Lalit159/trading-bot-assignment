import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { fetchStockPrices } from './services/stockService';
import winston from 'winston';
import config from '../config.json'; // Import the configuration file

// Load environment variables
dotenv.config();

// Set up logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Variables to track bot's balance, stock position, and trade history
let balance = config.initial_balance; // Use initial balance from config
let lastTradePrice: number | null = null;
let position: 'buy' | 'sell' | null = null;
let tradeHistory: Array<{ type: string; price: number; balance: number }> = [];

// Basic route for health check
app.get('/', (req: Request, res: Response) => {
    res.send('Trading bot is running...');
});

// Endpoint to get the trade summary
app.get('/trade-summary', (req: Request, res: Response) => {
    res.json({
        balance,
        tradeHistory,
    });
});

// Monitor stock prices based on configured interval
setInterval(async () => {
    try {
        const currentStockPrice = await fetchStockPrices();
        logger.info(`Current Stock Price: ${currentStockPrice}`);

        // Trading logic
        if (lastTradePrice !== null) {
            // Sell condition: Sell if the stock price rises by configured percentage
            if (position === 'buy' && currentStockPrice >= lastTradePrice * config.sell_threshold) {
                const profit = currentStockPrice - lastTradePrice!;
                balance += profit; // Update balance with profit
                logger.info(`Sold at ${currentStockPrice}. New balance: ${balance}`);
                tradeHistory.push({ type: 'sell', price: currentStockPrice, balance }); // Record trade
                position = 'sell'; // Update position
                lastTradePrice = null; // Reset lastTradePrice after selling
            }
            // Buy condition: Buy if the stock price drops by configured percentage
            else if (position === 'sell' && currentStockPrice <= lastTradePrice! * config.buy_threshold) {
                balance -= currentStockPrice; // Deduct from balance to simulate a buy
                logger.info(`Bought at ${currentStockPrice}. New balance: ${balance}`);
                tradeHistory.push({ type: 'buy', price: currentStockPrice, balance }); // Record trade
                position = 'buy'; // Update position
                lastTradePrice = currentStockPrice; // Update lastTradePrice
            }
        } else {
            // Initialize first trade as a buy
            balance -= currentStockPrice; // Deduct initial price from balance
            logger.info(`First trade: Bought at ${currentStockPrice}. New balance: ${balance}`);
            tradeHistory.push({ type: 'buy', price: currentStockPrice, balance }); // Record trade
            position = 'buy'; // Set initial position
            lastTradePrice = currentStockPrice; // Set lastTradePrice to current price
        }
    } catch (error) {
        logger.error(`Error fetching stock price: ${error}`);
    }
}, config.price_check_interval); // Use configured interval for price checks

// Start the server
app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
});
