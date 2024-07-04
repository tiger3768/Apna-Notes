import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const authContext = useAuth();

    function handleUsernameChange(event) {
        setUsername(event.target.value);
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
    }

    async function handleSubmit() {
        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match");
            setShowErrorMessage(true);
            return;
        }

        const response = await authContext.register(email, username, password, setErrorMessage);
        if (response.error === undefined) {
            navigate(`/login`, { state: { username } });
        } else {
            setErrorMessage(response.error);
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="register">
            <h1>Register</h1>
            {showErrorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="registerForm">
                <div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </div>
                <div>
                    <button type="button" name="register" onClick={handleSubmit}>Register</button>
                </div>
            </div>
        </div>
    );
}


