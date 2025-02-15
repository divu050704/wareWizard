import React, { useState } from "react";
import backendInfo from "../custom/backend-info.json";

export default function NewDistributor() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!name || !phoneNumber || !address) {
      alert("Please fill in all required fields!");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Invalid phone number! Please enter a 10-digit number.");
      return;
    }

    setLoading(true);
    fetch(`${backendInfo.url}/api/new-distributor/`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ name, phoneNumber, address }),
      credentials: "include",
    })
      .then((res) => (res.status === 302 ? alert("Unauthorized Access") : res.json()))
      .then((last) => {
        setLoading(false);
        if (last.added) {
          alert("Distributor added successfully!");
          setName("");
          setPhoneNumber("");
          setAddress("");
        } else {
          alert(`${last.unsaved} already exists!`);
        }
      })
      .catch(() => {
        setLoading(false);
        alert("Something went wrong! Please try again.");
      });
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">➕ Add New Distributor</h1>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          placeholder="Enter distributor name"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          placeholder="Enter 10-digit phone number"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-300"
          placeholder="Enter address"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition"
      >
        {loading ? "Submitting..." : "Submit ✅"}
      </button>
    </div>
  );
}
