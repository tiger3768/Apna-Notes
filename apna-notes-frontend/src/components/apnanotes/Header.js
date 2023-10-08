import {Link} from "react-router-dom"
import { useAuth } from "./security/AuthContext"

export default function Header(){
    const authContext = useAuth()
    const isAuthenticated = authContext.isAuthenticated
    const username = authContext.username
    function logout() {authContext.logout()}
    return(
        <header className="border-bottom border-light border-5 mb-5 p-2">
            <div className="container">
                <div className="row">
                    <nav className="navbar navbar-expand-lg">
                        <b id="logo" className="navbar-brand ms-2 fs-2 fw-bold">{<Link className="nav-link" to={isAuthenticated ? "/home" : "/login"}>Apna Notes</Link>}</b>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav bg-info">
                                <li className="nav-item fs-5">
                                    {isAuthenticated && <Link className="nav-link" to={`/profile/${username}`}>Profile</Link>}
                                </li>
                                <li className="nav-item fs-5 ">
                                    {isAuthenticated && <Link className="nav-link" to="/leaderboard">Leaderboard</Link>}
                                </li>
                            </ul>
                        </div>
                        <ul className="navbar-nav bg-info">
                            <li className="nav-item fs-5">
                                {!isAuthenticated && <Link className="nav-link" to="/login">Login</Link>}
                            </li>
                            <li className="nav-item fs-5">
                                {!isAuthenticated && <Link className="nav-link" to="/register">Register</Link>}
                            </li>
                            <li className="nav-item fs-5">
                                {isAuthenticated && <Link className="nav-link" to="/logout" onClick={logout}>Logout</Link>}
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    )
}