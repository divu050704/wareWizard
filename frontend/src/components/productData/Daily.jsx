import { useEffect, useState } from "react";
import "../../styles/daily.css"
export default function Daily() {
    const [data, setData] = useState([])
    const [date, setDate] = useState("")
    useEffect(() => {
        fetch("http://13.61.175.118/api/customer-data", { credentials: "include" })
            .then(res => res.json())
            .then(res => setData(res.data))
        let dateToday = new Date()
        setDate(dateToday.getFullYear() + "-" + (dateToday.getMonth() + 1 < 10 ? "0" + (dateToday.getMonth() + 1) : dateToday.getMonth() + 1) + "-" + (dateToday.getDate() < 10 ? "0" + dateToday.getDate() : dateToday.getDate()))
    }, [])
    let dateTotal = 0;
    const rows = data.map((ele => {
        let date1 = ele.createdAt
        let localDate = new Date(date1)
        let total = 0;
        let finalDate = localDate.getFullYear() + "-" + (localDate.getMonth() + 1 < 10 ? "0" + (localDate.getMonth() + 1) : localDate.getMonth() + 1) + "-" + (localDate.getDate() < 10 ? "0" + localDate.getDate() : localDate.getDate())
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
        
        if (finalDate === date) {
            dateTotal += total
            return (
                <div className="daily--table-row">
                    <div className="daily--table-row-c1 daily--table-row-data">{ele.name} <br /> {ele.phoneNumber || "NA"} <br />
                    <a href={"http://13.61.175.118/api/reciept?id="+ele._id} target="next">Generate Bill</a></div>
                    <div className="daily--table-row-c2" >

                        <div style={{ display: "flex" }} >
                            <p className="daily--table-row-c2-c1 daily--table-row-heading">Product Name</p>
                            <p className="daily--table-row-c2-others daily--table-row-heading">Sold</p>
                            <p className="daily--table-row-c2-others daily--table-row-heading">Price</p>
                            <p className="daily--table-row-c2-others daily--table-row-heading">Total</p>
                        </div>
                        {products}
                        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center   " }} >
                            <p className="daily--table-row-heading">Total</p>
                            <p className="daily--table-row-data" >{total}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center   " }} >
                            <p className="daily--table-row-heading ">Payment Mode</p>
                            <p className="daily--table-row-data" >{ele.paymentMethod}</p>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center   " }} >
                            <p className="daily--table-row-heading ">Employee</p>
                            <p className="daily--table-row-data" >{ele.employee || "NA"}</p>
                        </div>
                    </div>
                </div>
            )
        }
    }))
    return (
        <div className="Daily">
            <h1>Daily Data</h1>
            <input type="date" vlaue={date} onChange={(event) => { setDate(event.target.value) }} className="daily--input" />
            <div className="daily--table">
                <div className="daily--table-row">
                    <p className="daily--table-row-c1 daily--table-row-heading">Name</p>
                    <p className="daily--table-row-c2 daily--table-row-heading">Products</p>
                </div>
                {rows}

            </div>
            <div className="bottom-data">
                <h3>Daily Total:&nbsp;&nbsp;</h3>
                <h3 style={{color: "white"}}>{dateTotal}</h3>
            </div>
        </div>
    )
}