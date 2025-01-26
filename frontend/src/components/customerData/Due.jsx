import { useEffect, useState } from "react"
import "../../styles/Due.css"
import backendInfo from "../../custom/backend-info.json"
export default function Due() {
    const [data, setData] = useState([])
    useEffect(() => {
        fetch(`${backendInfo.url}/api/customer-data`)
            .then(res => res.json())
            .then(res => setData(res.data))
    }, [])
    const fetchData = () => {
        fetch(`${backendInfo.url}/api/customer-data`)
            .then(res => res.json())
            .then(res => setData(res.data))
    }
    const deleteDue = (id) => {
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({id: id}),
            
        }
        fetch(`${backendInfo.url}/api/delete-due/`,requestOptions)
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
    const table = data.map((ele, index) => {
        
        var date = new Date(ele.createdAt)
        if(ele.due)
        return (
            <tr>
                <td >{ele.name}</td>
                <td >{ele.phoneNumber}</td>
                <td >{date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()}</td>
                <td ><button onClick={() => {deleteDue(ele._id)}}>Delete</button></td>
               
            </tr>
        )
    })
    return (
        <div className="due">
            <h1>Dues</h1>
            <table border={1}>
                <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Date</th>
                    <th>Delete</th>

                </tr>
                {table}
            </table>
        </div>
    )
}