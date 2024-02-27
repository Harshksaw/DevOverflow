'use server'

import { connectToDatabase } from "../moongoose"


export async function createQuestion(params: any) {

    try {
        connectToDatabase();  //connection
        
    } catch (error) {
        
    }
    
}