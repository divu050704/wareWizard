import { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import backendInfo from "../custom/backend-info.json";

export default function SellingPortal() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [customerData, setCustomerData] = useState({
    name: "",
    phoneNumber: "",
    paid: 0,
    discounted: false,
    paymentMethod: "Online",
    amazon: false,
    total: 0,
  });
  const [recieptOpen, setRecieptOpen] = useState(false);
  useEffect(() => {
    if (selected.length !== 0) {
      setCustomerData((prev) => ({
        ...prev,
        total: selected.reduce((accumulator, object) => {
          return (
            accumulator +
            Number(object.sellingPrice) * Number(object.sellingQuantity)
          );
        }, 0),
      }));
    }
  }, [selected]);
  useEffect(() => {
    const requestOptions = {
      credentials: "include",
    };
    fetch(`${backendInfo.url}/api/products-data`, requestOptions)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, []);
  const selectedData = selected.map((ele, ind) => {
    return (
      <div key={ind} className="mb-6 last:mb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
          <div className="flex items-center">
            <span className="font-semibold">Name:</span>
            <span className="ml-2">{ele.productName}</span>
          </div>

          <div className="flex items-center">
            <span className="font-semibold">Price:</span>
            <input
              className="ml-2 px-2 py-1 border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ele.sellingPrice}
              type="number"
              min={0}
              onChange={(event) =>
                setSelected((prev) => {
                  const newData = prev.map((e) =>
                    e.productName === ele.productName
                      ? { ...e, sellingPrice: event.target.value }
                      : e
                  );
                  return newData;
                })
              }
            />
          </div>

          <div className="flex items-center">
            <span className="font-semibold">Available:</span>
            <span className="ml-2">{ele.quantity}</span>
          </div>

          <div className="flex items-center">
            <span className="font-semibold">Quantity:</span>
            <input
              className="ml-2 px-2 py-1 border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={ele.sellingQuantity}
              type="number"
              min={0}
              onChange={(event) =>
                setSelected((prev) => {
                  const newData = prev.map((e) =>
                    e.productName === ele.productName
                      ? { ...e, sellingQuantity: event.target.value }
                      : e
                  );
                  return newData;
                })
              }
            />
          </div>

          <div className="flex items-center">
            <span className="font-semibold">Total:</span>
            <span className="ml-2">
              {Number(ele.sellingPrice) * Number(ele.sellingQuantity)}
            </span>
          </div>
        </div>
        <hr className="my-4" />
      </div>
    );
  });
  const recieptData = selected.map((ele, ind) => (
    <div key={ind} className="mb-6 last:mb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-md">
        <div className="flex items-center">
          <span className="font-semibold">Name:</span>
          <span className="ml-2">{ele.productName}</span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold">Price:</span>
          <input
            className="ml-2 px-2 py-1 border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.sellingPrice}
            type="number"
            min={0}
            onChange={(event) =>
              setSelected((prev) => {
                const newData = prev.map((e) =>
                  e.productName === ele.productName
                    ? { ...e, sellingPrice: event.target.value }
                    : e
                );
                return newData;
              })
            }
          />
        </div>

        <div className="flex items-center">
          <span className="font-semibold">Available:</span>
          <span className="ml-2">{ele.quantity}</span>
        </div>

        <div className="flex items-center">
          <span className="font-semibold">Quantity:</span>
          <input
            className="ml-2 px-2 py-1 border border-gray-300 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={ele.sellingQuantity}
            type="number"
            min={0}
            onChange={(event) =>
              setSelected((prev) => {
                const newData = prev.map((e) =>
                  e.productName === ele.productName
                    ? { ...e, sellingQuantity: event.target.value }
                    : e
                );
                return newData;
              })
            }
          />
        </div>

        <div className="flex items-center">
          <span className="font-semibold">Total:</span>
          <span className="ml-2">
            {Number(ele.sellingPrice) * Number(ele.sellingQuantity)}
          </span>
        </div>
      </div>
      <hr className="my-4" />
    </div>
  ));
  const Reciept = () => (
    <div>
      <h1>Products</h1>
      {recieptData}
      <h1>Customer Name</h1>
      <p>{customerData.name}</p>
      <h1>Phone Number</h1>
      <p>{customerData.phoneNumber}</p>
      <h1>Discounted</h1>
      <p>{customerData.discounted ? "Yes" : "No"}</p>
      <h1>Total</h1>
      <p>{customerData.total}</p>
      <h1>Paid</h1>
      <p>{customerData.paid}</p>
      <h1>Due</h1>
      <p>{customerData.total - Number(customerData.paid)}</p>
      <button
        className="selling--portal-cancel"
        onClick={() => {
          setRecieptOpen(false);
        }}
      >
        Cancel
      </button>
      &emsp;
      <button className="selling--portal-submit" onClick={submit}>
        Submit
      </button>
    </div>
  );
  const submit = (e) => {
    e.preventDefault();
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ data: selected, customerData: customerData }),
      credentials: "include",
    };
    fetch(`${backendInfo.url}/api/sell/`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.sold) {
          alert("Data Sold");
          window.location.reload();
        } else {
          alert("An error Occured: " + res.error);
        }
      });
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      {recieptOpen ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Products</h2>
          {recieptData}

          <div className="space-y-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold">Customer Name</h3>
              <p className="text-gray-700">{customerData.name}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Phone Number</h3>
              <p className="text-gray-700">{customerData.phoneNumber}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Discounted</h3>
              <p className="text-gray-700">
                {customerData.discounted ? "Yes" : "No"}
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold">Total</h3>
              <p className="text-gray-700">{customerData.total}</p>

              <h3 className="text-lg font-semibold mt-2">Paid</h3>
              <p className="text-gray-700">{customerData.paid}</p>

              <h3 className="text-lg font-semibold mt-2">Due</h3>
              <p className="text-gray-700">
                {customerData.total - Number(customerData.paid)}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
              onClick={() => setRecieptOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={submit}
            >
              Submit
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Product Name</h2>
          <div className="bg-blue-50 rounded-md p-4 mb-6">
            <Multiselect
              options={data}
              onSelect={(value, final) =>
                setSelected((prev) => [
                  ...prev,
                  { ...final, sellingQuantity: 1 },
                ])
              }
              onRemove={(value) => {
                setSelected((prev) => (prev.length === 0 ? [] : value));
              }}
              displayValue="productName"
              groupBy="category"
            />
          </div>

          <h2 className="text-2xl font-bold mb-4">Details</h2>
          <hr className="mb-4" />
          {selectedData}

          <form onSubmit={() => setRecieptOpen(true)} className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Total</h3>
              <p className="text-gray-700">{customerData.total}</p>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Customer Name
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customerData.name}
                onChange={(event) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Phone Number
              </label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                maxLength={10}
                value={customerData.phoneNumber}
                onChange={(event) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    phoneNumber: event.target.value,
                  }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">
                Mode of Payment
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={customerData.paymentMethod}
                onChange={(event) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    paymentMethod: event.target.value,
                  }))
                }
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Advanced-Online">Advanced-Online</option>
                <option value="Advanced-Offline">Advanced-Offline</option>
                <option value="Due">Due</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-semibold mb-2">Paid</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                type="number"
                value={customerData.paid}
                onChange={(event) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    paid: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="amazon"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={customerData.amazon}
                  onChange={(event) =>
                    setCustomerData((prev) => ({
                      ...prev,
                      amazon: event.target.checked,
                    }))
                  }
                />
                <label htmlFor="amazon" className="ml-2 text-gray-700">
                  Amazon
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="discount"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  checked={customerData.discounted}
                  onChange={(event) =>
                    setCustomerData((prev) => ({
                      ...prev,
                      discounted: event.target.checked,
                    }))
                  }
                />
                <label htmlFor="discount" className="ml-2 text-gray-700">
                  Discounted
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Submit
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
