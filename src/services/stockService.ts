import axios from 'axios';

const API_URL = process.env.API_URL || 'https://mockapi.example.com/stocks';

// Function to fetch mock stock prices from the API
export const fetchStockPrices = async (): Promise<number> => {
    try {
        const response = await axios.get(API_URL);
        const price = response.data.price;
        return price;
    } catch (error) {
        // console.error('Error fetching stock prices:', error);
        // Fallback to a random price in case of error
        return generateRandomPrice();
    }
};

// Simulate random stock prices if the API fails
export const generateRandomPrice = (): number => {
    return Math.random() * (150 - 50) + 50; // Random price between 50 and 150
};
