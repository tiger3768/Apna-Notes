import { createContext, useContext, useState } from "react";
import { apiClient, getAuthenticated, getRegistered } from "../api/ApiService";

export const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext) 

export default function AuthProvider({children}){
    const[isAuthenticated, setAuthenticated] = useState(false)
    const[username, setUsername] = useState(null)
    const[token, setToken] = useState()
    const[isModerator, setModerator] = useState(false)
    async function register(username, password){
        try{
            const response = await getRegistered(username, password);
                if(response.status === 200){
                    if(response.data.error !== ''){
                        return {status:false, error:response.data.error};
                    }
                    return {status:true};
                }
                else{
                    return {status:false, error:'Registeration Failed'};
                }
        }
        catch(error){
            return {status:false, error:'Registeration Failed'};
        }
    }
    async function login(username, password) {
        try {
          const response = await getAuthenticated(username, password);
            if (response.status === 200) {
                setAuthenticated(true);
                setUsername(username);
                const bAToken = 'Bearer ' + response.data.token;
                setToken(bAToken);
                if(response.role === 'ADMIN') setModerator(true);
                apiClient.interceptors.request.use((config) => {
                    config.headers.Authorization = bAToken;
                    return config;
                });
                return true;
            } 
            else {
                logout();
                return false;
            }
        } 
        catch (error) {
            logout();
            return false;
        }
    }
    function logout(){
        setToken(null)
        setAuthenticated(false)
        setUsername(null)
        setModerator(false)
    }
    return(
        <AuthContext.Provider value={{isAuthenticated, login, logout, register, username, token, isModerator}}>
            {children}
        </AuthContext.Provider>
    )
}