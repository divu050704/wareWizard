import { useState } from "react"
import Daily from "./productData/Daily"
import Complete from "./productData/Complete"
import "../styles/productsData.css"
export default function ProductsData(){
    const [type, setType] = useState("daily")
    return (
        <div className="products-data">
            <h1>Select Product Data you want</h1>
            <select value={type} onChange={(event)=> setType(event.target.value)}>
                <option value="daily">Daily Data</option>
                <option value="complete">Complete Data</option>
            </select>
            {type === "daily" && <Daily />}
            {type === "complete" && <Complete />}
        </div>
    )
}