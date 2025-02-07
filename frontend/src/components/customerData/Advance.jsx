import { useState, useEffect } from "react"
import "../../styles/Advance.css"
export default function Advance() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/api/customer-data")
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const deleteAdvcance = (id) => {
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({id: id}),
            
        }
        fetch("http://localhost:8080/api/delete-advance/",requestOptions)
        .then(res => res.json())
        .then(res => {
            if (res.delete){ 
                alert("Deleted")
                fetchData()
            }
            else{
                alert("An error occured")
                fetchData()
            }
        })
    }
    const table = data.map((ele, ind) => {
        if ((ele.paymentMethod === "Advanced-Online") || (ele.paymentMethod === "Advance-Offline") || (ele.paid > ele.total)) {
            var date = new Date(ele.createdAt)
            const products = ele.products.map((e, i) => (
                <p style={{ borderBottom: "1px solid #8EBBFF", margin: 0 }}>{e.productName}</p>
            ))
            return (
                <div className="advance--table-row">
                    <p className="advance--table-data">{ele.name}</p>
                    <p className="advance--table-data">{ele.phoneNumber}</p>
                    <p className="advance--table-data">{date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}</p>
                    <div className="advance--table-data-products">{products}</div>
                    <p className="advance--table-data">{ele.total}</p>
                    <p className="advance--table-data">{ele.paid}</p>

                    <div className="advance--table-data"><button onClick={() => deleteAdvcance(ele._id)} className="advance--table-delete" >Delete</button></div>
                </div>
            )
        }
    })
    return (
        <div className="Advance">
            <h1>Advance</h1>
            <div className="advance--table">
                <div className="advance--table-row">
                    <p className="advance--table-heading">Name</p>
                    <p className="advance--table-heading">Phone Number</p>
                    <p className="advance--table-heading">Date</p>
                    <p className="advance--table-heading">Products</p>
                    <p className="advance--table-heading">Total</p>
                    <p className="advance--table-heading">Paid</p>
                    <p className="advance--table-heading">Delete</p>
                </div>
                {table}
            </div>
        </div>
    )
}