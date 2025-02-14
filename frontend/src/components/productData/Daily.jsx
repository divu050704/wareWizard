import { useEffect, useState } from "react";
import backendInfo from "../../custom/backend-info.json";

export default function Daily() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    fetch(`${backendInfo.url}/api/customer-data`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => setData(res.data));

    const dateToday = new Date();
    setDate(
      `${dateToday.getFullYear()}-${String(dateToday.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(dateToday.getDate()).padStart(2, "0")}`
    );
  }, []);

  let dateTotal = 0;

  const rows = data.map((ele, index) => {
    const localDate = new Date(ele.createdAt);
    const finalDate = `${localDate.getFullYear()}-${String(
      localDate.getMonth() + 1
    ).padStart(2, "0")}-${String(localDate.getDate()).padStart(2, "0")}`;

    let total = 0;

    const products = ele.products.map((e, i) => {
      total += e.sellingQuantity * e.sellingPrice;
      return (
        <div key={i} className="flex justify-between border-b py-2">
          <p className="w-1/4">{e.productName}</p>
          <p className="w-1/4 text-center">{e.sellingQuantity}</p>
          <p className="w-1/4 text-center">{e.sellingPrice}</p>
          <p className="w-1/4 text-right">
            {e.sellingQuantity * e.sellingPrice}
          </p>
        </div>
      );
    });

    if (finalDate === date) {
      dateTotal += total;
      return (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 mb-4">
          <div className="flex flex-col md:flex-row md:justify-between mb-2">
            <div className="font-semibold text-gray-700 bg-white p-4 rounded-lg shadow-md w-full max-w-xs mr-4">
              <p className="text-lg">{ele.name}</p>
              <p className="text-gray-500">{ele.phoneNumber || "NA"}</p>
              <a
                href={`${backendInfo.url}/api/reciept?id=${ele._id}`}
                target="_blank"
                className="mt-2 inline-block text-blue-600 font-medium hover:underline"
              >
                📜 Generate Bill
              </a>
            </div>
            <div className="w-full">
              <div className="flex justify-between bg-gray-100 font-semibold py-2 px-2 rounded-t-lg">
                <p className="w-1/4">Product Name</p>
                <p className="w-1/4 text-center">Sold</p>
                <p className="w-1/4 text-center">Price</p>
                <p className="w-1/4 text-right">Total</p>
              </div>
              {products}
              <div className="flex justify-between border-t font-semibold py-2">
                <p className="w-1/4">Total</p>
                <p className="w-3/4 text-right">{total}</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <p className="font-semibold">Payment Mode</p>
                <p>{ele.paymentMethod}</p>
              </div>
              <div className="flex justify-between border-t py-2">
                <p className="font-semibold">Employee</p>
                <p>{ele.employee || "NA"}</p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Daily Data</h1>
      <input
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="p-2 border border-gray-300 rounded-lg w-full max-w-xs mb-4"
      />
      <div className="space-y-4">{rows}</div>
      <div className="mt-6 flex items-center bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md">
        <h3>Daily Total:&nbsp;&nbsp;</h3>
        <h3>{dateTotal}</h3>
      </div>
    </div>
  );
}
