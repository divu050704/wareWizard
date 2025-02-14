import { useState } from "react";
import Stock from "./updateProductData/Stock";
import Info from "./updateProductData/Info";
export default function ProductUpdate() {
  const [type, setType] = useState("stock");
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        📊 Select Data Type
      </h1>
      <div className="flex flex-col items-center gap-4">
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="stock">Stock</option>
          <option value="info">Information</option>
        </select>
        <div className="w-full">{type === "stock" && <Stock />}</div>
        <div className="w-full">{type === "info" && <Info />}</div>
      </div>
    </div>
  );
}
