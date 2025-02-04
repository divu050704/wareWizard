import { useEffect, useState } from "react"
import logo from "../assets/wareWizard-logo-transparent.png"
import "../styles/Home.css"
import { AnimatePresence, motion } from 'framer-motion'

import NewProduct from "./NewProduct"
import SellingPortal from "./SellingPortal"
import CustomerData from "./CustomerData"
import ProductsData from "./ProductsData"
import ProductUpdate from "./productUpdate"
import Delete from "./Delete"
import Settings from "./Settings"
import NewDistributor from "./NewDistributor"
import getCookie from "../custom/getCookie"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"
import backendInfo from "../custom/backend-info.json"

export default function Home() {
    const [tabOpened, setTabOpened] = useState(localStorage.getItem("tab") || "newProduct")
    const [sidebarOpen, setSideBarOpen] = useState(true)
    useEffect(() => {
        localStorage.setItem("tab", tabOpened)
    }, [tabOpened])
    const logout = () => {

        fetch(`${backendInfo.url}/api/logout/`, { credentials: "include" })
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
                    <img src={`${backendInfo.url}/api/pps/` + getCookie("uname")} className="user-image" />
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
                            <p className={tabOpened === "newProduct" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("newProduct")}>
                                New Product Portal
                            </p>
                            <p
                                className={tabOpened === "sellingPortal" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("sellingPortal")}>
                                Selling Portal
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
                                className={tabOpened === "productUpdate" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("productUpdate")}>
                                Update Products Data
                            </p>
                            <p
                                className={tabOpened === "Delete" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("Delete")}>
                                Delete Data
                            </p>
                            <p
                                className={tabOpened === "newDistributor" ? "sidebar--selected" : "sidebar--unselected"}
                                onClick={() => setTabOpened("newDistributor")}>
                                New Distributor
                            </p>
                            <a href="https://inventory-new-backup.divu050704.repl.co/"
                                target="next"
                                style={{textDecoration: "none", color: "#8EBBFF", margin: "0.5rem"}}>Renting Portal</a>
                        </div>
                        }
                    </AnimatePresence>
                </div>

                {tabOpened === "newProduct" && <NewProduct />}
                {tabOpened === "sellingPortal" && <SellingPortal />}
                {tabOpened === "customerData" && <CustomerData />}
                {tabOpened === "productsData" && <ProductsData />}
                {tabOpened === "productUpdate" && <ProductUpdate />}
                {tabOpened === "Delete" && <Delete />}
                {tabOpened === "settings" && <Settings />}
                {tabOpened === "newDistributor" && <NewDistributor />}
            </div>
        </>
    )
}
