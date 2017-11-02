import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { UserLogin } from './routes/UserLogin';
import { UserProfile } from './routes/UserProfile';
import { Index } from './routes/Index';
import { Job } from './routes/Job';
import { Company } from './routes/Company';
import AuthRoute from './routes/Auth';


import Bloodhound from 'bloodhound-js';



import JobService from './services/jobs';
import AuthService from './services/auth';
import StarService from './services/stars';


//import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-105678-5'); // add your UA code 

var logPageView = () => {
	ReactGA.set({ page: window.location.pathname + window.location.search });
	ReactGA.pageview(window.location.pathname + window.location.search);
}

/*
function getHashQueryString() {
	var result = {}, queryString = window.location.hash.slice(1), re = /([^&=]+)=([^&]*)/g, m;

	while ((m = re.exec(queryString)) !== null) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return result;
}
*/


class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			companies: null,
			jobs: null,
			tags: [], tagsEnabled: [],
			search: '',
			modalIsOpen: false,
			user: null,
			stars: [],
			toggleStar: this.toggleStar.bind(this),
		};
	}
	/*
	checkQueryString() {
		var qs = getHashQueryString();
		if (qs.search !== this.state.search ||
			qs.company !== this.state.company) {
				console.log('state change: setting search from qs');
				this.setState({search: qs.search || '', company: qs.company || ''});
			}
	}*/
	
	logout() {
		this.setState({user: null});
		localStorage.removeItem('jwt');
		localStorage.removeItem('refresh_token');
	}
	
	/* callback for <Search onChange/> */
	search(input) {
		this.setState({search: input});
	}
	
	/* callback for <TagList onClick/> */
	toggleTag(enabled, tag) {
		var tags = this.state.tagsEnabled;

		if (enabled) {
			tags.push(tag.name)
		} else {
			tags = tags.filter(e=>e!==tag.name);
		}
		this.setState({tagsEnabled: tags});
				
	}

	setUserData(data) {
		this.setState({user: data.user, jwt: data.token});
		localStorage.setItem("refresh_token", data.refresh_token);
		localStorage.setItem("jwt", data.token);
		this.login();
	}

	login() {
		console.log("logging in");
		StarService.getStars((err, data) => {
			if (!err) {
				console.log(data);
				this.setState({stars: data});
			} else {
				console.log(`ewwow ${err}`);
			}
		})
	}

	toggleStar(jobId, data) {
		var stars = this.state.stars;
		if (stars.find(e=>e.job_id===jobId)) {
			stars = stars.filter(e=>e.job_id!==jobId);
		} else {
			stars.push(data);
		}
		this.setState({stars});
	}
	
	

	/* initialize search engine with data */
	startEngine(jobs) {
		var engine = new Bloodhound({
			local: jobs,
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['title','description']),
		});
		engine.initialize();

		return engine;
	}
	
	
	/* implemented from react.component */
	componentDidMount() {
		JobService.getCompanies(JobService.callback(this.setState.bind(this)).receiveCompanies);
		JobService.getJobs(JobService.callback(this.setState.bind(this)).receiveJobs);

		/*
		window.addEventListener("hashchange", ()=>{
			this.checkQueryString();
		},false);	
		*/

		if (AuthService.getRefreshToken()) {
			console.log("found login info");
			AuthService.refresh_token(null, (err, data) => {
				if (!err) {
					this.setState({user: data.user});
					AuthService.setToken(data.token);
					this.login();
				}
			});
		}

		window.addEventListener('scroll', () => {
			var y = window.pageYOffset || window.pageYOffset===0 ? window.pageYOffset : window.scrollY;
			var getPosition = (el) => {
				var yPos = 0;
			   
				while (el) {
				  if (el.tagName === "BODY") {
					var yScroll = el.scrollTop || document.documentElement.scrollTop;
					yPos += (el.offsetTop - yScroll + el.clientTop);
				  } else {
					yPos += (el.offsetTop - el.scrollTop + el.clientTop);
				  }
				  el = el.offsetParent;
				}
				return yPos;
			}
			var headerPos = document.getElementById('slideinheaderpos');
			var header = document.getElementById('slideinheader');
			if (headerPos && ((y > getPosition(headerPos) + y) === !header.classList.contains('visible'))) {
				header.classList.toggle('visible')
			}
		})
	}
		
	render() {

		console.log('app rendering');

		const { jobs, companies, user } = this.state;
	  
		return (
			<Router onUpdate={logPageView}>
				<div>		
					<div id="base2">
						<div className="listthing">
							<Route exact={true} path="/" render={() => (
									<Index {...this.state} logout={this.logout.bind(this)}/>
							)}/>
							<Route path="/login" render={() => (
								<UserLogin user={user} setUserData={this.setUserData.bind(this)}/>
							)}/>
							<Route path="/auth/:strategy" render={({match }) =>
								<AuthRoute setUserData={this.setUserData.bind(this)}/>
							}/>

							{user &&
								<Route path="/profile" render={() => (
									<UserProfile {...this.state}/>
								)}/>
							}

							{companies &&
								<Route path="/company/:companyName" render={({ match }) => {
									var company = companies.find(g => g.company === match.params.companyName);
									return (
										<Company logout={this.logout.bind(this)} {...this.state}
											company={company}
											onClick={this.toggleTag.bind(this)}
										/>
									)
								}}/>
							}

							{jobs &&
								<Route path="/job/:jobId" render={({ match }) => {
									var job = jobs.find(g => g._id === match.params.jobId);
									return (
										<Job logout={this.logout.bind(this)} {...this.state} job={job} company={companies.find(g => g.company === job.company)}/>
									)
								}} />
							}
						</div>
					</div>
				</div>
			</Router>
		);
  	}
}

export default App;
