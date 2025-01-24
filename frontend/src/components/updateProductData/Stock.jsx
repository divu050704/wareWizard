import Multiselect from "multiselect-react-dropdown";
import { useEffect, useState } from "react";
import "../../styles/stock.css"
export default function Stock(){
    const [data, setData] = useState([])
    const [selected, setSelected] = useState([])
    useEffect(() => {
        fetch("http://localhost:8080/api/products-data", {credentials: "include"})
        .then(res => res.json())
        .then(res => setData(res.data))
    },[])
    const selectedData = selected.map((ele) => {
        return(
            <div>
                <div className="stock--selected-data">
                    <div className="stock--selected-data-info">
                        <span>Name: &nbsp;</span>
                        <span>{ele.productName}</span>
                    </div>
                    <div className="stock--selected-data-info">
                        <span>
                            Quantity:&nbsp;
                        </span>
                        <span>
                            {ele.quantity}
                        </span>
                    </div>
                    <div className="stock--selected-data-info">
                        <span>New Stock:&nbsp; </span>
                        <input type="number" value={ele.newQuantity} onChange={(event) => setSelected((prev) => {
                            const newData = []
                            prev.map((e, i) => {

                                if (e.productName === ele.productName) {
                                    newData.push({ ...e, newQuantity: (event.target.value) })
                                }
                                else {
                                    newData.push(e)
                                }

                            })

                            return newData
                        })}/>
                    </div>
                
                </div>
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
        fetch("http://localhost:8080/api/update-stock/", requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.Updated){
                    alert("Updated")
                    window.location.reload()
                }
            })
    }
    return(
        <div className="stock">
            <div className="multi-select-custom">
                <Multiselect
                options={data}
                onSelect={(value,final) => setSelected((prev) => [...prev, {...final, newQuantity: 0}])}
                onRemove={(value) => {
                    setSelected(prev => prev.length === 0 ? [] : value)
                }}
                displayValue="productName"
                groupBy="category"
                style={{ chips: { background: "rgba(142, 187, 255, 0.26)" }, multiselectContainer: { background: "rgba(142, 187, 255, 0.26)" } }}
                
                />
            </div>
            <hr />
            {selectedData}
            <button className="stock--submit" onClick={submit} >Submit</button>
        </div>
    )
}