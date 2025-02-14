import { useState, useEffect } from "react"
import backendInfo from "../../custom/backend-info.json"

export default function Advance() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(`${backendInfo.url}/api/customer-data`)
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const deleteAdvcance = (id) => {
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({id: id}),
            
        }
        fetch(`${backendInfo.url}/api/delete-advance/`,requestOptions)
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
                <div key={i} className="py-1 border-b border-blue-200 last:border-b-0">
                    {e.productName}
                </div>
            ))
            return (
                <div key={ind} className="grid grid-cols-7 gap-4 items-center p-4 border-b border-gray-200 hover:bg-gray-50">
                    <div className="truncate">{ele.name}</div>
                    <div className="truncate">{ele.phoneNumber}</div>
                    <div className="truncate">
                        {date.getFullYear()}-{date.getMonth() + 1}-{date.getDate()}
                    </div>
                    <div className="max-h-32 overflow-y-auto">
                        {products}
                    </div>
                    <div className="truncate">{ele.total}</div>
                    <div className="truncate">{ele.paid}</div>
                    <div>
                        <button 
                            onClick={() => deleteAdvcance(ele._id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            )
        }
        return null;
    })

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Advance</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 items-center p-4 bg-gray-50 border-b border-gray-200 font-semibold">
                    <div>Name</div>
                    <div>Phone Number</div>
                    <div>Date</div>
                    <div>Products</div>
                    <div>Total</div>
                    <div>Paid</div>
                    <div>Delete</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                    {table}
                </div>

                {/* Empty State */}
                {data.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No advance payments found
                    </div>
                )}
            </div>
        </div>
    )
}