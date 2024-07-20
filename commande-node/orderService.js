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
        host: 'discovery-server',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.start(error => {
    console.log(error || 'Eureka client started successfully');
});

app.post('/orders', async (req, res) => {
    const { productOrders } = req.body; // productOrders is an array of objects with productId and quantity

    try {
        // Fetch products from the product service
        const products = await Promise.all(productOrders.map(order => getProductById(order.productId)));

        if (products.length === 0) {
            return res.status(400).json({ message: 'No products found' });
        }

        // Calculate total price and prepare order items
        const items = products.map((product, index) => {
            const orderQuantity = productOrders[index].quantity;
            const item = {
                productId: product.id,
                productName: product.name,
                quantity: orderQuantity,
                price: product.price,
                totalPrice: product.price * orderQuantity // Calculate total price for this item
            };
            return item;
        });

        const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);

        // Create and save the order
        const order = new Order({
            productOrders,
            items,
            totalPrice
        });

        await order.save();

        // Update product quantities
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            const orderQuantity = productOrders[i].quantity;
            if (product.quantity >= orderQuantity) {
                await updateProductQuantity(product.id, product.quantity - orderQuantity);
            } else {
                return res.status(400).json({ message: `Insufficient quantity for product ${product.name}` });
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

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Restore product quantities
        for (const item of order.items) {
            const { productId, quantity } = item;
            const product = await getProductById(productId);
            
            if (product) {
                await updateProductQuantity(productId, product.quantity + quantity);
            }
        }

        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete order' });
    }
});

app.listen(port, () => {
    console.log(`Order service listening on port ${port}`);
});
