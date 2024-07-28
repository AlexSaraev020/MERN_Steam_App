import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const MongoDBLink = process.env.MONGODB_LINK

export async function connectToDatabase() {
  try {
    if (!MongoDBLink) {
      throw new Error('MONGODB_LINK environment variable is not defined');
    }

    await mongoose.connect(MongoDBLink);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Could not connect to MongoDB', error);
  }
}