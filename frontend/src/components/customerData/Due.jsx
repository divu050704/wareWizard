import { useEffect, useState } from "react";
import backendInfo from "../../custom/backend-info.json";
export default function Due() {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch(`${backendInfo.url}/api/customer-data`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  }, []);
  const fetchData = () => {
    fetch(`${backendInfo.url}/api/customer-data`)
      .then((res) => res.json())
      .then((res) => setData(res.data));
  };
  const deleteDue = (id) => {
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ id: id }),
    };
    fetch(`${backendInfo.url}/api/delete-due/`, requestOptions)
      .then((res) => res.json())
      .then((res) => {
        if (res.delete) {
          alert("Deleted");
          fetchData();
        } else {
          alert("An error occured");
          fetchData();
        }
      });
  };
  const table = data.map((ele, index) => {
    var date = new Date(ele.createdAt);
    if (ele.due)
      return (
        <div
          key={index}
          className="grid grid-cols-4 gap-4 items-center p-4 border-b border-gray-200 hover:bg-gray-50"
        >
          <div className="truncate">{ele.name}</div>
          <div className="truncate">{ele.phoneNumber}</div>
          <div className="truncate">
            {date.getFullYear() +
              "-" +
              (date.getMonth() + 1) +
              "-" +
              date.getDate()}
          </div>
          <div>
            <button
              onClick={() => {
                deleteDue(ele._id);
              }}
              className="bg-red-400 hover:bg-red-500 hover:cursor-pointer p-2 text-white rounded-sm"
            >
              Delete
            </button>
          </div>
        </div>
      );
  });
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Dues</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-4 gap-4 items-center p-4 bg-gray-50 border-b border-gray-200 font-semibold">
          <div>Name</div>
          <div>Phone Number</div>
          <div>Date</div>
          <div>Delete</div>
        </div>
        {table}
        <div className="divide-y divide-gray-200"></div>
      </div>
    </div>
  );
}
