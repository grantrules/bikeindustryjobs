import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';



import { Tag, Tags, hasTag } from './Tags';

// <JobList user="" jobs="" companies="" engine="" company="" tags="{}" search=""}
class JobList extends React.Component {
	
	getCompany(company) {
		return this.props.companies.find(e=>e.company===company)
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
	
	
	render() {

		var { jobs, company, user } = this.props;

		if (!jobs || jobs.length === 0) {
			return <div id="noresults">No results</div>
		}
		var last = new Date(0).toDateString();
		jobs = jobs.filter(job=>!company || job.company === company).map(job => {
			var cleandate = new Date(job.first_seen).toDateString();
			var date = cleandate !== last;
			last = cleandate;
			return ([
				date ? <li>{ Moment(new Date(job.first_seen)).format('dddd, MMMM DD, YYYY')}</li> : null,
				<JobListItem user={user} key={job._id} job={job} updatedate={date} company={this.getCompany(job.company)}/>
			])
		});
		
		return (
			<ul id="joblist">
					{jobs}
			</ul>
		)
	}
}

class JobListItem extends React.Component {
	
	hasTag(tag) {
		return hasTag(this.props.job,tag);
	}
	
	titleOrLogo() {
		return (this.props.company.logo ?
			<img alt="" className="logo" src={this.props.company.logo}/>
			:
			<strong>{this.props.company.title}</strong>
		);
	}
	
	render() {
		
		
		var tagsreact = this.props.job.tags ? this.props.job.tags.map((e) => { return (<Tag key={e.name} tag={e}/>)}) : [];
		
		return (
		
	
			<li className="job" id={'job'+this.props.job._id}>
				{this.props.user ?
					<Star/>
					: '' }	
				{this.titleOrLogo()}
				<div className="jobdata">
					<Link className="title" to={`/job/${this.props.job._id}`}>{this.props.job.title}</Link>

					<div className="location">
						{this.props.job.location || this.props.company.location}
					</div>
				<ul className="tags">
					{tagsreact}
				</ul>
			
				
			</div>
		  </li>
	);

  }

}

class Star extends React.Component {
	constructor(props) {
		super(props);
		this.state = props;
	}
	render() {
		return (
			<div onClick={()=>{this.setState({enabled: !this.state.enabled})}} className={this.state.enabled ? 'starEnabled' : 'star' }>★</div>
		)
	}
}

export default JobList