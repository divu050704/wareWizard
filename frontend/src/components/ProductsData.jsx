import { useState } from "react";
import Daily from "./productData/Daily";
import Complete from "./productData/Complete";

export default function ProductsData() {
  const [type, setType] = useState("daily");
  return (
    <div>
      <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        📊 Select Product Data
      </h1>
      <div className="flex flex-col items-center gap-4">
        <select
          value={type}
          onChange={(event) => setType(event.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily Data</option>
          <option value="complete">Complete Data</option>
        </select>
        <div className="w-full">{type === "daily" && <Daily />}</div>
        <div className="w-full">{type === "complete" && <Complete />}</div>
      </div>
    </div>
  );
}
