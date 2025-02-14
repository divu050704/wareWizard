import { useEffect, useState } from "react";
import backendInfo from "../../custom/backend-info.json";

export default function Complete() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${backendInfo.url}/api/products-data/`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, []);

  return (
    <div className="complete-data p-6 bg-white rounded-2xl shadow-lg w-full max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        📦 Complete Data
      </h1>
      <div className="overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-gray-700">
              <th className="py-3 px-5 border-b text-left font-medium">
                Product Name
              </th>
              <th className="py-3 px-5 border-b text-center font-medium">
                Available
              </th>
              <th className="py-3 px-5 border-b text-right font-medium">
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((ele, index) => (
              <tr key={index} className="hover:bg-gray-100 transition">
                <td className="py-3 px-5 border-b">{ele.productName}</td>
                <td className="py-3 px-5 border-b text-center">
                  {ele.quantity}
                </td>
                <td className="py-3 px-5 border-b text-right">
                  ₹{ele.sellingPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
