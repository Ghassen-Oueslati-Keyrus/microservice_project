const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { getProductById, updateProductQuantity } = require('./productServiceClient');
const Order = require('./orderModel');
require('./db'); // Import DB connection
const { Eureka } = require('eureka-js-client');

const app = express();
const port = 9090;

app.use(bodyParser.json());
const client = new Eureka({
    instance: {
        app: 'order-service',
        hostName: 'order-service',
        ipAddr: '127.0.0.1',
        statusPageUrl: `http://localhost:${port}`,
        port: {
            '$': port,
            '@enabled': true,
        },
        vipAddress: 'order-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'eureka-server',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.start(error => {
    console.log(error || 'Eureka client started successfully');
});
app.post('/orders', async (req, res) => {
    const { productIds } = req.body;
    
    console.log(`Received request to create order with product IDs: ${productIds}`);

    try {
        // Fetch products from the product service
        const products = await Promise.all(productIds.map(id => getProductById(id)));

        if (products.length === 0) {
            console.warn('No products found');
            return res.status(400).json({ message: 'No products found' });
        }

        // Calculate total price
        const items = products.map(p => {
            const item = {
                productId: p.id, // Include productId
                productName: p.name,
                price: p.price
            };
            console.log('Item:', item); // Log item details
            return item;
        });

        const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

        // Create and save the order
        const order = new Order({
            productIds,
            items,
            totalPrice
        });

        await order.save();
        console.log('Order created and saved:', order);

        // Update product quantities
        for (const product of products) {
            if (product.quantity > 0) {
                await updateProductQuantity(product.id, product.quantity - 1);
                console.log(`Updated quantity for product ${product.name}: ${product.quantity - 1}`);
            } else {
                console.warn(`Product ${product.name} is out of stock`);
            }
        }

        res.status(201).json(order);
    } catch (error) {
        console.error('Failed to create order:', error);
        res.status(500).json({ message: 'Failed to create order' });
    }
});



app.get('/orders/:id', async (req, res) => {
    const orderId = req.params.id;
    console.log(`Received request to get order with ID: ${orderId}`);
    
    try {
        const order = await Order.findById(orderId);

        if (order) {
            console.log('Order found:', order);
            res.json(order);
        } else {
            console.warn('Order not found');
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error('Failed to retrieve order:', error);
        res.status(500).json({ message: 'Failed to retrieve order' });
    }
});

app.get('/orders', async (req, res) => {
    console.log('Received request to get all orders');

    try {
        const orders = await Order.find();
        console.log('Orders retrieved:', orders);
        res.json(orders);
    } catch (error) {
        console.error('Failed to retrieve orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
});

app.delete('/orders/:id', async (req, res) => {
    const orderId = req.params.id;

    try {
        console.log(`Deleting order with ID: ${orderId}`);
        
        // Fetch and delete the order
        const order = await Order.findByIdAndDelete(orderId);
        
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update product quantities back
        for (const item of order.items) {
            const { productId, price } = item;
            console.log(`Restoring quantity for product ID ${productId}`);
            
            // Fetch the product using productId
            const product = await getProductById(productId);
            
            if (product) {
                // Increment the product quantity
                await updateProductQuantity(productId, product.quantity + 1);
                console.log(`Updated quantity for product ${product.productName}: ${product.quantity + 1}`);
            } else {
                console.warn(`Product with ID ${productId} not found`);
            }
        }

        res.status(204).end();
    } catch (error) {
        console.error('Failed to delete order:', error);
        res.status(500).json({ message: 'Failed to delete order' });
    }
});


app.listen(port, () => {
    console.log(`Order service listening on port ${port}`);
});
