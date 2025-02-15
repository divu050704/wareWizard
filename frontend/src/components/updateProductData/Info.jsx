import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import backendInfo from "../../custom/backend-info.json";

export default function Info() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    fetch(`${backendInfo.url}/api/products-data`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {console.log(res.data);setData(res.data)});
  }, []);

  const handleInputChange = (id, field, value) => {
    setSelected((prev) =>
      prev.map((item) => (item._id === id ? { ...item, [field]: value } : item))
    );
  };

  const selectedData = selected.map((ele) => (
    <div key={ele._id} className="p-4 bg-gray-100 rounded-lg shadow-md mb-4">
      <label className="block text-gray-700 font-semibold mb-1">Name:</label>
      <input
        type="text"
        value={ele.productName}
        onChange={(event) =>
          handleInputChange(ele._id, "productName", event.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
      />
      <label className="block text-gray-700 font-semibold mb-1">
        Selling Price:
      </label>
      <input
        type="text"
        value={ele.sellingPrice}
        onChange={(event) =>
          handleInputChange(ele._id, "sellingPrice", event.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
      />
      <label className="block text-gray-700 font-semibold mb-1">
        Cost Price:
      </label>
      <input
        type="text"
        value={ele.costPrice}
        onChange={(event) =>
          handleInputChange(ele._id, "costPrice", event.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
      />
      <label className="block text-gray-700 font-semibold mb-1">GST%:</label>
      <select
        value={ele.gst}
        onChange={(event) =>
          handleInputChange(ele._id, "gst", event.target.value)
        }
        className="w-full p-2 border border-gray-300 rounded-lg mb-2"
      >
        <option value={0} >0%</option>
        <option value={5} >5%</option>
        <option value={12}>12%</option>
        <option value={18}>18%</option>
        <option value={28}>28%</option>
      </select>
    </div>
  ));

  const submit = () => {
    fetch(`${backendInfo.url}/api/update-info/`, {
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
    <div className="info p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-4 text-center">
        🛒 Manage Product Info
      </h1>
      <div className="multi-select-custom mb-4">
        <Multiselect
          options={data}
          onSelect={(value, final) => setSelected([...selected, final])}
          onRemove={(value) => setSelected(value)}
          displayValue="productName"
          groupBy="category"
        />
      </div>
      {selectedData}
      <button
        className="w-full p-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition"
        onClick={submit}
      >
        Submit
      </button>
    </div>
  );
}
