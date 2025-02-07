import { useState, useEffect } from "react"
import "../../styles/deleteCustomer.css"
export default function Customer() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/api/customer-data", { credentials: "include" })
            .then(res => res.json())
            .then(res => setData(res.data))
        
    }, [])
    const deleteCustomer = (id,name) =>{
        if (confirm("Are you sure you want to delete " + name)) {
            const requestOptions = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ id: id, item: name }),
                credentials: "include"
            }
            fetch("http://localhost:8080/api/delete-customer/", requestOptions)
                .then(res => res.json())
                .then(res => {
                    if (res.Deleted) {
                        alert("Deleted " + res.item)
                        window.location.reload()
                    }
                    else {
                        alert("An error occured")

                    }
                })
        }
    }
    const rows = data.map((ele => {
        let total = 0;
        const products = ele.products.map((e, i) => {
            total += e.sellingQuantity * e.sellingPrice
            return (
                <div style={{ display: "flex" }}>
                    <p className="daily--table-row-c2-c1 daily--table-row-data">

                        {e.productName}
                    </p>
                    <p className="daily--table-row-c2-others daily--table-row-data" >{e.sellingQuantity}</p>
                    <p className="daily--table-row-c2-others daily--table-row-data" >{e.sellingPrice}</p>
                    <p className="daily--table-row-c2-others daily--table-row-data" >{e.sellingQuantity * e.sellingPrice}</p>

                </div>
            )
        })


        
        return (
            <div className="delete-customer--table-row">
                <p className="delete-customer--table-row-c1 delete-customer--table-row-data">{ele.name}</p>
                <div className="delete-customer--table-row-c2" >

                    <div style={{ display: "flex" }} >
                        <p className="delete-customer--table-row-c2-c1 delete-customer--table-row-heading">Product Name</p>
                        <p className="delete-customer--table-row-c2-others delete-customer--table-row-heading">Sold</p>
                        <p className="delete-customer--table-row-c2-others delete-customer--table-row-heading">Price</p>
                        <p className="delete-customer--table-row-c2-others delete-customer--table-row-heading">Total</p>
                    </div>
                    {products}
                    <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center   " }} >
                        <p className="delete-customer--table-row-heading" >Total</p>
                        <p className="delete-customer--table-row-data" >{total}</p>
                    </div>
                </div>
                <div className="delete-customer--table-row-c3" >
                    <button onClick={() => deleteCustomer(ele._id, ele.name)} >Delete</button>
                </div>
            </div>
        )

    }))
    return (
        <div className="delete-customer">
            <div className="delete-customer--table">
                <div className="delete-customer--table-row">
                    <p className="delete-customer--table-row-c1 delete-customer--table-row-heading">Name</p>
                    <p className="delete-customer--table-row-c2 delete-customer--table-row-heading">Products</p>
                    <p className="delete-customer--table-row-c3 delete-customer--table-row-heading" >Delete</p>
                </div>
                {rows}

            </div>
            
        </div>
    )
}