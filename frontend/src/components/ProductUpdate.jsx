import { useState } from "react"
import "../styles/ProductUpdate.scss"
import Stock from "./updateProductData/stock"
import Info from "./updateProductData/Info"
export default function ProductUpdate(){
    const [type,setType] = useState("stock")
    return(
        <div className="product-update">
            <h1>Select what type of product Data you want to update</h1>
            <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="stock">Stock</option>
                <option value="info">Information</option>
            </select>
            {type === "stock" && <Stock />}
            {type === "info" && <Info />}
        </div>
    )
}