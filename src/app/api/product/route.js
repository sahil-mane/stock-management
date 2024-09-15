import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function GET(){
  const uri = "mongodb+srv://sahil:JkvbWxsRqbz9Bb3V@imagedata.v3okt.mongodb.net/?retryWrites=true&w=majority&appName=imageData";
  const client = new MongoClient(uri);
  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    const allProduct = await inventory.find().toArray();
    // console.log(allProduct);
    return NextResponse.json({allProduct});
  } finally {
    await client.close();
  }
}

export async function POST(request) {
    let body = await request.json(); 
  // Replace the uri string with your connection string.
  const uri = "mongodb+srv://sahil:JkvbWxsRqbz9Bb3V@imagedata.v3okt.mongodb.net/?retryWrites=true&w=majority&appName=imageData";

  const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    // Query for all movies
    const Product = await inventory.insertOne(body);    
    // console.log(Product);
    return NextResponse.json({Product});
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
