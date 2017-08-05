import React from 'react';


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
	
export {Tag, Tags}