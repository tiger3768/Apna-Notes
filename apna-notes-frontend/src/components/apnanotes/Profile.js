import React, { useEffect, useState } from 'react'
import { getUserData, uploadPostsForUsername } from './api/ApiService';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from './security/AuthContext';
import { fileDB } from './api/FirebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';

function Profile() {

    const { username } = useParams();
    const authContext = useAuth()
    const currentusername = authContext.username

    const [userData, setUserData] = useState(null)
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate()
    
    useEffect(() => {
        async function fetchUserData() {
          try {
            const response = await getUserData(username);
            setUserData(response.data);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
    
        fetchUserData();
      }, [username]);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
            try { 
                const fileName = selectedFile.name;
                const storageRef = ref(fileDB, `${username}/${fileName}`);
                uploadPostsForUsername(username, fileName, storageRef.fullPath)
                    .then(response => {
                        if (response.status === 201) {
                              uploadBytes(storageRef, selectedFile)
                                .then(() => alert('File uploaded successfully!')) 
                                .catch(e => alert("File upload failed"));
                        }
                    })
                    .catch(e => alert('File upload failed'))
            } catch (error) {
                alert('Error uploading file. Please try again.');
            }
        };  
        
    }

    const viewNotes = () => {
        navigate(`/${username}/notes`);
    };

    return (
        <div className="profile-container">
          {userData && (
            <div className="profile-details">
              <p className="profile-username">{userData.username}</p>
              {currentusername === username && (
                <div className="profile-upload">
                  <label className="profile-upload-label">Upload new notes</label>
                  <input type="file" className="profile-upload-label" onChange={handleFileChange} />
                  <button className="profile-upload-button" onClick={handleUpload}>Upload</button>
                </div>
              )}
              <div className="profile-view">
                <label className="profile-view-label">View notes</label>
                <button className="profile-view-button" onClick={viewNotes}>View</button>
              </div>
            </div>
          )}
        </div>
      );    
    }

export default Profile;
