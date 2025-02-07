import { useEffect, useState } from "react"
import logo from "../assets/wareWizard-logo-transparent.png"
import "../styles/Home.css"
import { AnimatePresence, motion } from 'framer-motion'

import SellingPortal from "./SellingPortal"
import PurchasePortal from "./PurchasePortal"   
import CustomerData from "./CustomerData"
import ProductsData from "./ProductsData"
import Delete from "./Delete"
import Settings from "./Settings"
import getCookie from "../custom/getCookie"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"
export default function Home() {
    const [tabOpened, setTabOpened] = useState(localStorage.getItem("tab") || "newProduct")
    const [sidebarOpen, setSideBarOpen] = useState(true)
    useEffect(() => {
        localStorage.setItem("tab", tabOpened)
    }, [tabOpened])
    const logout = () => {

        fetch("http://localhost:8080/api/logout/", { credentials: "include" })
            .then(res => res.json())
            .then(res => {
                if (res.logout) {

                    window.location.reload()
                }
            })
    }
    return (
        <>
            <nav className="navbar">
                <img src={logo} alt="" />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }} >
                    <h1>wareWizard</h1>
                    <img src={"http://localhost:8080/api/pps/" + getCookie("uname")} className="user-image" />
                    <div className="hover--option"  >
                        <p>Username: {getCookie("uname")}</p>
                        <p onClick={logout} >Logout</p>
                        <p onClick={() => setTabOpened("settings")} >Settings</p>
                    </div>
                </div>

            </nav>
            <div className="home--main">
                <div className="sidebar"  style={{width : (sidebarOpen ? "8rem" : "2rem")}}>
                    <FontAwesomeIcon icon={faBars} style={{ color: "#ffffff", padding: "0px 10px 10px 10px", cursor: "pointer" }} onClick={() => setSideBarOpen(prev => !prev)} />
                    <AnimatePresence mode="wait" initial={false}>
                        {sidebarOpen && <div>
                            <p
                                className={tabOpened === "sellingPortal" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("sellingPortal")}>
                                Selling Portal
                            </p>
                            <p
                                className={tabOpened === "purchasePortal" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("purchasePortal")}>
                                Purchase Portal
                            </p>
                            <p
                                className={tabOpened === "customerData" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("customerData")}>
                                Customer Data
                            </p>
                            <p
                                className={tabOpened === "productsData" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("productsData")}>
                                Products Data
                            </p>
                            <p
                                className={tabOpened === "Delete" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("Delete")}>
                                Delete Data
                            </p>
                        </div>
                        }
                    </AnimatePresence>
                </div>

                {tabOpened === "sellingPortal" && <SellingPortal />}
                {tabOpened === "purchasePortal" && <PurchasePortal />}
                {tabOpened === "customerData" && <CustomerData />}
                {tabOpened === "productsData" && <ProductsData />}
                {tabOpened === "Delete" && <Delete />}
                {tabOpened === "settings" && <Settings />}
            </div>
        </>
    )
}
