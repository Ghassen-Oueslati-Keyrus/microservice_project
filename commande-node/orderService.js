// orderService.js
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getProductsByNames, updateProductQuantity } = require('./productServiceClient');
const Order = require('./orderModel');
require('./db'); // Import DB connection

const app = express();
const port = 9090;

app.use(bodyParser.json());

app.post('/orders', async (req, res) => {
    const { productNames } = req.body;
    
    try {
        // Fetch products from the product service
        const products = await getProductsByNames(productNames);
        
        if (products.length === 0) {
            return res.status(400).json({ message: 'No products found' });
        }
        
        // Calculate total price
        const items = products.map(p => ({
            productName: p.name,
            price: p.price
        }));
        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
        
        // Create and save the order
        const order = new Order({
            productNames,
            items,
            totalPrice
        });

        await order.save();

        // Update product quantities
        for (const product of products) {
            if (product.quantity > 0) {
                await updateProductQuantity(product.id, product.quantity - 1);
            } else {
                console.warn(`Product ${product.name} is out of stock`);
            }
        }

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create order' });
    }
});

app.get('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findById(orderId);

        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve order' });
    }
});

app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
});

app.delete('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    try {
        const order = await Order.findByIdAndDelete(orderId);
        
        if (order) {
            // Update product quantities back
            for (const item of order.items) {
                const product = await getProductsByNames([item.productName]);
                if (product.length > 0) {
                    await updateProductQuantity(product[0].id, product[0].quantity + 1);
                }
            }

            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

app.listen(port, () => {
    console.log(`Order service listening on port ${port}`);
});
