// orderModel.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    productNames: [String],
    items: [
        {
            productName: String,
            price: Number
        }
    ],
    totalPrice: Number
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
