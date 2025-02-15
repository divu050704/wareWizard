import { useState } from "react";
import sha256 from "../custom/sha256";
import backendInfo from "../custom/backend-info.json";

export default function Settings() {
  const [creds, setCreds] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [newUser, setNewUser] = useState({
    user: "",
    passwd: "",
    confirmPasswd: "",
    admin: false,
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (!creds.currentPassword || !creds.newPassword || !creds.confirmNewPassword) {
      alert("Please fill out all fields.");
      return;
    }
    if (creds.newPassword !== creds.confirmNewPassword) {
      alert("Passwords do not match.");
      return;
    }

    fetch(`${backendInfo.url}/api/change-password`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        passwd: sha256(creds.currentPassword),
        newPasswd: sha256(creds.newPassword),
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.Updated) {
          alert("Password changed! You will be logged out.");
          fetch(`${backendInfo.url}/api/logout/`, { credentials: "include" });
          window.location.reload();
        } else {
          alert("An error occurred.");
        }
      });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!newUser.user || !newUser.passwd || !newUser.confirmPasswd) {
      alert("Please fill out all fields.");
      return;
    }
    if (newUser.passwd !== newUser.confirmPasswd) {
      alert("Passwords do not match.");
      return;
    }

    fetch(`${backendInfo.url}/api/new-user`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({
        user: newUser.user.trim(),
        passwd: sha256(newUser.passwd.trim()),
        admin: newUser.admin,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.added) {
          alert("New user added successfully!");
          setNewUser({ user: "", passwd: "", confirmPasswd: "", admin: false });
        } else {
          alert("An error occurred.");
        }
      });
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">⚙️ Settings</h1>

      {/* Change Password Section */}
      <h2 className="text-lg font-medium mb-2">🔑 Change Password</h2>
      <form onSubmit={handlePasswordChange} className="mb-6">
        <label className="block mb-1">Current Password</label>
        <input
          type="password"
          value={creds.currentPassword}
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, currentPassword: e.target.value }))
          }
          className="w-full p-2 border rounded-lg mb-2"
          required
        />

        <label className="block mb-1">New Password</label>
        <input
          type="password"
          value={creds.newPassword}
          onChange={(e) =>
            setCreds((prev) => ({ ...prev, newPassword: e.target.value }))
          }
          className="w-full p-2 border rounded-lg mb-2"
          required
        />

        <label className="block mb-1">Confirm New Password</label>
        <input
          type="password"
          value={creds.confirmNewPassword}
          onChange={(e) =>
            setCreds((prev) => ({
              ...prev,
              confirmNewPassword: e.target.value,
            }))
          }
          className="w-full p-2 border rounded-lg mb-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg mt-3 transition"
        >
          Update Password ✅
        </button>
      </form>

      {/* Add User Section */}
      <h2 className="text-lg font-medium mb-2">👤 Add New User</h2>
      <form onSubmit={handleAddUser}>
        <label className="block mb-1">Username</label>
        <input
          type="text"
          value={newUser.user}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, user: e.target.value }))
          }
          className="w-full p-2 border rounded-lg mb-2"
          required
        />

        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={newUser.admin}
            onChange={(e) =>
              setNewUser((prev) => ({ ...prev, admin: e.target.checked }))
            }
            className="mr-2"
          />
          <label>Admin</label>
        </div>

        <label className="block mb-1">Password</label>
        <input
          type="password"
          value={newUser.passwd}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, passwd: e.target.value }))
          }
          className="w-full p-2 border rounded-lg mb-2"
          required
        />

        <label className="block mb-1">Confirm Password</label>
        <input
          type="password"
          value={newUser.confirmPasswd}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, confirmPasswd: e.target.value }))
          }
          className="w-full p-2 border rounded-lg mb-2"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg mt-3 transition"
        >
          Add User ➕
        </button>
      </form>
    </div>
  );
}
