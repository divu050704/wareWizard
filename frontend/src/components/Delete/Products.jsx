import { useEffect, useState } from "react";
import backendInfo from "../../custom/backend-info.json";

export default function Products() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendInfo.url}/api/products-data/`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteProduct = (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    fetch(`${backendInfo.url}/api/delete-product/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ id, item: name }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Deleted) {
          alert(`Deleted "${res.item}"`);
          setData((prev) => prev.filter((ele) => ele._id !== id)); // Optimized state update
        } else {
          alert("An error occurred");
        }
      });
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">📦 Product List</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600 text-center">No products available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-2 px-4 border-b">Product Name</th>
                <th className="py-2 px-4 border-b">Available</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((ele) => (
                <tr key={ele._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{ele.productName}</td>
                  <td className="py-2 px-4 border-b">{ele.quantity}</td>
                  <td className="py-2 px-4 border-b">₹{ele.sellingPrice}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => deleteProduct(ele._id, ele.productName)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
