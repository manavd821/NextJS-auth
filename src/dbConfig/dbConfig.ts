import mongoose from 'mongoose';

export default async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log("Mongo db connected successfully");
        })
        connection.on('error', (error)=>{
            console.log("Mongodb connection error: ", error);
            process.exit();
        })
    } catch (error) {
        console.log("Something went wrong: ", error)
    }
}