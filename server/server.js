require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDb= require('./config/db');
const morgan = require('morgan');
const mongoose = require('mongoose');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
//connectDb();

//Import Routes
const listingRoutes = require('./routes/listingRoutes');
const forumRoutes = require('./routes/forumRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const authRoutes = require('./routes/authRoutes');


//Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/verification', verificationRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Boma API is running');
});


// Error handling middleware placeholder
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI,{
    useUnifiedToplogy:true,
    useNewUrlParser:true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  }); 