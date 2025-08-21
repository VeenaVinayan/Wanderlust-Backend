import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const URI: string = process.env.MONGODB_URI!;
    const conn = await mongoose.connect(URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Error in MongoDB: ${err.message}`);
    } else {
      console.error('Unexpected error:', err);
    }
    process.exit(1); 
  }
};

export default connectDB;




