import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

async function getLatLong({ city, state, zipCode }) {
    const apiKey = process.env.LOCATIONIQ_API_KEY;
    const baseUrl = 'https://us1.locationiq.com/v1/search.php';
    
    // Build the query string based on the inputs provided
    let query = '';
    if (city) query += city;
    if (state) query += (query ? ',' : '') + state;
    if (zipCode) query += (query ? ',' : '') + zipCode;

    const url = `${baseUrl}?key=${apiKey}&q=${encodeURIComponent(query)}&format=json`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.length > 0) {
            const latitude = data[0].lat;
            const longitude = data[0].lon;
            return { latitude, longitude };
        } else {
            return { error: 'No results found' };
        }
    } catch (error) {
        return { error: error.message };
    }
}

export { getLatLong };
