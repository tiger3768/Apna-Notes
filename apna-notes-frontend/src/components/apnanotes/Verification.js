import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./security/AuthContext";

export default function Verification() {
    const location = useLocation();
    const { username } = location.state || {};
    const [verificationCode, setVerificationCode] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const authContext = useAuth();

    useEffect(() => {
        if (!username) {
            navigate('/login');
        }
    }, [username, navigate]);

    function handleVerificationCodeChange(event) {
        setVerificationCode(event.target.value);
    }

    async function handleSubmit() {
        const response = await authContext.verify(username, verificationCode);
        if (response.error === undefined) {
            navigate(`/login`, { state: { username } });
        } else {
            setErrorMessage(response.error);
            setShowErrorMessage(true);
        }
    }

    async function handleResendVerificationCode() {
        try {
            const response = await authContext.sendVerificationCode(username);
            if(response.error === undefined){
                setErrorMessage('Verification code resent successfully.');
            }
            else{
                setErrorMessage(response.error);
                setShowErrorMessage(true);
            }
        } catch (error) {
            setErrorMessage('Error resending verification code.');
            setShowErrorMessage(true);
        }
    }

    return (
        <div className="verification">
            <h1>Verify Your Account</h1>
            {showErrorMessage && <div className="errorMessage">{errorMessage}</div>}
            <div className="verificationForm">
                <div>
                    <label>Verification Code</label>
                    <input type="text" name="verificationCode" value={verificationCode} onChange={handleVerificationCodeChange} />
                </div>
                <div>
                    <button type="button" name="verify" onClick={handleSubmit}>Verify</button>
                </div>
                <div>
                    <button type="button" name="resend" onClick={handleResendVerificationCode}>Resend Verification Code</button>
                </div>
            </div>
        </div>
    );
}
