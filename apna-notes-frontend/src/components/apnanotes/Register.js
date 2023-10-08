import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Register(){
    const [username, setUsername] = useState('')
    function handleUsernameChange(event){
        setUsername(event.target.value);
    }
    const [password, setPassword] = useState('')
    function handlePasswordChange(event){
        setPassword(event.target.value);
    }
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()
    const authContext = useAuth()
    async function handleSubmit(){
        const response = await authContext.register(username, password, setErrorMessage)
        if(response.error === null){
            navigate(`/login`)
        }
        else{
            setErrorMessage(response.error);
            setShowErrorMessage(true);
        }
    }
    return(
        <div className="register">
            <h1>Register</h1>
            {showErrorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="registerForm">
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange}/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange}/>
                </div>
                <div>
                    <button type="button" name="register" onClick={handleSubmit}>Register</button>
                </div>
            </div>
        </div>
    );
}