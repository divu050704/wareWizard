import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import backendInfo from "../../custom/backend-info.json";

export default function Stock() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(`${backendInfo.url}/api/products-data`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, []);

  const handleStockChange = (id, value) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.productName === id ? { ...item, newQuantity: value } : item
      )
    );
  };

  const selectedData = selected.map((ele) => (
    <div
      key={ele.productName}
      className="p-4 bg-white rounded-xl shadow-lg border border-gray-200 mb-4 transition-all hover:shadow-xl"
    >
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="text-gray-700 font-medium">📦 Name:</div>
        <div className="text-gray-900 font-semibold">{ele.productName}</div>
  
        <div className="text-gray-700 font-medium">📊 Current Quantity:</div>
        <div className="text-gray-900">{ele.quantity}</div>
  
        <div className="text-gray-700 font-medium">🔄 New Stock:</div>
        <input
          type="number"
          value={ele.newQuantity}
          onChange={(event) => handleStockChange(ele.productName, event.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>
    </div>
  ));

  const submit = () => {
    fetch(`${backendInfo.url}/api/update-stock/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ data: selected }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Updated) {
          alert("Updated");
          window.location.reload();
        }
      });
  };

  return (
    <div className="stock p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">📦 Manage Stock</h1>
      <div className="mb-4">
        <Multiselect
          options={data}
          onSelect={(value, final) => setSelected([...selected, { ...final, newQuantity: 0 }])}
          onRemove={(value) => setSelected(value)}
          displayValue="productName"
          groupBy="category"
          
        />
      </div>
      {selected.length > 0 && <hr className="mb-4" />}
      {selectedData}
      {selected.length > 0 && (
        <button
          className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={submit}
        >
          Submit
        </button>
      )}
    </div>
  );
}