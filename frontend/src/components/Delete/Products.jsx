import { useEffect, useState } from "react"
import "../../styles/deleteProducts.css"
export default function Products() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch("http://13.61.175.118/api/products-data/", { credentials: "include" })
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const deleteProduct = (id, name) => {
        if (confirm("Are you sure you want to delete " + name)) {
            const requestOptions = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ id: id, item: name }),
                credentials: "include"
            }
            fetch("http://13.61.175.118/api/delete-product/", requestOptions)
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
    const rows = data.map((ele) => {
        return (<tr>
            <td>{ele.productName}</td>
            <td>{ele.quantity}</td>
            <td>{ele.sellingPrice}</td>
            <td>
                <button onClick={() => deleteProduct(ele._id, ele.productName)} >Delete</button>
            </td>
        </tr>)
    })

    return (
        <div className="delete-products">
          
            <table border={1}>
                <thead>
                    <th>Product Name</th>
                    <th>Available</th>
                    <th>Price</th>
                    <th>Delete</th>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </div>
    )
}