import mongoose from 'mongoose';

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("data base connect suceessfuly")
    } catch (error) {
        console.log("error connect mongodb")
        process.exit(1)
    }
}
