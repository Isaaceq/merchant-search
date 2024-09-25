// server/index.js
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Use fileURLToPath to get __dirname equivalent in ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/data', async (req, res) => {
    console.log(`Received request at /api/data with query: ${JSON.stringify(req.query)}`);
    try {
        // Fetch data from the first API
        
        // Extract data from the request
        const pastData = req.query.pastData;
        const response1 = await axios.get(`https://api.zippopotam.us/us/${pastData}`);
        const coordinates = { latitude: response1.data.places[0].latitude, longitude: response1.data.places[0].longitude }
        
        // Fetch data from the second API using past data as a parameter
        const response2 = await axios.get(`https://api.clover.com/customer-engagement/2/cma/merchant/list/nearby?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Clover-Application': 'Clover',
                'X-Clover-Device': '8748B5F3-F915-4FBC-AD01-9854322FE17D',
                'Accept': '*/*',
                'Accept-Language': 'en-US,en;q=0.9',
                'User-Agent': 'Clover/1334 CFNetwork/1496.0.7 Darwin/23.5.0',
                'Connection': 'keep-alive'
            }
        });
        console.log('response2 fetched successfully:');
        
        // Combine both API responses and send them back to the client
        res.json({
            firstApiData: response1.data.places[0],
            secondApiData: response2.data
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

