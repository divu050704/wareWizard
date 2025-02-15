import { useEffect, useState, useCallback } from "react";
import Multiselect from "multiselect-react-dropdown";
import backendInfo from "../custom/backend-info.json";

export default function PurchaseProduct() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
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
  const handleGSTChange = useCallback((productName, gst) => {
    setSelected((prev) =>
      prev.map((ele) =>
        ele.productName === productName ? { ...ele, gst } : ele
      )
    );
  }, []);

  const handleSelect = useCallback((selectedList, selectedItem) => {
    setSelected((prev) => [...prev, { ...selectedItem, newQuantity: 0 }]);
  }, []);

  const handleRemove = useCallback((selectedList, removedItem) => {
    setSelected((prev) =>
      prev.filter((ele) => ele.productName !== removedItem.productName)
    );
  }, []);

  const submit = async () => {
    if (!selectedSeller) {
      alert("Please select a distributor!");
      return;
    }
    if (selected.length === 0) {
      alert("Please select at least one product!");
      return;
    }
    if (!invoiceNumber){
      alert("Enter Invoice Number")
      return
    }

    await fetch(`${backendInfo.url}/api/update-stock/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ data: selected }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then(async (res) => {
        if (res.Updated) {
          await fetch(`${backendInfo.url}/api/add-purchase/`, {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({
              data: selected,
              seller: selectedSeller,
              invoiceNumber: invoiceNumber,
            }),
            credentials: "include",
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.Updated) {
                alert("Purchased Added")
                setSelected([]);
                setSelectedSeller("");
                setInvoiceNumber("")
              }
            });
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
      <div>
        <label className="block font-medium mb-1">Invoice No.</label>
        <input
          placeholder="Invoice Number"
          className="border-1 p-2 rounded-md focus:outline-1 w-full mb-3"
          value={invoiceNumber}
          onChange={(event) => setInvoiceNumber(event.target.value)}
        />
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
        <div className="mt-4 bg-white p-5 rounded-lg shadow-sm border border-gray-300">
          <h3 className="font-semibold mb-4 text-gray-800">
            Selected Products
          </h3>

          {selected.map((ele) => (
            <div
              key={ele.productId || ele.productName}
              className="p-4 border border-gray-200 rounded-lg shadow-sm mb-3 bg-gray-50"
            >
              <div className="mb-3">
                <label className="block font-medium text-gray-700">Name:</label>
                <input
                  type="text"
                  value={ele.productName}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium text-gray-700">
                  Selling Price:
                </label>
                <input
                  type="number"
                  value={ele.sellingPrice}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium text-gray-700">
                  Cost Price:
                </label>
                <input
                  type="number"
                  value={ele.costPrice}
                  disabled
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div className="mb-3">
                <label className="block font-medium text-gray-700">GST%:</label>
                <select
                  value={ele.gst}
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
                  onChange={(event) =>handleGSTChange(ele.productName, event.target.value)}
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  value={ele.newQuantity || 0}
                  onChange={(event) =>
                    handleQuantityChange(
                      ele.productName,
                      Number(event.target.value)
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100"
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
