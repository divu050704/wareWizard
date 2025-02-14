import { useState } from "react";
import Products from "./Delete/Products";
import Customer from "./Delete/Customer";
export default function Delete() {
  const [type, setType] = useState("Product");
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        📊 Select Data Type
      </h1>
      <div className="flex flex-col items-center gap-4">
        
        <select value={type} onChange={(event) => setType(event.target.value)} className="w-full p-2 border border-gray-300 rounded-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="Product">Product</option>
          <option value="Customer">Customer</option>
        </select>
        {type === "Product" && <Products />}
        {type === "Customer" && <Customer />}
      </div>
    </div>
  );
}
