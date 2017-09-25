import React from 'react';
import { withRouter } from 'react-router-dom';

import { Login, Logout, RecoverPassword, Register } from '../components/User';

const HistoryLink = withRouter(({history, ...props}) => {

	var redirect_uri = `http://localhost:3000/auth/${props.strategy}?redirect_to=${encodeURIComponent(props.last_url)}`
	var link = `https://www.strava.com/oauth/authorize?client_id=20313&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=write&state=mystate&approval_prompt=force`
	console.log(history)

	return (<a href={link}>Strava</a>);


})

class UserLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = props;
	}

	logout() {
		if (this.state.user
			&& this.state.user.logout()) {
				this.state.setUser(null);
		}
	}

	render() {
        console.log(this.props.route);
		if (this.state.user) {
			return ( <Logout logoutCallback={this.logout.bind(this)}/> )
		}

		return (
			<div>
				<HistoryLink strategy="strava"/>
				<Login setUserData={this.props.setUserData}/>
				<Register setUserData={this.props.setUserData}/>
			</div>
		)
	}
}

export { UserLogin }