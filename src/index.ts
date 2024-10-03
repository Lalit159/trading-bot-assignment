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

    // Placeholder for trading logic
    if (lastTradePrice && position) {
        console.log(`Current position: ${position}. Last trade price: ${lastTradePrice}`);
    } else {
        console.log('No active trades yet.');
    }
}, 5000);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
