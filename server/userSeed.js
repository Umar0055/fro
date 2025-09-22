import User from "./models/User.js";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";

const userRegister = async () => {
    try {
        await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/community-ai-forum');

        const hashPassword = await bcrypt.hash("admin", 10);
        const newUser = new User({
            username: "admin",
            email: "admin@gmail.com",
            passwordHash: hashPassword,
            role: "admin",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin&backgroundColor=b6e3f4,c0aede,d1d4f9",
            bio: "Community Administrator"
        });

        await newUser.save();
        console.log("Admin user created successfully");
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    }
};

userRegister();
