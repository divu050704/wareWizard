// import "../styles/Login.css"
import { useState } from "react";
import sha256 from "../custom/sha256";
import backendInfo from "../custom/backend-info.json";

export default function Login() {
  const [data, setData] = useState({ uname: "", passwd: "" });
  const [showPassword, setShowPassword] = useState(false);
  const login = (e) => {
    e.preventDefault();
    const requestOptions = {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ ...data, passwd: sha256(data.passwd) }),
      credentials: "include",
    };
    fetch(`${backendInfo.url}/api/login/`, requestOptions)
      .then((res) => res.json())
      .then((last) => {
        if (last.loggedIn) {
          window.location.reload();
        } else alert("Wrong username or password");
      });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-96" onSubmit={login}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={data.uname}
            onChange={(event) =>
              setData((prev) => ({ ...prev, uname: event.target.value }))
            }
            required={true}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={data.passwd}
            onChange={(event) =>
              setData((prev) => ({ ...prev, passwd: event.target.value }))
            }
            required={true}
            type={!showPassword ? "password" : "text"}
          />
        </div>

        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            value={showPassword}
            onChange={(event) => setShowPassword(event.target.checked)}
          />
          <label className="text-sm text-gray-600">Show password</label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
