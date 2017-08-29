import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import { Tags, hasTag } from './Tags';
import JobListItem from './Job';

import Bloodhound from 'bloodhound-js';

import rest from 'rest';
import mime from 'rest/interceptor/mime';

import { html, safeHtml } from 'common-tags'


var client = rest.wrap(mime);

var toggleNav = () => {
	document.getElementById('companyList').classList.toggle('hider');
	return false;
}


/* DELETE THIS SHIT */
var testinghost = (window.location.origin === 'http://localhost:3000' ? 'http://localhost:9004' : '');

function getHashQueryString() {
	var result = {}, queryString = window.location.hash.slice(1), re = /([^&=]+)=([^&]*)/g, m;

	while (m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return result;
}


const Search = ({filter}) => (
	<input type="search" onChange={(e)=>{filter(e.target.value);}} placeholder="Search..." id="q" />
);

class CompanyList extends React.Component {
	
	render() {
				
		var companies = this.props.companies.map(company=>{
			return (
				<Link to={`/company/${company.company}`}><img alt="" className="logo" src={company.logo}/></Link>
			)
		});
		//var options = [{value:'All', label:'All companies'}].concat(this.props.companies.map((company)=>{return {value:company.company, label:company.title}}));
		
		return (
			<div>
			{companies}
			</div>
		);
	}
}

// <JobList jobs="" companies="" engine="" company="" tags="{}" search=""}
class JobList extends React.Component {

	constructor(props) {
		super(props);
		this.state = { jobs: null }
	}
	
	getCompany(company) {
		return this.props.companies.find((e)=>{return e.company===company})
	}

	shouldComponentUpdate(props,nextProps) {
		console.log("UPdating..");
		console.log(props);
		console.log(nextProps);
		return true;
		//alert("hey");
	}

	componentWillMount() {
		this.updateJobs(this.props.jobs, this.props.company, this.props.tags);
	}

	componentWillReceiveProps(nextProps) {
		this.updateJobs(nextProps.jobs, nextProps.company, nextProps.tags);
	}

		/* if search is empty, directly update,
	   callback for searchengine */
	filter(search, company, tags) {
		if (!search) {
			this.updateJobs(this.props.jobs, company, tags);
		} else {
			this.props.engine.search(search, (d) => {
				this.updateJobs(d, company, tags);
			}, function(d) {});
		}
		
	}
	
	/* filters array of jobs
	   checks for no c
	*/
	updateJobs(jobs,company,tags) {
		jobs = jobs ? jobs : [];
		// no tags or all tags = no search
		var tagsearch = tags && tags.length > 0 && tags.length !== this.state.tags.length;
		var companysearch = company !== "";
		
		
		jobs = jobs.filter(job=>!companysearch || job.company === company ? !tagsearch || hasTag(job,tags) : false)
		/* if (!this.state.jobs || this.state.jobs.length !== jobs.length) {
			console.log('state change: setting jobs');
			this.setState({ jobs });
		}*/
		console.log(`update jobs: ${company}`)
		this.setState({ jobs });
	}
	
	render() {


		if (!this.state.jobs || this.state.jobs.length === 0) {
			return <div id="noresults">No results</div>
		}
		var last = new Date(0).toDateString();
		var jobs = this.state.jobs.map(job => {
			var cleandate = new Date(job.first_seen).toDateString();
			var date = cleandate !== last;
			last = cleandate;
			return ( <JobListItem key={job._id} job={job} updatedate={date} company={this.getCompany(job.company)}/>)
			
			
		});
		
		return (
			<ul id="joblist">
					{jobs}
			</ul>
		)
	}
}

class Jobs extends React.Component {
	constructor(props) {
		super(props);
		this.state = {companies: null, jobs: null, tags: [], tagsEnabled: [], company: '', search: '', loading: true};
	}
	
	checkQueryString() {
		var qs = getHashQueryString();
		if (qs.search !== this.state.search ||
			qs.company !== this.state.company) {
				console.log('state change: setting search from qs');
				this.setState({search: qs.search || '', company: qs.company || ''});
			}
	}
	
	/* turns		
		[ {tags:[{name:'a', label:'a'},{name:'b', label:'v'}]},
		  {tags:[{name:'a', label:'a'},{name:'c', label:'c'}]} ]
	   into
		[ {name:'a', label:'a', total:2},
		  {name:'b', label:'b', total:1},
		  {name:'c', label:'c', total:1} ] */
	getTags(objArray) {
		
		var totals = [];
		var tags = [];
		for (var job in objArray) {
			if (objArray[job] && objArray[job].tags) {
				tags = tags.concat(objArray[job].tags);
			}
		}
		var uniquetags = [];
		
		tags.forEach((tag)=>{
			if (totals[tag.name]) {
				totals[tag.name]++;
			} else {
				totals[tag.name] = 1;
				uniquetags = uniquetags.concat(tag);
			}


		});
		return uniquetags.map((tag) => { tag.totals = totals[tag.name]; return tag; })

	}
	
	
	/* callback for <Search onChange/> */
	search(input) {
		console.log('state change: setting search');
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
		console.log('state change: setting tagsEnabled');
		this.setState({tagsEnabled: tags});
				
	}
	
	/* callback for <CompanyList setCompany/> */
	setCompany(company) {
		company = (!company || company === 'All' ? '' : company);
		console.log(`${company} !== ${this.state.company}`)
		if (company !== this.state.company) {
			console.log('state change: setting company');
			console.log(company);
			this.setState({company: company});
		}
	}
	
	

	/* initialize search engine with data */
	startEngine(jobs) {
		var engine = new Bloodhound({
			local: jobs,
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['title','description']),
		});
		engine.initialize();

		console.log('state change: setting engine');
		this.setState({engine:engine});
	}
	
	
	/* implemented from react.component */
	componentDidMount() {
		client({method: 'GET', path: testinghost + '/api/companies'}).then((response) => {
			console.log('state change: setting companies');
			this.setState({companies: response.entity});
		});
		
		client({method: 'GET', path: testinghost + '/api/jobs'}).then((response) => {
			
			var tags = this.getTags(response.entity);
			var tagsEnabled = tags.map(e=>e.name);
			
			console.log('state change: setting jobs & related');
			this.setState({loading: false, jobs: response.entity,
						  tags: tags, tagsEnabled: tagsEnabled, });
			this.startEngine(response.entity);

			window.addEventListener("hashchange", ()=>{
				this.checkQueryString();
			},false);

		});
		
	}
		
	render() {

		const { jobs, companies, tagsEnabled, engine, company, search } = this.state;
	  
	  
		return (
			<Router>
			<div>
				<header>
					<div id="header">
						<h1><Link to="/">careers.bike</Link></h1>
						<div className="navbuttons">
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
							<Search filter={this.search.bind(this)}/> <a id="companies" onClick={toggleNav}>Companies</a>
						</div>
					</div>
				</header>

				<div id="companyList" className="companyList hider">
					<div id="companyListLeft">
						Companies --&gt;
					</div>
					<div id="companyListRight">
						{companies &&
							<CompanyList
								companies={companies}
								setCompany={this.setCompany.bind(this)}
							/>
						}
			</div>
		</div>
		<div id="base">
			<div className="listthing jobs">
				<Tags
					onClick={this.toggleTag.bind(this)}
					tags={this.state.tags}
					tagsEnabled={this.state.tagsEnabled}
				/>
				{this.state.loading ?
					<Loading/>
					:
					<div>
						<span className="tagblap">Bike Mechanic</span>
						<span className="tagblap">Customer Service</span>
						<span className="tagblap">Marketing</span>
						<span className="tagblap">Design</span>
						<span className="tagblap">Labor</span>
						<span className="tagblap">Outside Rep</span>

						<JobList
							jobs={jobs}
							companies={companies}
							engine={engine}
							company={company}
							tags={tagsEnabled}
							search={search}
						/>
					</div>
				}
			</div>
		</div>
		<div id="base2">
			<div className="listthing">
			<Route exact={true} path="/" render={() => (
				<div id="home">
					<div id="homeheader">
						<div>Specialized Bicycle Company</div>
					</div>

				<h1>Jobs</h1>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				</div>
			)}/>
			{companies &&
				<Route path="/company/:companyName" render={({ match }) => {
					var company = companies.find(g => g.company === match.params.companyName);
					return (
						<Company company={company} onMount={this.setCompany.bind(this)}/>
					)
				}}/>
			}

			{jobs &&
				<Route path="/job/:jobId" render={({ match }) => {
					var job = jobs.find(g => g._id === match.params.jobId);
					 return (
					<Job job={job} company={companies.find(g => g.company === job.company)}/>
				);}} />}
</div>
		</div>
		</div>
		</Router>

		);
	  
  	}
}

