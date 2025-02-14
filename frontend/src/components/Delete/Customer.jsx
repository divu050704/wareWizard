import { useState, useEffect } from "react";
import backendInfo from "../../custom/backend-info.json";

export default function Customer() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendInfo.url}/api/customer-data`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const deleteCustomer = (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    fetch(`${backendInfo.url}/api/delete-customer/`, {
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
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">🛒 Customers</h1>

      {loading ? (
        <p className="text-gray-600 text-center">Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600 text-center">No customer data available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-left">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Products</th>
                <th className="py-2 px-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((ele) => {
                let total = 0;

                return (
                  <tr key={ele._id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b font-medium">{ele.name}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <div className="grid grid-cols-4 font-semibold text-gray-600 border-b pb-2">
                          <span>Product</span>
                          <span>Sold</span>
                          <span>Price</span>
                          <span>Total</span>
                        </div>
                        {ele.products.map((product, i) => {
                          total += product.sellingQuantity * product.sellingPrice;
                          return (
                            <div key={i} className="grid grid-cols-4 py-1 border-b">
                              <span>{product.productName}</span>
                              <span>{product.sellingQuantity}</span>
                              <span>₹{product.sellingPrice}</span>
                              <span className="font-medium">₹{product.sellingQuantity * product.sellingPrice}</span>
                            </div>
                          );
                        })}
                        <div className="flex justify-between font-semibold text-gray-700 mt-2">
                          <span>Total:</span>
                          <span>₹{total}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4 border-b text-center">
                      <button
                        onClick={() => deleteCustomer(ele._id, ele.name)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
