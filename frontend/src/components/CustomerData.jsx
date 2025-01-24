import { useState } from "react"
import "../styles/CustomerData.css"
import Due from "./customerData/Due"
import Advance from "./customerData/Advance"
export default function CustomerData(){
    const [type, setType] = useState("due")
    return(
        <div className="customerData">
            <h1>Select what type of Customer's data you want to see</h1>
            <select value={type} onChange={(event)=> setType(event.target.value)}>
                <option value="all">All</option>
                <option value="due">due</option>
                <option value="advance">Advance</option>
            </select>
            {type === "due" && <Due />}
            {type==="advance" && <Advance />}
        </div>
    )
}