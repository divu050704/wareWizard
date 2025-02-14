import { useEffect, useState, useCallback } from "react";
import Multiselect from "multiselect-react-dropdown";
import backendInfo from "../custom/backend-info.json";

export default function PurchaseProduct() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("")

  useEffect(() => {
    fetch(`${backendInfo.url}/api/products-data`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setData(res.data));

    fetch(`${backendInfo.url}/api/get-distributors`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setSellers(res.data));
  }, []);

  const handleQuantityChange = useCallback((productName, newQuantity) => {
    setSelected((prev) =>
      prev.map((ele) =>
        ele.productName === productName ? { ...ele, newQuantity } : ele
      )
    );
  }, []);

  const handleSelect = useCallback((selectedList, selectedItem) => {
    setSelected((prev) => [
      ...prev,
      { ...selectedItem, newQuantity: 0 },
    ]);
  }, []);

  const handleRemove = useCallback((selectedList, removedItem) => {
    setSelected((prev) => prev.filter((ele) => ele.productName !== removedItem.productName));
  }, []);

  const submit = () => {
    if (!selectedSeller) {
      alert("Please select a distributor!");
      return;
    }
    if (selected.length === 0) {
      alert("Please select at least one product!");
      return;
    }

    fetch(`${backendInfo.url}/api/update-stock/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ data: selected, seller: selectedSeller }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Updated) {
          alert("Stock Updated!");
          setSelected([]);
          setSelectedSeller("");
        }
      });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">📦 Purchase Product</h2>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Distributor</label>
        <select
          value={selectedSeller}
          onChange={(event) => setSelectedSeller(event.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="">-- Choose Distributor --</option>
          {sellers.map((ele) => (
            <option key={ele.name} value={ele.name}>
              {ele.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-1">Select Products</label>
        <Multiselect
          options={data}
          onSelect={handleSelect}
          onRemove={handleRemove}
          displayValue="productName"
          groupBy="category"
        />
      </div>

      {selected.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Selected Products</h3>
          {selected.map((ele) => (
            <div key={ele.productName} className="p-3 border rounded-lg mb-2">
              <p><strong>Name:</strong> {ele.productName}</p>
              <p><strong>Available Quantity:</strong> {ele.quantity}</p>
              <div className="flex items-center">
                <label className="mr-2">New Stock:</label>
                <input
                  type="number"
                  min="1"
                  value={ele.newQuantity}
                  onChange={(e) => handleQuantityChange(ele.productName, e.target.value)}
                  className="w-20 p-1 border rounded-lg text-center"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={submit}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-4 transition"
      >
        Submit ✅
      </button>
    </div>
  );
}
