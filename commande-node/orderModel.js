// orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productOrders: [{ productId: String, quantity: Number }],
    items: [{
        productId: String,
        productName: String,
        quantity: Number,
        price: Number,
        totalPrice: Number
    }],
    totalPrice: Number
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
