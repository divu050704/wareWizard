import { useEffect, useState } from "react";
import logo from "../assets/wareWizard-logo-transparent.png";
import { AnimatePresence, motion } from "framer-motion";

import NewProduct from "./NewProduct";
import SellingPortal from "./SellingPortal";
import CustomerData from "./CustomerData";
import ProductsData from "./ProductsData";
import ProductUpdate from "./productUpdate";
import Delete from "./Delete";
import Settings from "./Settings";
import NewDistributor from "./NewDistributor";
import PurchaseProduct from "./purchaseProduct";
import getCookie from "../custom/getCookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import backendInfo from "../custom/backend-info.json";

export default function Home() {
  const [tabOpened, setTabOpened] = useState(
    localStorage.getItem("tab") || "newProduct"
  );
  const [sidebarOpen, setSideBarOpen] = useState(true);
  useEffect(() => {
    localStorage.setItem("tab", tabOpened);
  }, [tabOpened]);
  const logout = () => {
    fetch(`${backendInfo.url}/api/logout/`, { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.logout) {
          window.location.reload();
        }
      });
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between">
        <img src={logo} alt="Logo" className="h-8" />
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-800">wareWizard</h1>
          <div className="relative group">
            <img
              src={`${backendInfo.url}/api/pps/${getCookie("uname")}`}
              className="h-10 w-10 rounded-full cursor-pointer object-cover"
            />
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
              <p className="px-4 py-2 text-sm text-gray-700">
                Username: {getCookie("uname")}
              </p>
              <p
                onClick={logout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Logout
              </p>
              <p
                onClick={() => setTabOpened("settings")}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Settings
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div
          className={`bg-gray-800 min-h-screen transition-all duration-300 ${
            sidebarOpen ? "w-32" : "w-8"
          }`}
        >
          <button
            onClick={() => setSideBarOpen((prev) => !prev)}
            className="text-white p-2 w-full hover:bg-gray-700"
          >
            <FontAwesomeIcon icon={faBars} />
          </button>

          <AnimatePresence mode="wait" initial={false}>
            {sidebarOpen && (
              <div className="flex flex-col">
                {[
                  { id: "newProduct", label: "New Product Portal" },
                  { id: "sellingPortal", label: "Selling Portal" },
                  { id: "customerData", label: "Customer Data" },
                  { id: "productsData", label: "Products Data" },
                  { id: "productUpdate", label: "Update Products Data" },
                  { id: "Delete", label: "Delete Data" },
                  { id: "newDistributor", label: "New Distributor" },
                  { id: "purchaseProduct", label: "Product Purchase" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTabOpened(item.id)}
                    className={`px-3 py-2 text-sm text-left transition-colors ${
                      tabOpened === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <a
                  href="https://inventory-new-backup.divu050704.repl.co/"
                  target="next"
                  className="px-3 py-2 text-sm text-blue-400 hover:bg-gray-700 transition-colors"
                >
                  Renting Portal
                </a>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 p-6">
          {tabOpened === "newProduct" && <NewProduct />}
          {tabOpened === "sellingPortal" && <SellingPortal />}
          {tabOpened === "customerData" && <CustomerData />}
          {tabOpened === "productsData" && <ProductsData />}
          {tabOpened === "productUpdate" && <ProductUpdate />}
          {tabOpened === "Delete" && <Delete />}
          {tabOpened === "settings" && <Settings />}
          {tabOpened === "newDistributor" && <NewDistributor />}
          {tabOpened === "purchaseProduct" && <PurchaseProduct />}
        </div>
      </div>
    </div>
  );
}
