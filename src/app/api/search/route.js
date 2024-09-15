// pages/api/search.js

import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(request) {
    const query = request.nextUrl.searchParams.get("query");
    const uri = "mongodb+srv://sahil:JkvbWxsRqbz9Bb3V@imagedata.v3okt.mongodb.net/?retryWrites=true&w=majority&appName=imageData"; // Replace with your MongoDB URI
    const client = new MongoClient(uri);

    // Handle the case where query is not provided
    if (!query) {
        return NextResponse.json({ error: "Query parameter is required" }, { status: 400 });
    }

    try {
        await client.connect(); // Ensure the client is connected
        const database = client.db('stock'); // Replace 'stock' with your database name
        const inventory = database.collection('inventory'); // Replace 'inventory' with your collection name

        const products = await inventory.aggregate([
            {
                $match: {
                    productName: { $regex: query, $options: "i" } // Case-insensitive search
                }
            }
        ]).toArray();

        // Return the search results
        return NextResponse.json({products});
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    } finally {
        await client.close(); // Close the database connection
    }
}
