import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider, { useAuth } from "./security/AuthContext";
import Login from "./Login";
import Register from "./Register";
import Footer from "./Footer";
import Header from "./Header";
import './ApnaNotes.css';
import Error from "./Error";
import Logout from "./Logout";
import Home from "./Home";
import Profile from "./Profile";
import ModifyNotes from "./ModifyNotes";
import Leaderboard from "./Leaderboard";

export default function ApnaNotes(){
    function AuthenticatedRoute({children}){
        const authContext = useAuth()
        if(authContext.isAuthenticated) return children
        return <Navigate to="/"></Navigate>
    }
    return(
        <div className="App">
            <AuthProvider>
                <BrowserRouter>
                <Header />
                    <Routes>
                        <Route path='/' element={<Login />}></Route>
                        <Route path='/login' element={<Login />}></Route>
                        <Route path='/register' element={<Register />}></Route>
                        <Route path='/home' element={
                            <AuthenticatedRoute>
                                <Home />
                            </AuthenticatedRoute>
                            }>
                        </Route>    
                        <Route path={`/profile/:username`} element={
                            <AuthenticatedRoute>
                                <Profile />
                            </AuthenticatedRoute>
                            }>
                        </Route>
                        <Route path='/:user/notes' element={
                            <AuthenticatedRoute>
                                <ModifyNotes />
                            </AuthenticatedRoute>
                            }>
                        </Route>
                        <Route path='/leaderboard' element={
                            <AuthenticatedRoute>
                                <Leaderboard />
                            </AuthenticatedRoute>
                            }>
                        </Route>
                        <Route path='/*' element={<Error />}></Route>
                        <Route path='/logout' element={
                            <AuthenticatedRoute>
                                <Logout />
                            </AuthenticatedRoute>
                            }>
                        </Route>
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </AuthProvider>
        </div>
    );
}