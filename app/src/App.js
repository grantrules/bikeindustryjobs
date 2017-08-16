import React from 'react';
import ReactDOM from 'react-dom';

import Dropdown from 'react-dropdown'

import { Tag, Tags, hasTag } from './Tags';
import Job from './Job';

/* ajax */
var rest, mime, client;
 
rest = require('rest');
mime = require('rest/interceptor/mime');
client = rest.wrap(mime);


/* search engine */
var Bloodhound = require('bloodhound-js');

/* DELETE THIS SHIT */
var testinghost = (window.location.origin == 'http://localhost:3000' ? 'http://localhost:9004' : '');

function getHashQueryString() {
	var result = {}, queryString = window.location.hash.slice(1), re = /([^&=]+)=([^&]*)/g, m;

	while (m = re.exec(queryString)) {
		result[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}

	return result;
}



class Search extends React.Component {
	render() {
		return (
                <input onChange={(e)=>{this.props.filter(e.target.value);}} ref="search suggestion" placeholder="Search..." id="q" />
		)
	}
}

class CompanyList extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			selected: null
		}
		this._onSelect = this._onSelect.bind(this)
	}

	_onSelect (option) {
		this.setState({selected: option});
		this.props.setCompany(option.value);
	}
	
	render() {
				
		var options = [{value:'All', label:'All companies'}].concat(this.props.companies.map((company)=>{return {value:company.company, label:company.title}}));
		
		return (
			<div>
			<Dropdown options={options} onChange={this._onSelect} value={this.state.selected} placeholder="Companies..."/>
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
		this.state = {companies: [], jobs: [], filterJobs: [], tags: [], tagsEnabled: [], company: '', search: '', loading: true};
	}
	
	checkQueryString() {
		var qs = getHashQueryString();
		if (qs.search != this.state.search ||
			qs.company != this.state.company) {
				this.setState({search: qs.search || '', company: qs.company || ''}, this.filterCallback);
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
			
			this.setState({loading: false, jobs: response.entity, filterJobs: response.entity,
						  tags: tags, tagsEnabled: tagsEnabled, });
			this.startEngine(response.entity);

			window.addEventListener("hashchange", ()=>{
				this.checkQueryString();
			},false);

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

			{this.state.loading ? <div id="loading"><svg width="105" height="105" viewBox="0 0 105 105" xmlns="http://www.w3.org/2000/svg" fill="#ccc">
    <circle cx="12.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="0s" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="12.5" cy="52.5" r="12.5" fill-opacity=".5">
        <animate attributeName="fill-opacity"
         begin="100ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="300ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="600ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="12.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="800ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="52.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="400ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="12.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="700ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="52.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="500ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
    <circle cx="92.5" cy="92.5" r="12.5">
        <animate attributeName="fill-opacity"
         begin="200ms" dur="1s"
         values="1;.2;1" calcMode="linear"
         repeatCount="indefinite" />
    </circle>
</svg></div> : ''}

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
