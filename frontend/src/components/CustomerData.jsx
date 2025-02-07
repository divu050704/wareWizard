import { useState } from "react";
import "../styles/CustomerData.css";
import Due from "./customerData/Due";
import Advance from "./customerData/Advance";
import Paid from "./customerData/Paid"; // New component for Paid customers

export default function CustomerData() {
    const [type, setType] = useState("all");

    return (
        <div className="customerData">
            <h1>Select what type of Customer's data you want to see</h1>
            <select value={type} onChange={(event) => setType(event.target.value)}>
                <option value="all">All</option>
                <option value="due">Due</option>
                <option value="advance">Advance</option>
                <option value="paid">Paid</option> {/* Option for Paid */}
            </select>
            {type === "all" && (
                <>
                    <Due />
                    <Advance />
                    <Paid />
                </>
            )}
            {type === "due" && <Due />}
            {type === "advance" && <Advance />}
            {type === "paid" && <Paid />}
        </div>
    );
}
