import app from './app';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fems-inspections';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB (Inspections)');
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`Inspection Service is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
