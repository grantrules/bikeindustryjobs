import React from 'react';

import { Tag, Tags, hasTag } from './Tags';

/* time prettifier */
var Moment = require('moment');

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
	
	toggle(e) {
		this.setState({
			isHidden: !this.state.isHidden
    	});
		e.preventDefault();
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
			
				
		
				<div className={"description "+(this.state.isHidden ? "deschidden" : "descvisible")}>
				<a href={this.props.job.url}>View and apply on company website</a>
			<div className="descriptiontext" ref={(description) => { this.description = description; }}  dangerouslySetInnerHTML={{__html: this.props.job.description}}></div>
				</div>
		</div>
	  </li>
	);

  }

}

export default Job