import axios from "axios";

export const apiClient = axios.create(
    {
        baseURL:'http://localhost:8080'
    }
)

export const getRegistered = (email, username, password) => (apiClient.post(`/register`, {email, username, password}));

export const getVerified = (username, verificationCode) => (apiClient.post(`/verify`, {username, verificationCode}));

export const sendCode = (username) => (apiClient.post(`/resendCode`, {username}));  

export const getAuthenticated = (username, password) => (apiClient.post(`/login`, {username, password}));

export const resetPassword = (username, password, verificationCode, token) => (apiClient.post(`/resetPassword`, {username, password, verificationCode, token}))

export const getUserData = (username) => (apiClient.get(`/users/${username}`));

export const retrievePostsForUsername = (username) => (apiClient.get(`users/${username}/posts`));

export const uploadPostsForUsername = (username, name, path, topic) => (apiClient.post(`users/${username}/posts`, { name, path, topic}));

export const getPostTopics = (username, postId) => (apiClient.get(`/users/${username}/posts/topics`, {postId}))

export const searchForNotes = (name, topicList) => (apiClient.get(`search/${name}`))

export const getOrganisations = (organisationType) => apiClient.get(`/organisations?organisationType=${organisationType}`);

export const getOrganisationStudents = (organisationName) => (apiClient.get(`/organisations/${organisationName}`))

export const getTopics = () => (apiClient.get(`/topics`))

export const searchForNotesFromUser = (name, username) => (apiClient.get(`search/${name}?username=${username}`));

export const removePost = (username, id) => (apiClient.delete(`users/${username}/posts`, { params: {id} }))

export const fetchUsersWithLikes = () => (apiClient.get(`/leaderboard`))

export const updateProfileData = (username, firstname, lastname, organisationType, organisation) =>  (apiClient.patch(`/users/${username}`, {username, firstname, lastname, organisationType, name:organisation}))

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
  
  

