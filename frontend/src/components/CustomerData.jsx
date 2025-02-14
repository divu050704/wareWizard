import { useState } from "react";
import Due from "./customerData/Due";
import Advance from "./customerData/Advance";
export default function CustomerData() {
  const [type, setType] = useState("due");
  return (
    <div className="">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">
        Select what type of Customer's data you want to see
      </h1>
      <select
        value={type}
        onChange={(event) => setType(event.target.value)}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All</option>
        <option value="due">Due</option>
        <option value="advance">Advance</option>
      </select>
      <div className="mt-4">
        {type === "due" && <Due />}
        {type === "advance" && <Advance />}
      </div>
    </div>
  );
}
