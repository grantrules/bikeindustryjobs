import React from 'react';


class Tag extends React.Component {
	render() {
		return (
			<span>{this.props.tag.label}</span>
		)
	}
}


class Tags  extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	render() {
		var jobs = this.props.jobs;
		
		
		
		/*
		
		need to turn:
		
		[
		 {tags:[{name:'a', label:'a'},{name:'b', label:'v'}]},
		 {tags:[{name:'a', label:'a'},{name:'c', label:'c'}]}
		]
		
		into
		
		[
		 {name:'a', label:'a', total:2},
		 {name:'b', label:'b', total:1},
		 {name:'c', label:'c', total:1}
		 ]
		*/
		var reacttags;
		var totals = [];
		var tags = [];
		for (var job in jobs) {
			if (jobs[job] && jobs[job].tags) {
				tags = tags.concat(jobs[job].tags);
			}
		}
		var uniquetags = [];
		
		if (tags.length > 0) {
			tags.forEach((tag)=>{
				if (totals[tag.name]) {
					totals[tag.name]++;
				} else {
					totals[tag.name] = 1;
					uniquetags = uniquetags.concat(tag);
				}

				
			});
			reacttags = uniquetags.map((tag) => {
				tag.totals = totals[tag.name];
				return ( <Tag key={tag.name} tag={tag}/>)
			
			
			});
			}
		
		
		
		
		
		return (reacttags ?
			<div id="taglist">
					{reacttags}
			</div> : null
		)
		
	}
}
	
export default {Tag, Tags}