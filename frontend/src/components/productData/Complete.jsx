import { useEffect, useState } from "react"
import "../../styles/Complete.css"
import backendInfo from "../../custom/backend-info.json"

export default function Complete() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(`${backendInfo.url}/api/products-data/`, { credentials: "include" })
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const rows = data.map((ele) => {
        return (<tr>
            <td>{ele.productName}</td>
            <td>{ele.quantity}</td>
            <td>{ele.sellingPrice}</td>
        </tr>)
    })

    return (
        <div className="complete-data">
            <h1>Complete Data</h1>
            <table border={1}>
                <thead>
                    <th>Product Name</th>
                    <th>Available</th>
                    <th>Price</th>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}