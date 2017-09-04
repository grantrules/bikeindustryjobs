import React from 'react';

function hasTag(job,tag) {
	
	return job.tags && job.tags.filter(
		e => (typeof tag === "object"
			  && typeof tag.name === "string"
			  	? tag.name : tag
			).indexOf(e.name) > 0
	);
}

/* turns		
	[ {tags:[{name:'a', label:'a'},{name:'b', label:'v'}]},
		{tags:[{name:'a', label:'a'},{name:'c', label:'c'}]} ]
	into
	[ {name:'a', label:'a', total:2},
		{name:'b', label:'b', total:1},
		{name:'c', label:'c', total:1} ] */
var getTags = objArray => {
	
	var totals = [];
	var tags = [];
	for (var job in objArray) {
		if (objArray[job] && objArray[job].tags) {
			tags = [...tags, ...objArray[job].tags];
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


class Tag extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = { enabled: true };
	}
	
	toggleState() { 
		var enabled = !this.state.enabled;
		this.setState({enabled});
		return enabled;
	}
	
	render() {
		return (
			<span className={"tagItem "+(this.state.enabled ? "enabled" : "disabled")} onClick={this.props.onClick ? (e)=>{this.props.onClick(this.toggleState(),this.props.tag) } : null}>{this.props.tag.label}</span>
		)
	}
}


class Tags  extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {};
	}
	
	render() {		
		var reacttags = [];
		
		reacttags = this.props.tags.map((tag) => {
			return ( <Tag onClick={this.props.onClick} key={tag.name} tag={tag}/>)


		});		
		
		return (reacttags ?
			<div id="taglist">
					{reacttags}
			</div> : null
		)
	}
}
	
export {Tag, Tags, hasTag, getTags}