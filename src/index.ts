import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { fetchStockPrices } from './services/stockService';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/', (req: Request, res: Response) => {
  res.send('Server is running fine!');
});

// Monitor stock prices every 5 seconds
setInterval(async () => {
    const price = await fetchStockPrices();
    console.log(`Current Stock Price: ${price}`);
}, 5000);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
