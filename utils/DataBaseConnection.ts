import mongoose from "mongoose";

const connectToDatabase = async (): Promise<void> => {
    try{
        await mongoose.connect(process.env.MONGODB_URI!)
        mongoose.connection.on("connected", () => {
            console.log("Connected to the database successfully");
        });


    } catch (error) {
        console.error("Error connecting to the database:", error);
        throw error;
    }
}

export default connectToDatabase;