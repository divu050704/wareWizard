import "../styles/newDistributor.css"
import React from "react"
import backendInfo from "../custom/backend-info.json"

export default function NewDistributor(){
    const [name, setName] = React.useState("")
    const [phoneNumber, setPhoneNumber] = React.useState("")
    return (
        <div className="new-distributor">
            <h1>Add New Distributor</h1>
            <h2>Name</h2>
            <input value={name} onChange={(event) => setName(event.target.value)} /><br />
            <h2>Phone Number</h2>
            <input value={phoneNumber} onChange={(event) => setPhoneNumber(event.target.value)} /><br />
            <button className="submit--button" onClick={() => {
                if (name.length !==0 && phoneNumber.length !== 0){
                    const requestOptions = {
                        headers: { "Content-Type": "application/json" },
                        method: "POST",
                        body: JSON.stringify({ name: name, phoneNumber: phoneNumber }),
                        credentials: "include"
                    }
                    fetch(`${backendInfo.url}/api/new-distributor/`, requestOptions)
                        .then(res => res.status === 302 ? alert("Unauthorized Access") : res.json())
                        .then(last => {
                            if (last.added){
                                alert("Data uploaded!")
                                window.location.reload()
                            }
                            else{
                                alert(last.unsaved + " already exists")
                            }
                        })
                } 
            }} >Submit</button>
        </div>
    )
}