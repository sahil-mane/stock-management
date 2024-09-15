import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(request) {
    let {action,productName,itemquantity} = await request.json(); 
   
  // Replace the uri string with your connection string.
  const uri = "mongodb+srv://sahil:JkvbWxsRqbz9Bb3V@imagedata.v3okt.mongodb.net/?retryWrites=true&w=majority&appName=imageData";

  const client = new MongoClient(uri);

  try {
    const database = client.db('stock');
    const inventory = database.collection('inventory');
    
    const filter = {productName:productName};

    let newQuantity = action=="plus"?(parseInt(itemquantity)+1):(parseInt(itemquantity)-1)
    const updateDoc = {
        $set: {
            quantity:newQuantity
        }
    };    
    const result = await inventory.updateOne(filter, updateDoc,{});
    return NextResponse.json({success:true,Message:`${result.matchedCount} document(s) matched the filter update ${result.modifiedCount} document(s)`})
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}