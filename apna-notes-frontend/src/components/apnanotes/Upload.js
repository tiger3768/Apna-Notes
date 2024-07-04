import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { getTopics, uploadPostsForUsername } from './api/ApiService';
import { fileDB } from './api/FirebaseConfig';
import { ref, uploadBytes } from 'firebase/storage';
import { useAuth } from './security/AuthContext';

export default function Upload() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [topics, setTopics] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const authContext = useAuth();
    const username = authContext.username;

    useEffect(() => {
        fetchTopics();
    }, []);

    const fetchTopics = async () => {
        try {
            const response = await getTopics();
            setTopics(response.data.map(topic => ({ value: topic.id, label: topic.name })));
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleTopicChange = (selectedOptions) => {
        if (selectedOptions.length <= 5) {
            setSelectedTopics(selectedOptions);
        } else {
            alert('You can select up to 5 topics.');
        }
    };

    const isValidFileType = (file) => {
        const acceptedFileTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        return acceptedFileTypes.includes(file.type);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        if (selectedTopics.length === 0) {
            alert('Please select at least one topic.');
            return;
        }

        if (!isValidFileType(selectedFile)) {
            alert('Invalid file type. Only PDF, DOC, and DOCX are allowed.');
            return;
        }

        if (selectedFile.size > 10 * 1024 * 1024) {
            alert('File size exceeds the 10MB limit.');
            return;
        }

        try {
            const fileName = selectedFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
            const storageRef = ref(fileDB, `${username}/${fileName}`);
            const response = await uploadPostsForUsername(username, fileName, storageRef.fullPath, selectedTopics.map(topic => topic.value));

            if (response.status === 201) {
                await uploadBytes(storageRef, selectedFile);
                alert('File uploaded successfully!');
            }
        } catch (error) {
            alert('File upload failed');
            console.error('Error uploading file:', error);
        }
    };

    return (
        <div className="profile-container">
            <h1>Upload</h1>
            <div className="profile-upload">
                <label>Upload new notes</label>
                <input type="file" onChange={handleFileChange} />
                <label>Select Topics (up to 5):</label>
                <Select
                    isMulti
                    options={topics}
                    value={selectedTopics}
                    onChange={handleTopicChange}
                    placeholder="Search and select topics..."
                />
                <div>
                    <h3>Selected Topics</h3>
                    {selectedTopics.map(topic => (
                        <span key={topic.value} className="selected-topic">{topic.label}</span>
                    ))}
                </div>
                <button onClick={handleUpload}>Upload</button>
            </div>
        </div>
    );
}
