import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { fetchStockPrices } from './services/stockService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Variables to track bot's balance and stock position
let balance = parseFloat(process.env.INITIAL_BALANCE || '10000');
let lastTradePrice: number | null = null;
let position: 'buy' | 'sell' | null = null;

// Basic route for health check
app.get('/', (req: Request, res: Response) => {
    res.send('Trading bot is running...');
});

// Monitor stock prices every 5 seconds
setInterval(async () => {
    const currentStockPrice = await fetchStockPrices();
    console.log(`Current Stock Price: ${currentStockPrice}`);

    // Trading logic
    if (lastTradePrice !== null) {
        // Sell condition: Sell if the stock price rises by 3% or more
        if (position === 'buy' && currentStockPrice >= lastTradePrice * 1.03) {
            balance += (currentStockPrice - lastTradePrice!); // Update balance with profit
            console.log(`Sold at ${currentStockPrice}. New balance: ${balance}`);
            position = 'sell'; // Update position
            lastTradePrice = null; // Reset lastTradePrice after selling
        }
        // Buy condition: Buy if the stock price drops by 2% or more
        else if (position === 'sell' && currentStockPrice <= lastTradePrice! * 0.98) {
            balance -= currentStockPrice; // Deduct from balance to simulate a buy
            console.log(`Bought at ${currentStockPrice}. New balance: ${balance}`);
            position = 'buy'; // Update position
            lastTradePrice = currentStockPrice; // Update lastTradePrice
        }
    } else {
        // Initialize first trade as a buy
        balance -= currentStockPrice; // Deduct initial price from balance
        console.log(`First trade: Bought at ${currentStockPrice}. New balance: ${balance}`);
        position = 'buy'; // Set initial position
        lastTradePrice = currentStockPrice; // Set lastTradePrice to current price
    }
}, 5000);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
