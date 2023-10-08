import React, { useEffect, useState } from 'react';
import { fetchUsersWithLikes } from './api/ApiService'; 
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const navigate = useNavigate()

  useEffect(() => { 
    fetchUsersWithLikes()
      .then((response) => {
        const usersWithLikes = response.data;
        setLeaderboardData(usersWithLikes);
      })
      .catch((error) => {
        console.error('Error fetching leaderboard data:', error);
      });
  }, []);

  return (
    <div className="leaderboard-container">
      <h1>Leaderboard</h1>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Total Likes</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((userData, index) => (
            <tr key={userData.user} className={index < 3 ? "top-three" : ""}>
              <td>{index + 1}</td>
              <td><button type="button" className={"nomakeup"} onClick={() => navigate(`/profile/${userData.user}`)} alt="author">{userData.user}</button></td>
              <td>{userData.likes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
