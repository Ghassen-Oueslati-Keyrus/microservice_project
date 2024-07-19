// productServiceClient.js
const axios = require('axios');

const BASE_URL = 'http://localhost:8085'; // Adjust URL as needed

const getProductsByNames = async (names) => {
    try {
        const response = await axios.get(`${BASE_URL}/produits`);
        const allProducts = response.data;

        return allProducts.filter(p => names.includes(p.name));
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};

const updateProductQuantity = async (id, quantity) => {
    try {
        const response = await axios.put(`${BASE_URL}/produits/${id}`, { quantity });
        return response.data;
    } catch (error) {
        console.error('Error updating product quantity:', error.message);
        throw error;
    }
};

module.exports = { getProductsByNames, updateProductQuantity };
