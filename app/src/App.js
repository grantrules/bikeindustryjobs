import React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import { UserLogin } from './routes/UserLogin';
import { Header } from './components/Header';
import { Index } from './routes/Index';
import { Job } from './routes/Job';
import { Company } from './routes/Company';


import Bloodhound from 'bloodhound-js';


import JobService from './services/jobs';
import AuthService from './services/auth';

/*
var NavLink = React.createClass({
    contextTypes: {
        router: React.PropTypes.object
    },

    render() {   
		//console.log(this.context.router);
        return (
            <Link {...this.props}></Link>
        );
    }
});
*/

var toggleNav = () => {
	document.getElementById('companyList').classList.toggle('hider');
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





class CompanyList extends React.Component {
	
	render() {
		var companies = this.props.companies.map(company=>(
				<Link key={company.company} onClick={toggleNav} to={`/company/${company.company}`}><img alt="" className="logo" src={company.logo}/></Link>
			)
		);
		
		return (
			<div>
				{companies}
			</div>
		);
	}
}


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
		console.log("what");
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
					console.log(data);
					this.setState({user: data.user});
					AuthService.setToken(data.token);
				}
			});
		}
	}
		
	render() {

		const { jobs, companies, tagsEnabled, engine, search, user, tags } = this.state;
	  
		return (
			<Router>
				<div>
					<Header user={user} toggleNav={toggleNav} searchCallback={this.search.bind(this)} companies={companies} logout={this.logout.bind(this)}/>

					<div id="companyList" className="companyList hider">
						<div id="companyListLeft">
							Companies --&gt;
						</div>
						<div id="companyListRight">
							{companies &&
								<CompanyList
									companies={companies}
								/>
							}
						</div>
					</div>
		
					<div id="base2">
						<div className="listthing">
							<Route exact={true} path="/" render={() => (
								<Index/>
							)}/>
							<Route exact={true} path="/login" render={() => (
								<UserLogin user={user} setUserData={this.setUserData.bind(this)}/>
							)}/>
							{companies &&
								<Route path="/company/:companyName" render={({ match }) => {
									var company = companies.find(g => g.company === match.params.companyName);
									return (
										<Company
											company={company}
											onClick={this.toggleTag.bind(this)}
											tags={tags}
											tagsEnabled={tagsEnabled}
											user={user}
											jobs={jobs}
											companies={companies}
											engine={engine}
											search={search}
										/>
									)
								}}/>
							}

							{jobs &&
								<Route path="/job/:jobId" render={({ match }) => {
									var job = jobs.find(g => g._id === match.params.jobId);
									return (
										<Job job={job} company={companies.find(g => g.company === job.company)}/>
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












// ========================================
/*
ReactDOM.render(
	<Router>
		<Jobs />
	</Router>,
	document.getElementById('root')
);
*/

export default App;
