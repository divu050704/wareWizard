import "../styles/Login.scss"
import { useState } from "react"
import sha256 from "../custom/sha256"
export default function Login() {
    const [data, setData] = useState({ uname: "", passwd: "" })
    const [showPassword, setShowPassword] = useState(false)
    const login = (e) => {
        e.preventDefault()
        const requestOptions = {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify({ ...data, passwd: sha256(data.passwd) }),
            credentials: "include"
        }
        fetch("http://localhost:8080/api/login/", requestOptions)
            .then(res => res.json())
            .then(last => {
                if (last.loggedIn) {
                    window.location.reload()
                }
                else alert("Wrong username or password")
            })
    }
    return (
        <div className="Login">
            <form className="Login--card" onSubmit={login}>
                <label>Username</label><br />
                <input value={data.uname} onChange={(event) => setData(prev => ({ ...prev, uname: event.target.value }))} required={true}></input><br />
                <label>Password</label><br />
                <input value={data.passwd} onChange={(event) => setData(prev => ({ ...prev, passwd: event.target.value }))} required={true} type={!showPassword ? "password" : "text"} ></input><br />
                <input type="checkbox" value={showPassword} onChange={(event) => setShowPassword(event.target.checked)} /><label style={{ fontSize: "1rem" }}>Show password</label><br />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}