import { useState } from "react"
import "../styles/newProducts.scss"
export default function NewProduct() {
    const [category, setCategory] = useState("Book")
    const [subCategory, setSubCategory] = useState("10-years")
    const [data, setData] = useState([{ productName: "", costPrice: "", sellingPrice: "", quantity: "" }])

    const submit = () => {
        if (data.every(x => x.productName !== "" && x.costPrice !== "" && x.sellingPrice !== "" && x.quantity !== "")) {
            const requestOptions = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ data: data, category: category, subCategory: subCategory }),
                credentials: "include"
            }
            fetch("http://localhost:8080/api/new-product/", requestOptions)
                .then(res => res.status === 302 ? alert("Unauthorized Access") : res.json())
                .then(last => {
                    if (last.saved){
                        alert("Data uploaded!")
                        window.location.reload()
                    }
                    else{
                        alert(last.unsaved + " already exists")
                    }
                })
        }
        else {
            alert("All fields are required!")
        }

    }
    const addNew = () => {
        setData(prev => [...prev, { productName: "", costPrice: "", sellingPrice: "", quantity: "" }])
    }
    const delData = (index) => {
        setData((prev) => {
            const newData = []
            prev.map((ele, i) => {
                if (index !== i) {
                    newData.push(ele)
                }
            })
            return (newData)
        })
    }
    const handleDataChange = (value, type, index) => {
        setData(prev => {
            const newState = prev.map((ele, i) => {
                if (index === i) {
                    return { ...ele, [type]: value }
                }
                return ele
            })
            return newState
        })
    }

    const main = data.map((ele, index) => {
        return (
            <div className="new-product--main">
                <h2>{index + 1 + "."}</h2>
                <h2>Product name</h2>
                <input value={ele.productName} onChange={(event) => handleDataChange(event.target.value, "productName", index)} />
                <h2>Cost Price</h2>
                <input value={ele.costPrice} onChange={(event) => handleDataChange(event.target.value, "costPrice", index)} />
                <h2>Selling Price</h2>
                <input value={ele.sellingPrice} onChange={(event) => handleDataChange(event.target.value, "sellingPrice", index)} />
                <h2>Quantity</h2>
                <input value={ele.quantity} onChange={(event) => handleDataChange(event.target.value, "quantity", index)} /><br />
                <br />
                <button onClick={() => delData(index)} className="delete">Delete</button>
                <hr />
            </div>
        )
    })
    return (

        <div className="new-product">
            <h2>Category</h2>
            <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="Book">Book</option>
                <option value="Notebook">Notebook</option>
                <option value="Sheets">Sheets</option>
                <option value="Files">Files</option>
                <option value="others">Others</option>
            </select>
            {category === "Book" && 
                <div>
                    <h2>Sub-Category</h2>
                    <select value={subCategory} onChange={(event) => setSubCategory(event.target.value)}>
                        <option value="10-years">10-years</option>
                        <option value="Guide">Guide</option>
                        <option value="Novels">Novels</option>
                    </select>
                </div>
            }
            {category === "Notebook" &&
                <div>
                    <h2>Sub-Category</h2>
                    <select value={subCategory} onChange={(event) => setSubCategory(event.target.value)}>
                        <option value="Practical">Practical</option>
                        <option value="Spiral">Spiral</option>
                        <option value="others">Others</option>
                    </select>
                </div>
            }
            {main}
            <button onClick={addNew} className="add">Add+</button><br /><br />
            <button className="submit--button" onClick={submit}>Submit</button>
        </div>
    )
}