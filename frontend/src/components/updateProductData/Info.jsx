import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import "../../styles/info.css"

export default function Info() {
    const [data, setData] = useState([])
    const [selected, setSelected] = useState([])
    useEffect(() => {
        fetch("http://13.61.175.118/api/products-data", { credentials: "include" })
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const selectedData = selected.map((ele) => {
        return (
            <div className="info--selected-data">
                <p>Name:</p>
                <input type="text" value={ele.productName} onChange={(event) => setSelected((prev) => {
                    const newData = []
                    prev.map((e, i) => {

                        if (e._id === ele._id) {
                            newData.push({ ...e, productName: (event.target.value) })
                        }
                        else {
                            newData.push(e)
                        }

                    })

                    return newData
                })} />
                <p>Selling Price</p>
                <input type="text" value={ele.sellingPrice} onChange={(event) => setSelected((prev) => {
                    const newData = []
                    prev.map((e, i) => {

                        if (e._id === ele._id) {
                            newData.push({ ...e, sellingPrice: (event.target.value) })
                        }
                        else {
                            newData.push(e)
                        }

                    })

                    return newData
                })} />
                <p>Cost Price</p>
                <input value={ele.costPrice} onChange={(event) => setSelected((prev) => {
                    const newData = []
                    prev.map((e, i) => {

                        if (e._id === ele._id) {
                            newData.push({ ...e, costPrice: (event.target.value) })
                        }
                        else {
                            newData.push(e)
                        }

                    })

                    return newData
                })} />
                <hr />
            </div>
        )
    })
    const submit = () => {
        
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ data: selected }),
            credentials: "include"
        }
        fetch("http://13.61.175.118/api/update-info/", requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.Updated){
                    alert("Updated")
                    window.location.reload()
                }
            })
    }
    return (
        <div className="info">
            <div className="multi-select-custom">
                <Multiselect
                    options={data}
                    onSelect={(value, final) => setSelected((prev) => [...prev, { ...final}])}
                    onRemove={(value) => {
                        setSelected(prev => prev.length === 0 ? [] : value)
                    }}
                    displayValue="productName"
                    groupBy="category"
                    style={{ chips: { background: "rgba(142, 187, 255, 0.26)" }, multiselectContainer: { background: "rgba(142, 187, 255, 0.26)" } }}
                />
            </div>
            {selectedData}
            <button className="info--submit" onClick={submit} >Submit</button>
        </div>
    )
}