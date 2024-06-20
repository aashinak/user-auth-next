import mongoose from 'mongoose'

export async function connect() {
    try {
        await mongoose.connect(process.env.MONGO_URI!)
        const connection = mongoose.connection
        connection.on("connceted", () => {
            console.log("mongo db connected");
        })
        connection.on("error", (error) => {
            console.log("MongoDB connection error, make sure DB is up and running" + error);
            process.exit()
        })
    } catch (error) {
        console.log("Something went wrong while connecting to db");
        console.log(error);
    }
}