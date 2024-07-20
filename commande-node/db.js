const mongoose = require('mongoose');

const mongoUri = process.env.MONGO_URI || 'mongodb://root:example@localhost:27017/ordersDB?authSource=admin';

mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));
