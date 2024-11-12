"use client";
import Headers from "./components/Headers";
import { useState, useEffect } from "react";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [alert, setAlert] = useState(false);
  const [query, setQuery] = useState("");
  const [dropdown, setDropdown] = useState([]);
  const [loading,setLoading] = useState(false);
  // this is mee

  const handleChange = (e) => {
    setProductForm({
      ...productForm,
      [e.target.name]: e.target.value,
    });
  };

  const AddProduct = async (e) => {
    try {
      e.preventDefault();
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });
      const data = await response.json();
      getAllProduct();
      if (response.ok) {
        setAlert(true);
        setProductForm({});
        setTimeout(() => {
          setAlert(false);
        }, 3000);        
      }
    } catch (error) {
      console.error(error);
    }
    getAllProduct();
  };

  const getAllProduct = async () => {
    try {
      const response = await fetch("/api/product", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error("Error: Unable to fetch data");
      }
      const data = await response.json();
      setAllProducts(data.allProduct);
    } catch (error) {
      console.error(error);
    }
  };

  const dropdownEdit = async (e) => {
    let value = e.target.value
    setQuery(value);
    if(value.length > 2)
    {
      setDropdown([]);
      const response = await fetch('/api/search?query=' + query);
      let rjson = await response.json();
      setDropdown(rjson.products || []);
      console.log(rjson.products);      
    }
    else{
      setDropdown([]);
    }
  }

  // const buttonAction = async (action, productName, itemquantity) => {
  //   try {
  //     setLoading(true);
  //     const response = await fetch("/api/action", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ action, productName, itemquantity }),
  //     });
  
  //     const res = await response.json();
  //     console.log('API response:', res); // Log response to check
  
  //     if (response.ok) {
  //       const updatedQuantity = action === "plus" 
  //         ? parseInt(itemquantity) + 1 
  //         : parseInt(itemquantity) - 1;
  
  //       // Update the product quantity in both `allProducts` and `dropdown`
  //       setAllProducts((prevProducts) =>
  //         prevProducts.map((product) =>
  //           product.productName === productName
  //             ? { ...product, quantity: updatedQuantity }
  //             : product
  //         )
  //       );
  
  //       setDropdown((prevDropdown) =>
  //         prevDropdown.map((product) =>
  //           product.productName === productName
  //             ? { ...product, quantity: updatedQuantity }
  //             : product
  //         )
  //       );
  //     }
  
  //     setLoading(false);
  //   } catch (error) {
  //     console.error("Error in updating quantity:", error);
  //     setLoading(false);
  //   }
  // };
  const buttonAction = async (action, productName, itemquantity) => {
    try {
      // Find the product index in `allProducts`
      let index = allProducts.findIndex((item) => item.productName === productName);
      let newProducts = JSON.parse(JSON.stringify(allProducts)); // Deep clone
  
      // Update the quantity in the `allProducts` state
      if (action === "plus") {
        newProducts[index].quantity = parseInt(itemquantity) + 1;
      } else {
        newProducts[index].quantity = parseInt(itemquantity) - 1;
      }
      setAllProducts(newProducts); // Update state with modified data  
      
      // Now make the API call to persist changes
      setLoading(true);
      const response = await fetch("/api/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, productName, itemquantity }), // Pass action, product name, and current quantity
      });
  
      const res = await response.json();
      setLoading(false);
  
      // Optionally, handle any response-specific updates if needed (like error handling or syncing state based on server data)
  
    } catch (error) {
      console.error("Error in updating quantity:", error);
      setLoading(false); // Stop loading on error
    }
  };
  

  useEffect(() => {
    getAllProduct();    
  }, []);

  return (
    <>
      <Headers />
      <div className="bg-gray-200 p-2 relative">
        <h1 className="text-3xl font-bold mb-2">Search a product</h1>
        <div className="relative">
          <input 
            onChange={dropdownEdit} 
            className="p-2 rounded-lg" 
            type="text" 
            placeholder="Search for a product..."
          />
          { dropdown.length > 0 && (
            <div className="absolute bg-white shadow-lg rounded-lg w-full mt-2 z-10">
              {dropdown.map((item) => (
                <div 
                  className="flex justify-between p-2 hover:bg-gray-200" 
                  key={item._id}
                >
                  <span>{item.productName} ({item.quantity} available for ₹{item.price})</span>
                  {/* <span>{item.quantity}</span> */}
                  <div className="space-x-3">
                  <button onClick={()=>{buttonAction("minus", item.productName,item.quantity)}} disabled={loading} className="bg-pink-500 px-2 rounded-lg text-white disabled:bg-pink-100">-</button>
                  <span>{item.quantity}</span>
                  <button onClick={()=>{buttonAction("plus", item.productName,item.quantity)}} disabled={loading} className="bg-pink-500 px-2 rounded-lg text-white disabled:bg-pink-100">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <select className="p-2 rounded-lg mx-2 mt-2">
          <option value="all">All</option>
          <option value="category1">Category1</option>
          <option value="category2">Category2</option>
        </select>
      </div>

      <div className="text-center">
        {alert && (
          <span className="bg-green-400 p-4 rounded-lg border-2 border-green-800">
            Product added successfully
          </span>
        )}
      </div>

      <div className="bg-gray-300 p-2 my-3">
        <h1 className="text-3xl font-bold mb-2">Add a product</h1>
        <form className="form" onSubmit={AddProduct}>
          <div>
            <label>Product Name</label>
            <input 
              value={productForm?.productName || ""} 
              name="productName" 
              onChange={handleChange} 
              type="text" 
            />
          </div>
          <div>
            <label>Quantity</label>
            <input 
              value={productForm?.quantity || ""} 
              name="quantity" 
              onChange={handleChange} 
              type="number" 
            />
          </div>
          <div>
            <label>Price</label>
            <input 
              value={productForm?.price || ""} 
              name="price" 
              onChange={handleChange} 
              type="number" 
            />
          </div>
          <button type="submit">Add Product</button>
        </form>
      </div>

      <div className="my-2">
        <h1 className="text-3xl font-bold mb-2">Display Current Stock</h1>
        <table className="w-full border-spacing-4 border-separate">
          <thead>
            <tr>
              <th className="border border-spacing-4">Product Name</th>
              <th className="border border-spacing-2">Quantity</th>
              <th className="border border-spacing-2">Price</th>
              <th className="border border-spacing-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {allProducts &&
              allProducts.map((data) => (
                <tr key={data._id}>
                  <td className="border border-spacing-2">{data.productName}</td>
                  <td className="border border-spacing-2">{data.quantity}</td>
                  <td className="border border-spacing-2">₹{data.price}</td>
                  <td className="border border-spacing-2 space-x-3">
                    <button className="bg-green-500 p-2 rounded-xl hover:text-white">Edit</button>
                    <button className="bg-red-500 p-2 rounded-xl hover:text-white">Delete</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  )
}  

