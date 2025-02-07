import { useState, useEffect } from "react";
import "../../styles/Paid.css";

export default function Paid() {
    const [data, setData] = useState([]);

    // Fetch data from the backend
    useEffect(() => {
        fetch("http://localhost:8080/api/customer-data")
            .then((res) => res.json())
            .then((res) => setData(res.data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    // Delete paid customer
    const deletePaid = (id) => {
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ id }),
        };
        fetch("http://localhost:8080/api/delete-paid/", requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.delete) {
                    alert("Deleted");
                    fetchData();
                } else {
                    alert("An error occurred");
                }
            })
            .catch((error) => console.error("Error deleting paid customer:", error));
    };

    // Map over customer data to create rows
    const table = data.map((ele) => {
        if (ele.paymentStatus === "Paid" || ele.paid >= ele.total) {
            const date = new Date(ele.createdAt);
            const products = ele.products.map((e, i) => (
                <p key={i} style={{ borderBottom: "1px solid #8EBBFF", margin: 0 }}>{e.productName}</p>
            ));
            return (
                <div key={ele._id} className="paid--table-row">
                    <p className="paid--table-data">{ele.name}</p>
                    <p className="paid--table-data">{ele.phoneNumber}</p>
                    <p className="paid--table-data">{`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}</p>
                    <div className="paid--table-data">{products}</div>
                    <p className="paid--table-data">{ele.total}</p>
                    <p className="paid--table-data">{ele.paid}</p>
                    <div className="paid--table-data">
                        <button onClick={() => deletePaid(ele._id)} className="paid--table-delete">Delete</button>
                    </div>
                </div>
            );
        }
        return null; // Ensures only relevant rows are rendered
    });

    return (
        <div className="Paid">
            <h1>Paid</h1>
            <div className="paid--table">
                <div className="paid--table-row">
                    <p className="paid--table-heading">Name</p>
                    <p className="paid--table-heading">Phone Number</p>
                    <p className="paid--table-heading">Date</p>
                    <p className="paid--table-heading">Products</p>
                    <p className="paid--table-heading">Total</p>
                    <p className="paid--table-heading">Paid</p>
                    <p className="paid--table-heading">Delete</p>
                </div>
                {table}
            </div>
        </div>
    );
}
