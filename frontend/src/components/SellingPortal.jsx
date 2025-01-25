import { useEffect, useState } from "react"
import Multiselect from 'multiselect-react-dropdown';
import "../styles/SellingPortal.css"

export default function SellingPortal() {

    const [data, setData] = useState([])
    const [selected, setSelected] = useState([])
    const [customerData, setCustomerData] = useState({ name: "", phoneNumber: "", paid: 0, discounted: false, paymentMethod: "Online", amazon: false, total: 0 })
    const [recieptOpen, setRecieptOpen] = useState(false)
    useEffect(() => {
        if (selected.length !== 0) {
            setCustomerData((prev) => ({ ...prev, total: (selected.reduce((accumulator, object) => { return (accumulator + (Number(object.sellingPrice) * Number(object.sellingQuantity))) }, 0)) }))
        }
    }, [selected])
    useEffect(() => {
        const requestOptions = {
            credentials: "include"
        }
        fetch("http://13.61.175.118/api/products-data", requestOptions)
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const selectedData = selected.map((ele, ind) => {
        return (
            <div key={ind}>
                <div className="selling-portal--selected-data">
                    <div className="selling-portal--selected-data-info">
                        <span >Name:</span>&nbsp;&nbsp;
                        <span >{ele.productName}</span>
                    </div>
                    <div className="selling-portal--selected-data-info">
                        <span>Price: &nbsp;</span>
                        <input value={ele.sellingPrice} type="number" onChange={(event) => setSelected((prev) => {
                            const newData = []
                            prev.map((e, i) => {

                                if (e.productName === ele.productName) {
                                    newData.push({ ...e, sellingPrice: event.target.value })
                                }
                                else {
                                    newData.push(e)
                                }

                            })

                            return newData
                        })} min={0} />
                    </div>
                    <div className="selling-portal--selected-data-info">
                        <span>Available: &nbsp;</span>
                        <span>{ele.quantity}</span>
                    </div>
                    <div className="selling-portal--selected-data-info">
                        <span>Quantity: &nbsp;</span>
                        <input value={ele.sellingQuantity} type="number" onChange={(event) => setSelected((prev) => {
                            const newData = []
                            prev.map((e, i) => {

                                if (e.productName === ele.productName) {
                                    newData.push({ ...e, sellingQuantity: event.target.value })
                                }
                                else {
                                    newData.push(e)
                                }

                            })

                            return newData
                        })} min={0}/>

                    </div>
                    <div className="selling-portal--selected-data-info" >
                        <span>Total:&nbsp;</span>
                        <span>{Number(ele.sellingPrice) * Number(ele.sellingQuantity)}</span>
                    </div>
                </div>
                <hr />
            </div>

        )
    })
    const recieptData = selected.map((ele, ind) => (
        <div key={ind}>
            <div className="selling-portal--selected-data">
                <div className="selling-portal--selected-data-info">
                    <span >Name:</span>&nbsp;&nbsp;
                    <span >{ele.productName}</span>
                </div>
                <div className="selling-portal--selected-data-info">
                    <span>Price: &nbsp;</span>
                    <span>{ele.sellingPrice}</span>
                </div>

                <div className="selling-portal--selected-data-info">
                    <span>Quantity: &nbsp;</span>
                    <span>{ele.sellingQuantity}</span>

                </div>
                <div className="selling-portal--selected-data-info" >
                    <span>Total:&nbsp;</span>
                    <span>{Number(ele.sellingPrice) * Number(ele.sellingQuantity)}</span>
                </div>
                <hr />
            </div>
            
        </div>
    ))
    const Reciept = () => (
        <div>
            <h1>Products</h1>
            {recieptData}
            <h1>Customer Name</h1>
            <p>{customerData.name}</p>
            <h1>Phone Number</h1>
            <p>{customerData.phoneNumber}</p>
            <h1>Discounted</h1>
            <p>{customerData.discounted ? "Yes" : "No"}</p>
            <h1>Total</h1>
            <p>{customerData.total}</p>
            <h1>Paid</h1>
            <p>{customerData.paid}</p>
            <h1>Due</h1>
            <p>{customerData.total - Number(customerData.paid)}</p>
            <button className="selling--portal-cancel" onClick={() => {setRecieptOpen(false)}}>Cancel</button>&emsp;
            <button className="selling--portal-submit" onClick={submit}>Submit</button>
        </div>
    )
    const submit = (e) => {
        e.preventDefault()
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ data: selected, customerData: customerData }),
            credentials: "include"
        }
        fetch("http://13.61.175.118/api/sell/", requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.sold) {
                    alert("Data Sold")
                    window.location.reload()
                }
                else {
                    alert("An error Occured: " + res.error)
                }
            })
    }
    return (
        <div className="selling-portal">
            {recieptOpen ?
                <Reciept />
                : <div>
                    <h1>Product Name</h1>
                    <div className="multi-select-custom">
                        <Multiselect
                            options={data}
                            onSelect={(value, final) => setSelected((prev) => [...prev, { ...final, sellingQuantity: 1 }])}
                            onRemove={(value) => {
                                setSelected(prev => prev.length === 0 ? [] : value)
                            }}
                            displayValue="productName"
                            groupBy="category"
                            style={{ chips: { background: "rgba(142, 187, 255, 0.26)" }, multiselectContainer: { background: "rgba(142, 187, 255, 0.26)" } }}
                        />
                    </div>
                    <h1>Details</h1>
                    <hr />
                    {selectedData}
                    <form onSubmit={() => setRecieptOpen(true)}>
                        <h1>Total</h1>
                        <p>{customerData.total}</p>
                        <h1>
                            Customer Name
                        </h1>
                        <input value={customerData.name} onChange={(event) => setCustomerData((prev) => ({ ...prev, name: event.target.value }))} required={true} />
                        <h1>Phone Number</h1>
                        <input type="number" maxLength={10} value={customerData.phoneNumber} onChange={(event) => setCustomerData((prev) => ({ ...prev, phoneNumber: event.target.value }))} required={true} />
                        <h1>Mode of Payment</h1>
                        <select value={customerData.paymentMethod} onChange={(event) => setCustomerData((prev) => ({ ...prev, paymentMethod: event.target.value }))}>
                            <option value="Online" defaultValue="Online">Online</option>
                            <option value="Offline">Offline</option>
                            <option value="Advanced-Online">Advanced-Online</option>
                            <option value="Advanced-Offline">Advanced-Offline</option>
                            <option value="Due">Due</option>
                        </select>
                        <h1>Paid</h1>
                        <input type="number" value={customerData.paid} onChange={(event) => setCustomerData((prev) => ({ ...prev, paid: event.target.value }))} /><br /><br />
                        <input id="amazon" type="checkbox" value={customerData.amazon} onChange={(event) => setCustomerData((prev) => ({ ...prev, amazon: event.target.checked }))} />&nbsp;
                        <label htmlFor="amazon" >
                            Amazon
                        </label><br />
                        <input type="checkbox" id="discount" value={customerData.discounted} onChange={(event) => setCustomerData((prev) => ({ ...prev, discounted: event.target.checked }))} />&nbsp;
                        <label htmlFor="discount">Discounted</label>
                        <br />
                        <br />
                        <br />
                        <input type="submit" className="submit--button" ></input>
                    </form>
                </div>}
        </div>
    )
}