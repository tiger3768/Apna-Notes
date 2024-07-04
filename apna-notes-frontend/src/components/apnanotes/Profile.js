import React, { useEffect, useState } from 'react';
import { getUserData, updateProfileData, getOrganisations } from './api/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './security/AuthContext';

function Profile() {
    const { username } = useParams();
    const authContext = useAuth();
    const currentUsername = authContext.username;
    const [userData, setUserData] = useState(null);
    const [editing, setEditing] = useState(false);
    const [organizationType, setOrganizationType] = useState('');
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getUserData(username);
                setUserData(response.data);
                if (response.data.organisation) {
                    setOrganizationType(response.data.organisation.organisationType);
                    setSelectedOrganization(response.data.organisation);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        }

        fetchUserData();
    }, [username]);

    const handleEditProfile = () => {
        setEditing(true);
    };

    const handleSaveProfile = async () => {
        try {
            await updateProfileData(username, userData.firstname, userData.lastname, organizationType, selectedOrganization);
            setEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            alert('Error updating profile. Please try again.');
        }
    };

    const handleOrganizationTypeChange = async (e) => {
        const type = e.target.value;
        setOrganizationType(type);
        try {
            const response = await getOrganisations(type);
            console.log(response);
            setOrganizations(response.data);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const viewNotes = () => {
        navigate(`/${username}/notes`);
    };

    const resetPassword = () => {
        navigate(`/resetPassword`, { state: { username } });
    };

    return (
        <div className="profile-container">
            {userData && (
                <div className="profile-details">
                    <p className="profile-username">{userData.username}</p>
                    {editing ? (
                        <div className="profile-edit">
                            <label>First Name:</label>
                            <input type="text" value={userData.firstname} onChange={(e) => setUserData({ ...userData, firstname: e.target.value })} />
                            <label>Last Name:</label>
                            <input type="text" value={userData.lastname} onChange={(e) => setUserData({ ...userData, lastname: e.target.value })} />
                            <label>Organization Type:</label>
                            <select value={organizationType} onChange={handleOrganizationTypeChange}>
                                <option value="">Select Type</option>
                                <option value="SCHOOL">SCHOOL</option>
                                <option value="UNIVERSITY">UNIVERSITY</option>
                                <option value="COMPANY">COMPANY</option>
                            </select>
                            <label>Organization:</label>
                            <select value={selectedOrganization?.name || ''} onChange={(e) => {
                                const org = organizations.find(org => org.name === e.target.value);
                                setSelectedOrganization(org);
                            }}>
                                <option value="">Select Organization</option>
                                {Array.isArray(organizations) && organizations.length > 0 && organizations.map((org) => (
                                    <option key={org.id} value={org.name}>{org.name}</option>
                                ))}
                            </select>
                            <button onClick={handleSaveProfile}>Save</button>
                        </div>
                    ) : (
                        <div className="profile-info">
                            {userData.firstname && <p><strong>First Name:</strong> {userData.firstname}</p>}
                            {userData.lastname && <p><strong>Last Name:</strong> {userData.lastname}</p>}
                            {userData.organisation && <p><strong>Organization Type:</strong> {userData.organisation?.organisationType || 'N/A'}</p>}
                            {userData.organisation && <p><strong>Organization:</strong> {userData.organisation?.name || 'N/A'}</p>}
                            {currentUsername === username && (
                                <button onClick={handleEditProfile}>Edit Profile</button>
                            )}
                        </div>
                    )}
                    <div className="profile-view">
                        <button onClick={viewNotes}>View Notes</button>
                    </div>
                    <div className="profile-view">
                        <button onClick={resetPassword}>Reset Password</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
