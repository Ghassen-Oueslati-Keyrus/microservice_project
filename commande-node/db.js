// db.js
const mongoose = require('mongoose');

const uri = 'mongodb://root:example@localhost:27017/ordersDB?authSource=admin';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
