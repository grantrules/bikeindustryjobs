import React from 'react';
import ReactDOM from 'react-dom';
//import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Dropdown from 'react-dropdown'

import T from './Tags';
var Tags = T.Tags;
var Tag = T.Tag;


var rest, mime, client;
 
rest = require('rest');
mime = require('rest/interceptor/mime');

var Bloodhound = require('bloodhound-js');
var Moment = require('moment');


 
client = rest.wrap(mime);


class Job extends React.Component {
	
	constructor(props) {
    	super(props);
		this.state = {
      		isHidden: true
    	}
	}
	
	derp(e) { return '#'+e; }
	
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
				<div>
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
		this.state = {companies: [], jobs: [], filterJobs: [], company: '', search: ''};
	}
	
	filter(input) {
		this.setState({search: input});
		if (!input) {
			this.updateJobs(this.state.jobs);
		} else {
			this.state.engine.search(input, (d) => {
				this.updateJobs(d);
			  }, function(d) {});
		}
		
		
	}
	
	updateJobs(jobs) {
		if (this.state.company) {
			jobs = jobs.filter((job)=>{return job.company == this.state.company});
		}
		this.setState({filterJobs: jobs});
		
	}
	
	setCompany(company) {
		company = (!company || company == 'All' ? '' : company);
		this.setState({company: company},()=>{		
			this.filter(this.state.search);
		});
	}
	
	startEngine() {
			var engine = new Bloodhound({
				local: this.state.jobs,
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['title','description']),
			});
			engine.initialize();
			this.setState({engine:engine});
	}
	
	componentDidMount() {
		client({method: 'GET', path: 'http://localhost:9004/api/companies'}).then((response) => {
			this.setState({companies: response.entity});
		});
		
		client({method: 'GET', path: 'http://localhost:9004/api/jobs'}).then((response) => {
			this.setState({jobs: response.entity, filterJobs: response.entity});
			
			this.startEngine();

		});
		
	}
		
  render() {
	  
	  
	 return (
		 <div className="jobs">
			 <Search filter={this.filter.bind(this)}/>
			<CompanyList companies={this.state.companies} setCompany={this.setCompany.bind(this)}/>
			<Tags jobs={this.state.jobs}/>

			 
		<JobList jobs={this.state.filterJobs} companies={this.state.companies}/>
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
