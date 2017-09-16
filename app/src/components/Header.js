import React from 'react';
import { Link, Route } from 'react-router-dom';


const Test = ({logout}) => (
    <ul id="userdropdown" className="hidden">
        <li>Your profile</li>
        <li>Starred Jobs</li>
        <li><a href="#" onClick={e=>{
            e.preventDefault();
            logout();
        }}>Log Out</a></li>

    </ul>
)

const Search = ({filter}) => (
	<input type="search" onChange={(e)=>{filter(e.target.value);}} placeholder="Search..." id="q" />
);

const Header = ({user, searchCallback, companies, toggleNav, logout}) => {
	return (
	<header>
	<div id="header">
		<h1><Link to="/">careers.bike</Link></h1>
		<div className="navbuttons">
			<div className="navbutton">
				{user ? <div onClick={()=>{document.getElementById('userdropdown').classList.toggle('hidden')}}>Logged In<Test logout={logout}/></div> :
				<Link to="/login">Log In</Link>
				}
			</div>
			<div className="navbutton">
				<a href="https://github.com/grantrules/bikeindustryjobs">
					<svg height="34" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
				</a>
			</div>

			<div className="navbutton">
				<a href="#about">
					<svg height="34" viewBox="0 0 14 16" version="1.1" width="28" aria-hidden="true"><path fillRule="evenodd" d="M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"></path></svg>
				</a>
			</div>
		</div>
		<div id="searchNav">
			<Search filter={searchCallback}/> 
			<Route path="/company/:companyName" render={({ match }) => {
				if (companies) {
				var company = companies.find(g => g.company === match.params.companyName);

				return (
					<img id="headercompanylogo" src={company.logo} alt={`${company.company} logo`} />
				);}
				else return (null);
				
				}}
	
			/>
			
			<a id="companies" onClick={toggleNav}>Companies</a>
		</div>
	</div>
</header>
);
}

export { Header }