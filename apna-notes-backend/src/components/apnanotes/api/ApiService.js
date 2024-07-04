import axios from "axios";

export const apiClient = axios.create(
    {
        baseURL:'http://localhost:8080'
    }
)

export const getRegistered = (username, password) => (apiClient.post(`/register`, {username, password}));

export const getAuthenticated = (username, password) => (apiClient.post(`/login`, {username, password}));

export const getUserData = (username) => (apiClient.get(`/users/${username}`));

export const retrievePostsForUsername = (username) => (apiClient.get(`users/${username}/posts`));

export const uploadPostsForUsername = (username, name, path) => (apiClient.post(`users/${username}/posts`, { name, path }));

export const searchForNotes = (name) => (apiClient.get(`search/${name}`));

export const searchForNotesFromUser = (name, username) => (apiClient.get(`search/${name}`, { params: { username }}));

export const removePost = (username, id) => (apiClient.delete(`users/${username}/posts`, { params: {id} }))

export const fetchUsersWithLikes = () => (apiClient.get(`/leaderboard`))

export const like = (post, username) => (apiClient.post(`like/${username}`, { post }));
export const dislike = (post, username) => (apiClient.post(`dislike/${username}`, { post }));

export const fetchLikes = (id) => {
    return apiClient.get(`users/likes/${id}`)
      .then(response => {
        return { likesCount: response.data };
      })
      .catch(error => {
        return { likesCount: 0 };
      });
  };
  
  

