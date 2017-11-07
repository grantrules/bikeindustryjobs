import React from 'react';
import { Link } from 'react-router-dom';
import SVGLogo from './SVGLogo'

const LoginLink = ({name, user, logout}) => {
    if (user) {
        return (
            <div className="loggedin" onClick={()=>{document.getElementById(`${name}userdropdown`).classList.toggle('hidden')}}>
                Logged In
                <Test name={`${name}userdropdown`} logout={logout}/>
            </div>            
        )
    }
    return (
        <Link className="loginlink" to="/login">Log In</Link>
    )
    
}

const Test = ({name, logout}) => (
    <ul id={name} className="userdropdown hidden">
        <li><Link to="/profile">Your profile</Link></li>
        <li><Link to="/profile/saved">Starred Jobs</Link></li>
        <li><a href="#logoutfailed" onClick={e=>{
            e.preventDefault();
            logout();
        }}>Log Out</a></li>

    </ul>
)

const SlideHeader = ({...props}) => (
    <div id="slideinheaderpos">
        <RegularHeader id="slideinheader" {...props}/>
    </div>
)

const RegularHeader = ({id,...props}) => (
    <div className="header" id={id || "regularheader"}>
        <div>
            <Link to="/">
                <SVGLogo/>
            </Link>
        </div>
        <ul>
            <li>
                <LoginLink name={id || "regularheader"} user={props.user} logout={props.logout}/>
            </li>
        </ul>
    </div>
)

export { SlideHeader, RegularHeader, LoginLink }