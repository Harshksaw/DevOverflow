import mongoose from 'mongoose';
import moongose from 'mongoose';

let isConnected :boolean = false;


export const connectToDatabase = async () => {

    mongoose.set('strictQuery',true);
    if (isConnected) {
        console.log('using existing database connection');
        return;
    }
    try {
        const DB : any = process.env.MONGO_URL;
        await moongose.connect(DB, { dbName: 'devflow'});
        isConnected = true;
        console.log('database connection ->>-->>-->>');
    } catch (error) {
        console.log('error connecting to database');
    }
}