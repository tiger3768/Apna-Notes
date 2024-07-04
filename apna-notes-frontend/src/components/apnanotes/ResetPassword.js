import { useEffect, useState } from "react";
import { useAuth } from "./security/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const authContext = useAuth();
    const isAuthenticated = authContext.isAuthenticated

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

    function handleConfirmPasswordChange(event) {
        setConfirmPassword(event.target.value);
    }

    function handleVerificationCodeChange(event) {
        setVerificationCode(event.target.value);
    }

    async function handleSendCode() {
        const response = await authContext.sendVerificationCode(username);
        if (response.error === undefined) {
            setSuccessMessage('Verification code sent successfully.');
            setShowSuccessMessage(true);
        } else {
            setErrorMessage(response.error);
            setShowErrorMessage(true);
        }
    }

    async function handleSubmit() {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            setShowErrorMessage(true);
            return;
        }

        const response = await authContext.resetUserPassword(username, password, verificationCode);
        if (response.error === undefined) {
            if(!isAuthenticated) navigate(`/login`)
            else navigate(`/profile/${username}`)
        } else {
            setErrorMessage(response.error);
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="reset-password">
            <h1>Reset Password</h1>
            {showErrorMessage && <div className="errorMessage">{errorMessage}</div>}
            {showSuccessMessage && <div className="successMessage">{successMessage}</div>}
            <div className="resetPasswordForm">
                {!isAuthenticated && (<div>
                    <label>Username</label>
                    <input type="text" name="username" value={username} onChange={handleUsernameChange} />
                </div>)}
                <div>
                    <label>New Password</label>
                    <input type="password" name="password" value={password} onChange={handlePasswordChange} />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                </div>
                {!isAuthenticated && (
                    <>
                        <div>
                            <label>Verification Code</label>
                            <input type="text" name="verificationCode" value={verificationCode} onChange={handleVerificationCodeChange} />
                        </div>
                        <div>
                            <button type="button" name="sendCode" onClick={handleSendCode}>Send Verification Code</button>
                        </div>
                    </>
                )}
                <div>
                    <button type="button" name="resetPassword" onClick={handleSubmit}>Reset Password</button>
                </div>
            </div>
        </div>
    );
}
