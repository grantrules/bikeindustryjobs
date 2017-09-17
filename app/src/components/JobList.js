import React from 'react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import StarService from '../services/stars';


import { Tag, hasTag } from './Tags';



class JobList extends React.Component {

	constructor(props) {
		super(props);
		this.state = {...props, initLoad: this.props.initLoad || 10, loadedJobs: [], hasMore: true};
		this.perPage = 10;
	}

	componentDidMount() {
		var { jobs, company, user } = this.state;
		jobs =  jobs.filter(job=>!company || job.company === company);
		var loadedJobs = jobs.slice(0,this.state.initLoad);
		this.setState({jobs, loadedJobs});
	}
	
	getCompany(company) {
		return this.props.companies.find(e=>e.company===company)
	}


	loadItems(page) {
		var hasMore = true;
		var items = this.state.jobs.slice(0,page*this.perPage+Number(this.state.initLoad));
		if (items.length === this.state.jobs.length) {
			hasMore = false;
		}
		this.setState({loadedJobs: items, hasMore: hasMore});
	}
	
	render() {

		var { loadedJobs, jobs, company, user } = this.state;

		jobs = loadedJobs;

		if (!jobs || jobs.length === 0) {
			return <div id="noresults">No results</div>
		}

		var last = new Date(0).toDateString();
		jobs = jobs.map(job => {
			var cleandate = new Date(job.first_seen).toDateString();
			var date = cleandate !== last;
			last = cleandate;
			return ([
				date ? <li>{ Moment(new Date(job.first_seen)).format('dddd, MMMM DD, YYYY')}</li> : null,
				<JobListItem onJobClick={this.state.onJobClick} user={user} key={job._id} job={job} updatedate={date} company={this.getCompany(job.company)}/>
			])
		});
		
		return (
			<ul id="joblist">
				<InfiniteScroll
					pageStart={0}
					loadMore={this.loadItems.bind(this)}
					hasMore={this.state.hasMore}
					loader={<div className="loader">Loading ...</div>}>
						{jobs}
				</InfiniteScroll>
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
					<Link onClick={this.props.onJobClick} className="title" to={`/job/${this.props.job._id}`}>{this.props.job.title}</Link>

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
	onClick(e) {
		var enabled = !this.state.enabled;
		this.setState({enabled});
		if (enabled) {
			StarService.star();
		} else {
			StarService.unstar();
		}
	}
	render() {
		return (
			<div onClick={this.onClick.bind(this)} className={this.state.enabled ? 'starEnabled' : 'star' }>★</div>
		)
	}
}

export default JobList