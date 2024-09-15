import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  // Replace the uri string with your connection string.
  const uri = "mongodb+srv://sahil:JkvbWxsRqbz9Bb3V@imagedata.v3okt.mongodb.net/?retryWrites=true&w=majority&appName=imageData";

  const client = new MongoClient(uri);

  try {
    const database = client.db('sample');
    const movies = database.collection('inventory');

    // Query for all movies
    const movieCursor = await movies.find({});
    const movieList = await movieCursor.toArray();
    console.log(movieList)
    return NextResponse.json({ "a": 34, movieList });
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