const Job = ({ job, company }) => (
	<div>
		{company.logo ?
			<img alt="" className="logo" src={company.logo}/>
			:
			<strong>{company.title}</strong>
		}

		<div className="jobdata">
			{job.title}

			<div className="location">
				{job.location || company.location}
			</div>

			<div className="description">
				<a href={job.url}>View and apply on company website</a>
				<div className="descriptiontext"
					dangerouslySetInnerHTML={{__html: html`${safeHtml`${job.description}` }`}}>
				</div>
			</div>			
		</div>
	</div>
);

const Loading = () => (
	<div id="loading">
		<svg width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill="#ccc">
			<circle cx="12.5" cy="12.5" r="12.5"><animate attributeName="fill-opacity" begin="0s" dur="1s"  values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="12.5" cy="52.5" r="12.5"><animate attributeName="fill-opacity" begin="100ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="52.5" cy="12.5" r="12.5"><animate attributeName="fill-opacity" begin="300ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="52.5" cy="52.5" r="12.5"><animate attributeName="fill-opacity" begin="600ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="92.5" cy="12.5" r="12.5"><animate attributeName="fill-opacity" begin="800ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="92.5" cy="52.5" r="12.5"><animate attributeName="fill-opacity" begin="400ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="12.5" cy="92.5" r="12.5"><animate attributeName="fill-opacity" begin="700ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="52.5" cy="92.5" r="12.5"><animate attributeName="fill-opacity" begin="500ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
			<circle cx="92.5" cy="92.5" r="12.5"><animate attributeName="fill-opacity" begin="200ms" dur="1s" values="1;.2;1" calcMode="linear" repeatCount="indefinite" /></circle>
		</svg>
	</div>
);


class Company extends React.Component {
	constructor (props) {
		super(props);
	}

	componentDidMount() {
		console.log(`company component did mount: ${this.props.company.company}`);
		this.props.onMount(this.props.company.company);
	}

	/*
	shouldComponentUpdate(nextProps, nextState) {
		//console.log(`${nextProps.company.company} !== ${this.props.company.company}`)
		//return nextProps.company.company !== this.props.company.company
		return true;
	}
	*/

	componentWillUpdate(nextProps) {
		console.log(`company component will update: ${nextProps.company.company}`);
		this.props.onMount(nextProps.company.company);
	}

	render() {
		return (
				<div id="home">
					<div id="homeheader">
						<div>{this.props.company.title}</div>
					</div>

				<h1>Jobs</h1>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				<p> Here's a bunch of text about things hey</p>
				</div>
		)
	}
}

// ========================================

ReactDOM.render(
	<Jobs />,
	document.getElementById('root')
);


export default Jobs;
