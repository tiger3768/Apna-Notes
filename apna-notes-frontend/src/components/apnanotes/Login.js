import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const authContext = useAuth();
    const location = useLocation();
    
    useEffect(() => {
        if (location.state && location.state.username) {
            setUsername(location.state.username);
        }
    }, [location.state]);

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    async function handleSubmit() {
        const response = await authContext.login(username, password);
        if (response.error === undefined) {
            navigate(`/home`);
        } else if (response.error === "Verification Needed") {
            navigate(`/verify`, { state: { username } });
        }
        else {
            setErrorMessage(response.error);
            setShowErrorMessage(true);
        }
    }

    function handleForgotPassword() {
        navigate(`/resetPassword`, { state: { username } })
    }

    return (
        <div className="login">
            <h1>Login</h1>
            {showErrorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="loginForm">
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    <button type="button" name="login" onClick={handleSubmit}>Login</button>
                </div>
                <div>
                    <button type="button" name="forgotPassword" onClick={handleForgotPassword}>Forgot Password</button>
                </div>
            </div>
        </div>
    );
}