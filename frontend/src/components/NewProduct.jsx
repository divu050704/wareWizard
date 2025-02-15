import { useEffect, useState } from "react";
import backendInfo from "../custom/backend-info.json";

export default function NewProduct() {
  const [category, setCategory] = useState("Book");
  const [subCategory, setSubCategory] = useState("10-years");
  const [selectedSeller, setSelectedSeller] = useState("");
  const [data, setData] = useState([
    {
      productName: "",
      costPrice: "",
      sellingPrice: "",
      quantity: "",
      gst: "",
    },
  ]);

  const submit = () => {
    if (
      data.every(
        (x) =>
          x.productName !== "" &&
          x.costPrice !== "" &&
          x.sellingPrice !== "" &&
          x.quantity !== ""
      )
    ) {
      const requestOptions = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          data: data,
          category: category,
          subCategory: subCategory,
          seller: selectedSeller,
        }),
        credentials: "include",
      };
      fetch(`${backendInfo.url}/api/new-product/`, requestOptions)
        .then((res) =>
          res.status === 302 ? alert("Unauthorized Access") : res.json()
        )
        .then((last) => {
          if (last.saved) {
            alert("Data uploaded!");
            window.location.reload();
          } else {
            alert(last.unsaved + " already exists");
          }
        });
    } else {
      alert("All fields are required!");
    }
  };
  const addNew = () => {
    setData((prev) => [
      ...prev,
      {
        productName: "",
        costPrice: "",
        sellingPrice: "",
        quantity: "",
        gst: "",
      },
    ]);
  };
  const delData = (index) => {
    setData((prev) => {
      const newData = [];
      prev.map((ele, i) => {
        if (index !== i) {
          newData.push(ele);
        }
      });
      return newData;
    });
  };
  const handleDataChange = (value, type, index) => {
    setData((prev) => {
      const newState = prev.map((ele, i) => {
        if (index === i) {
          return { ...ele, [type]: value };
        }
        return ele;
      });
      return newState;
    });
  };

  const main = data.map((ele, index) => (
    <div key={index} className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="font-bold text-lg text-gray-700">{index + 1}.</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.productName}
            onChange={(event) =>
              handleDataChange(event.target.value, "productName", index)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cost Price
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.costPrice}
            onChange={(event) =>
              handleDataChange(event.target.value, "costPrice", index)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Selling Price
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.sellingPrice}
            onChange={(event) =>
              handleDataChange(event.target.value, "sellingPrice", index)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.quantity}
            onChange={(event) =>
              handleDataChange(event.target.value, "quantity", index)
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.gst}
            onChange={(event) =>
              handleDataChange(event.target.value, "gst", index)
            }
            type="number"
          >
            <option value={0}>0%</option>
            <option value={5}>5%</option>
            <option value={12}>12%</option>
            <option value={18}>18%</option>
            <option value={28}>28%</option>
          </select>
        </div>
      </div>

      <button
        onClick={() => delData(index)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
      >
        Delete
      </button>
    </div>
  ));

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="Book">Book</option>
              <option value="others">Others</option>
            </select>
          </div>

          {category === "Book" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={subCategory}
                onChange={(event) => setSubCategory(event.target.value)}
              >
                <option value="10-years">10-years</option>
                <option value="Guide">Guide</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {main}

      <div className="flex gap-4">
        <button
          onClick={addNew}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors"
        >
          Add+
        </button>

        <button
          onClick={submit}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
