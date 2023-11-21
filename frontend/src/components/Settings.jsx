import { useState } from "react"
import sha256 from "../custom/sha256"
import "../styles/Settings.scss"

export default function Settings() {
    const [creds, setCreds] = useState({ currentPassword: '', newPassword: "", confirmNewPassword: "" })
    const [newUser, setNewUser] = useState({ user: '', passwd: "", confirmPasswd: "", admin: false })
    const changePasswords = (e) => {
        e.preventDefault()
        if (creds.newPassword === creds.confirmNewPassword) {
            const requestOptions = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ passwd: sha256(creds.currentPassword), newPasswd: sha256(creds.newPassword) }),
                credentials: "include"
            }
            fetch("http://localhost:8080/api/change-password", requestOptions)
                .then(res => res.json())
                .then(res => {
                    if (res.Updated) {
                        alert("Password Changed, you will be logged out now!")
                        fetch("http://localhost:8080/api/logout/", { credentials: "include" })
                        window.location.reload()
                    }
                    else {
                        alert("An error occured")
                    }
                })
        }
        else {
            alert("Passwords don't match")
        }
    }
    const addUser = (e) => {
        e.preventDefault()

        if (newUser.confirmPasswd === newUser.passwd) {
            const requestOptions = {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ passwd: sha256(newUser.passwd.trim()), user: newUser.user.trim(), admin: newUser.admin }),
                credentials: "include"
            }
            fetch("http://localhost:8080/api/new-user", requestOptions)
                .then(res => res.json())
                .then(res => {
                    if (res.added) {
                        alert("New user added")
                        window.location.reload()
                    }
                    else {
                        alert("An error occured")
                    }
                })
        }
        else {
            alert("Passwords don't match")
        }
    }
    return (
        <div className="Settings" >
            <h1 >Settings</h1>
            <h2>Change Password</h2>
            <form onSubmit={changePasswords}>
                <label htmlFor="currentPassword">Current Password</label><br />
                <input type="text" id="currentPassword" value={creds.currentPassword} onChange={(event) => setCreds((prev) => ({ ...prev, currentPassword: event.target.value }))} required={true} /><br />
                <label htmlFor="newPassword">New Password</label><br />
                <input type="text" id="newPassword" value={creds.newPassword} onChange={(event) => setCreds((prev) => ({ ...prev, newPassword: event.target.value }))} required={true} /><br />
                <label htmlFor="confirmNewPassword">Confirm New Password</label><br />
                <input type="text" id="confirmNewPassword" value={creds.confirmNewPassword} onChange={(event) => setCreds((prev) => ({ ...prev, confirmNewPassword: event.target.value }))} required={true} /><br />

                <input type="submit" className="settings--submit-button" />
            </form>
            <h2>Add new User</h2>
            <form onSubmit={addUser}>
                <label htmlFor="username" >Username</label><br />
                <input type="text" id="username" value={newUser.user} onChange={(event) => setNewUser((prev) => ({ ...prev, user: event.target.value }))} required={true} /><br />
                <input type="checkbox" id="accessLevel" value={newUser.admin} onChange={(event) => setNewUser((prev) => ({ ...prev, admin: event.target.checked }))} />&emsp;
                <label htmlFor="accessLevel" >Admin</label><br />

                <label htmlFor="passwd" >Password</label><br />
                <input type="text" id="passwd" value={newUser.passwd} onChange={(event) => setNewUser((prev) => ({ ...prev, passwd: event.target.value }))} required={true} /><br />
                <label htmlFor="confirmPasswd">Confirm Password</label><br />
                <input type="text" id="confirmPasswd" value={newUser.confirmPasswd} onChange={(event) => setNewUser((prev) => ({ ...prev, confirmPasswd: event.target.value }))} required={true} /><br />
                <input type="submit" className="settings--submit-button" />
            </form>
        </div>
    )
}