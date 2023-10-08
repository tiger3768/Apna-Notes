import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Login(){
    const [username, setUsername] = useState('')
    function handleUsernameChange(event){
        setUsername(event.target.value);
    }
    const [password, setPassword] = useState('')
    function handlePasswordChange(event){
        setPassword(event.target.value);
    }
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const navigate = useNavigate()
    const authContext = useAuth()
    async function handleSubmit(){
        if(await authContext.login(username, password)){
            navigate(`/home`)
        }
        else{
            setShowErrorMessage(true);
        }
    }
    return( 
        <div className="login">
            <h1>Login</h1>
            {showErrorMessage && <div className="errorMessage">Authentication Failed!</div>}
            <div className="loginForm">
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange}/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange}/>
                </div>
                <div >
                    <button type="button" name="login" onClick={handleSubmit}>Login</button>
                </div>
            </div>
        </div>
    );
}