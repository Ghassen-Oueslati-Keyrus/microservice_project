const axios = require('axios');

const productServiceUrl = 'http://localhost:8085/produits';

const getProductById = async (id) => {
    try {
        const response = await axios.get(`${productServiceUrl}/${id}`);
        const product = response.data;
        console.log('Product fetched:', product); // Log the product details
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch product with ID: ${id}`, error);
        throw error;
    }
};

const updateProductQuantity = async (id, quantity) => {
    try {
        const response = await axios.put(`${productServiceUrl}/${id}`, { quantity });
        return response.data;
    } catch (error) {
        console.error(`Failed to update quantity for product with ID: ${id}`, error);
        throw error;
    }
};

module.exports = {
    getProductById,
    updateProductQuantity
};
