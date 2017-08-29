import React from 'react';
import { Link } from 'react-router-dom';



import { Tag, Tags, hasTag } from './Tags';

class JobListItem extends React.Component {
	
	constructor(props) {
		super(props);
		/*
		this.state = {
			isHidden: true
		}
		*/
	}	
	
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
	/*
	toggle(e) {
		this.setState({
			isHidden: !this.state.isHidden
    	});
		e.preventDefault();
	}
	*/
	
	render() {
		
		
		var tagsreact = this.props.job.tags ? this.props.job.tags.map((e) => { return (<Tag key={e.name} tag={e}/>)}) : [];
		
		return (
		
	
			<li className="job" id={'job'+this.props.job._id}>		
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

export default JobListItem