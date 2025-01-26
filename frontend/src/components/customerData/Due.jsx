import { useState, useEffect } from "react";
import "../../styles/Due.scss";

export default function Due() {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/customer-data")
            .then((res) => res.json())
            .then((res) => setData(res.data));
    }, []);

    const deleteDue = (id) => {
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ id: id }),
        };
        fetch("http://localhost:8080/api/delete-due/", requestOptions)
            .then((res) => res.json())
            .then((res) => {
                if (res.delete) {
                    alert("Deleted");
                    fetchData();
                } else {
                    alert("An error occurred");
                    fetchData();
                }
            });
    };

    const table = data.map((ele) => {
        if ((ele.paymentMethod === "Due-Online") || (ele.paymentMethod === "Due-Offline") || (ele.paid < ele.total)) {
            const date = new Date(ele.createdAt);
            const products = ele.products.map((e) => (
                <p style={{ borderBottom: "1px solid #8EBBFF", margin: 0 }}>{e.productName}</p>
            ));

            return (
                <div className="due--table-row" key={ele._id}>
                    <p className="due--table-data">{ele.name}</p>
                    <p className="due--table-data">{ele.phoneNumber}</p>
                    <p className="due--table-data">
                        {date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()}
                    </p>
                    <div className="due--table-data-products">{products}</div>
                    <p className="due--table-data">{ele.total}</p>
                    <p className="due--table-data">{ele.paid}</p>
                    <div className="due--table-data">
                        <button
                            onClick={() => deleteDue(ele._id)}
                            className="due--table-delete"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            );
        }
    });

    return (
        <div className="Due">
            <h1>Due</h1>
            <div className="due--table">
                <div className="due--table-row">
                    <p className="due--table-heading">Name</p>
                    <p className="due--table-heading">Phone Number</p>
                    <p className="due--table-heading">Date</p>
                    <p className="due--table-heading">Products</p>
                    <p className="due--table-heading">Total</p>
                    <p className="due--table-heading">Paid</p>
                    <p className="due--table-heading">Delete</p>
                </div>
                {table}
            </div>
        </div>
    );
}
