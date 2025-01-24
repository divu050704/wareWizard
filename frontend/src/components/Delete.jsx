import { useState } from "react"
import Products from "./Delete/Products" 
import Customer from "./Delete/Customer"
import "../styles/Delete.css"
export default function Delete(){
    const [type,setType] = useState("Product")
    return(
        <div className="delete-portal" >
            <h1>Delete Portal</h1>
            <h2>
                Select data type
            </h2>
            <select value={type} onChange={(event) => setType(event.target.value)} >
                <option value="Product" >Product</option>
                <option value="Customer">Customer</option>
            </select>
            {type === "Product" && <Products />}
            {type === "Customer" && <Customer /> }
        </div>
    )
}