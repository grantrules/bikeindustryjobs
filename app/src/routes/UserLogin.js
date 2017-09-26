import React from 'react';
import { withRouter, Route, Link } from 'react-router-dom';

import { Login, Logout, RecoverPassword, Register } from '../components/User';
import SVGLogo from '../components/SVGLogo';

const HistoryLink = withRouter(({history, ...props}) => {

	var redirect_uri = `${window.location.protocol}//${window.location.host}/auth/${props.strategy}?redirect_to=${encodeURIComponent(props.last_url)}`
	var link = `https://www.strava.com/oauth/authorize?client_id=20313&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=write&state=mystate&approval_prompt=force`

	return (<a className="auth strava" href={link}>Log in with Strava</a>);


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
		if (this.state.user) {
			return ( <Logout logoutCallback={this.logout.bind(this)}/> )
		}

		return (
			<section className="login">
				<div className="logocenter">
				<SVGLogo/>
				</div>
				<Route exact={true} path="/login" render={() => (
					<LoginFrag setUserData={this.props.setUserData}/>
				)}/>
				<Route exact={true} path="/login/register" render={() => (
					<RegisterFrag setUserData={this.props.setUserData}/>
				)}/>
				<Route exact={true} path="/login/recover" render={() => (
					<RecoverPassword/>
				)}/>
				
			</section>
		)
	}
}

const LoginFrag = ({setUserData}) => (
	<div>
		<HistoryLink strategy="strava"/>
		<Login setUserData={setUserData}/>
		<Link to="/login/recover">Forgot password?</Link>
		<Link className="register" to="/login/register">Register with email</Link>
	</div>

)

const RegisterFrag = ({setUserData}) => (
	<Register setUserData={setUserData}/>
)

export { UserLogin }