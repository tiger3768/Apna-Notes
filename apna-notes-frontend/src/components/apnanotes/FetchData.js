import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { dislike, fetchLikes, like, removePost, retrievePostsForUsername, searchForNotes, searchForNotesFromUser, getTopics } from './api/ApiService';
import { useAuth } from './security/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, deleteObject, ref } from 'firebase/storage';
import { fileDB } from './api/FirebaseConfig';

function FetchData(props) {
  const { userSpecific, username } = props;
  const PAGE_SIZE = 4;
  const [searchText, setSearchText] = useState('');
  const [listOfNotes, setListOfNotes] = useState([]);
  const [originalListOfNotes, setOriginalListOfNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const authContext = useAuth();
  const currentusername = authContext.username;
  const [isUpvotedList, setIsUpvotedList] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopics();
    fetchData();
  }, []);

  const fetchTopics = async () => {
    try {
      const response = await getTopics();
      setTopics(response.data.map(topic => ({ value: topic.id, label: topic.name })));
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleTopicChange = (selectedOptions) => {
    setSelectedTopics(selectedOptions);
    applyFilters(searchText, selectedOptions);
  };

  const upvote = async (index, id) => {
    try {
      if (!isUpvotedList[index]) {
        await like(id, currentusername).then((response) => {
          setIsUpvotedList(prevState => {
            const newState = [...prevState];
            newState[index] = true;
            return newState;
          });
          if (response.data !== 409) {
            setListOfNotes(prevState => {
              const newState = [...prevState];
              newState[index] = { ...newState[index], likes: newState[index].likes + 1 };
              return newState;
            });
          }
        }).catch(e => console.log(e));
      } else {
        await dislike(id, currentusername).then(() => {
          setIsUpvotedList(prevState => {
            const newState = [...prevState];
            newState[index] = false;
            return newState;
          });
          setListOfNotes(prevState => {
            const newState = [...prevState];
            newState[index] = { ...newState[index], likes: newState[index].likes - 1 };
            return newState;
          });
        }).catch(e => console.log(e));
      }
    } catch (error) {
      alert("Some error occurred");
    }
  };

  const sFN = username !== undefined ? searchForNotesFromUser : searchForNotes;

  const fetchData = async (page = 1) => {
    try {
      if (searchText === '' && username === undefined) return;

      const response = searchText === ''
        ? await retrievePostsForUsername(username)
        : await sFN(searchText, username);

      const postsData = response.data;
      if (postsData.length === 0) return;
      const fetchLikesPromises = postsData.map(post => fetchLikes(post.id));

      const likesData = await Promise.all(fetchLikesPromises);

      const postsWithLikes = postsData.map((post, index) => ({
        ...post,
        likes: likesData[index].likesCount
      }));

      setListOfNotes(postsWithLikes);
      setOriginalListOfNotes(postsWithLikes); 
      setIsUpvotedList(new Array(postsWithLikes.length).fill(false));
      setCurrentPage(page);
      
      applyFilters(searchText, selectedTopics, postsWithLikes);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const applyFilters = (searchText, selectedTopics, notes = originalListOfNotes) => { 
    let filteredNotes = notes;

    if (searchText) {
      filteredNotes = filteredNotes.filter(note =>
        note.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (selectedTopics && selectedTopics.length > 0) {
      filteredNotes = filteredNotes.filter(note =>
        note.topic && note.topic.some(topic =>
          selectedTopics.some(selectedTopic => selectedTopic.label === topic.name)
        )
      );
    }

    setListOfNotes(filteredNotes);
  };

  const handleSearch = () => {
    fetchData(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDownload = async (url, fileName) => {
    try {
      const storageRef = ref(fileDB, url);
      const fileUrl = await getDownloadURL(storageRef);

      const anchor = document.createElement('a');
      anchor.href = fileUrl;
      anchor.target = '_blank';
      anchor.download = fileName;

      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
    } catch (error) {
      console.error('Error getting file:', error);
      alert('Error getting file. Please try again.');
    }
  };

  const handleDeleteFile = async (path, postId) => {
    try {
      const storageRef = ref(fileDB, path);
      await removePost(username, postId);
      await deleteObject(storageRef);

      alert('File removed successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file. Please try again.');
    }
  };

  const totalPages = Math.ceil(listOfNotes.length / PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, listOfNotes.length);

  return (
    <div className="grid">
      {username && <h1>{username}'s Notes</h1>}
      <form className="searchbar">
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}></input>
        <button type="button" onClick={handleSearch}><img src={require('./images/search.png')} alt="Search" /></button>
      </form>
      <div>
        <h3>Select Topics</h3>
        <Select
          isMulti
          options={topics}
          value={selectedTopics}
          onChange={handleTopicChange}
          placeholder="Search and select topics..."
        />
      </div>
      <div>
        <h3>Selected Topics</h3>
        {selectedTopics.map(topic => (
          <span key={topic.value} className="selected-topic">{topic.label}</span>
        ))}
      </div>
      <table>
        <thead>
          {listOfNotes.length > 0 && <tr>
            <th>Name</th>
            <th>Likes</th>
            {!userSpecific && <th>Upvote</th>}
            <th>Download</th>
            {userSpecific && <th>Delete</th>}
            {!username && <th>UploadedBy</th>}
          </tr>}
        </thead>
        <tbody>
          {listOfNotes.slice(startIndex, endIndex).map((file, index) => (
            <tr className={"listed"} key={file.id}>
              <td>{file.name}</td>
              <td>{file.likes}</td>
              {!userSpecific && <td><button type="button" onClick={() => upvote(index, file.id)} className={isUpvotedList[index] ? 'glow' : ''}><img className="vote" src={require('./images/upvote.png')} alt="upvote"/></button></td>}
              <td><button type="button" onClick={() => handleDownload(file.path, file.name)}><img className="vote" src={require('./images/downloadbutton.png')} alt="download"/></button></td>
              {userSpecific && <td><button type="button" onClick={() => handleDeleteFile(file.path, file.id)} className="btn btn-danger" alt="delete">Delete</button></td>}
              {!username && <td><button type="button" onClick={() => navigate(`/profile/${file.user}`)} alt="author">{file.user}</button></td>}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={currentPage === page ? 'btn btn-success' : 'btn btn-light'}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FetchData;
