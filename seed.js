import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedAdmin = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log('No users found. Seeding default admin...');
            
            const username = process.env.ADMIN_USER || 'admin';
            const password = process.env.ADMIN_PASS || 'password';
            
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const admin = new User({
                username,
                password: hashedPassword,
                email: 'admin@example.com',
                bio: 'Default Admin Account',
                role: 'admin'
            });

            await admin.save();
            console.log(`Admin seeded! Login with: ${username} / ${password} (or check .env)`);
        } else {
            console.log('Users already exist. Skipping seed.');
        }
    } catch (err) {
        console.error('Seeding failed:', err);
    }
};

export default seedAdmin;
