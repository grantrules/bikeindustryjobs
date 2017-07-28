import React from 'react';
import ReactDOM from 'react-dom';

import Dropdown from 'react-dropdown'

import T from './Tags';
var Tags = T.Tags;
var Tag = T.Tag;


/* ajax */
var rest, mime, client;
 
rest = require('rest');
mime = require('rest/interceptor/mime');
client = rest.wrap(mime);


/* search engine */
var Bloodhound = require('bloodhound-js');

/* time prettifier */
var Moment = require('moment');

/* DELETE THIS SHIT */
var testinghost = (window.location.origin == 'http://localhost:3000' ? 'http://localhost:9004' : '');

 

function hasTag(job,tag) {
	
	return job.tags && job.tags.filter(
		e => (typeof tag == "object"
			  && typeof tag.name == "string"
			  	? tag.name : tag
			).indexOf(e.name) > 0
	);
}


class Job extends React.Component {
	
	constructor(props) {
    	super(props);
		this.state = {
      		isHidden: true
    	}
	}
	
	derp(e) { return '#'+e; }
	
	
	hasTag(tag) {
		return hasTag(this.props.job,tag);
		//return this.props.job.tags && this.props.job.tags.map(e => e.name).indexOf(typeof tag == "object" ? tag.name : tag) > -1;
	}
	
	titleOrLogo() {
		return (this.props.company.logo ?
			   <img alt="" className="logo" src={this.props.company.logo}/>
				:
				<strong>{this.props.company.title}</strong>
			   
			   );
	}
	
	toggle() {
		this.setState({
			isHidden: !this.state.isHidden
    	});
	}
	
	render() {
		
		
		var tagsreact = this.props.job.tags ? this.props.job.tags.map((e) => { return (<Tag key={e.name} tag={e}/>)}) : [];
		
		return (
		
	
      <li className="job" id={'job'+this.props.job._id}>
		  {this.props.updatedate && <li>{ Moment(new Date(this.props.job.first_seen)).format('dddd, MMMM DD, YYYY')}</li>}
		
		{this.titleOrLogo()}
		<div className="jobdata">
			<a className="title" href={this.derp(this.props.job._id)}  onClick={this.toggle.bind(this)}>{this.props.job.title}</a>

			<div className="location">
				{this.props.job.location || this.props.company.location}
			</div>
			<ul className="tags">
			{tagsreact}
			</ul>
			
				
		
			{!this.state.isHidden && 
				<div className="description">
				<a href={this.props.job.url}>View and apply on company website</a>
			<div ref={(description) => { this.description = description; }}  dangerouslySetInnerHTML={{__html: this.props.job.description}}></div>
				</div>}
		</div>
	  </li>
	);

  }

}

class Search extends React.Component {
	render() {
		return (
                <input onChange={(e)=>{this.props.filter(e.target.value);}} ref="search suggestion" placeholder="Search..." id="q" />
		)
	}
}

class CompanyList extends React.Component {
	_onSelect(e) {
		this.props.setCompany(e.value);
	}
	render() {
		
		var options =[{value:'All', label:'All companies'}].concat(this.props.companies.map((company)=>{return {value:company.company, label:company.title}}));
		
		return (
			<div>
			<Dropdown options={options} onChange={this._onSelect.bind(this)} placeholder="Companies..."/>
			</div>
		);
	}
}

class JobList extends React.Component {
	
	getCompany(company) {
		return this.props.companies.filter((e)=>{return e.company==company})[0];
	}
	/*
	filterJobs(filter) {
		return this.props.jobs.filter((e) { return e.title.toLowerCase().includes(filter.toLowerCase()); });
	}
	*/
	
	render() {
		var last = new Date(0).toDateString();
		var jobs = this.props.jobs.map(job => {
			var cleandate = new Date(job.first_seen).toDateString();
			var date = cleandate !== last;
			last = cleandate;
			return ( <Job key={job._id} job={job} updatedate={date} company={this.getCompany(job.company)}/>)
			
			
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
		this.state = {companies: [], jobs: [], filterJobs: [], tags: [], tagsEnabled: [], company: '', search: ''};
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
	
	/* search/filtering stuff */
	
	
	/* callback for state change of search filter */
	filterCallback() {
		this.filter(this.state.search, this.state.company, this.state.tagsEnabled);
	}
	
	/* if search is empty, directly update,
	   callback for searchengine */
	filter(search, company, tags) {

		if (!search) {
			this.updateJobs(this.state.jobs, company, tags);
		} else {
			this.state.engine.search(search, (d) => {
				this.updateJobs(d, company, tags);
			  }, function(d) {});
		}
		
	}
	
	/* filters array of jobs
	   checks for no c
	*/
	updateJobs(jobs,company,tags) {
		
		
		// no tags or all tags = no search
		var tagsearch = typeof tags != "undefined" && tags.length > 0 && tags.length != this.state.tags.length;
		var companysearch = company != "";
		
		
		jobs = jobs.filter(job=>!companysearch || job.company == company ? !tagsearch || hasTag(job,tags) : false)
		
		
		this.setState({filterJobs: jobs});
		
	}
	
	/* callback for <Search onChange/> */
	search(input) {
		this.setState({search: input},this.filterCallback);

	}
	
	/* callback for <TagList onClick/> */
	toggleTag(enabled, tag) {
		var tags = this.state.tagsEnabled;

		if (enabled) {
			tags.push(tag.name)
		} else {
			tags = tags.filter(e=>e!=tag.name);
		}
		this.setState({tagsEnabled: tags},this.filterCallback);
				
	}
	
	/* callback for <CompanyList setCompany/> */
	setCompany(company) {
		company = (!company || company == 'All' ? '' : company);
		
		this.setState({company: company},this.filterCallback);
	}
	
	

	/* initialize search engine with data */
	startEngine(jobs) {
			var engine = new Bloodhound({
				local: jobs,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['title','description']),
			});
			engine.initialize();
			this.setState({engine:engine});
	}
	
	/* implemented from react.component */
	componentDidMount() {
		client({method: 'GET', path: testinghost + '/api/companies'}).then((response) => {
			this.setState({companies: response.entity});
		});
		
		client({method: 'GET', path: testinghost + '/api/jobs'}).then((response) => {
			
			var tags = this.getTags(response.entity);
			var tagsEnabled = tags.map(e=>e.name);
			
			this.setState({jobs: response.entity, filterJobs: response.entity,
						  tags: tags, tagsEnabled: tagsEnabled, });
			this.startEngine(response.entity);

		});
		
	}
		
	render() {
	  
	  
		return (
		 <div className="jobs">
			<Search filter={this.search.bind(this)}/>

			<CompanyList
				companies={this.state.companies}
				setCompany={this.setCompany.bind(this)}
			/>

			<Tags
				onClick={this.toggleTag.bind(this)}
				tags={this.state.tags}
				tagsEnabled={this.state.tagsEnabled}
			/>

			 <JobList
				jobs={this.state.filterJobs}
				companies={this.state.companies}
			/>
		</div>
		);
	  
  	}
}

// ========================================

ReactDOM.render(
  <Jobs />,
  document.getElementById('root')
);


export default Jobs;
