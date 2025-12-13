import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('Error: MONGO_URI is not defined in .env');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB...');

mongoose.connect(mongoURI)
.then(() => {
    console.log('Successfully connected to MongoDB!');
    mongoose.connection.close();
    process.exit(0);
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
});
