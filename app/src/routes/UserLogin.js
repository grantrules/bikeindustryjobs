import React from 'react';
import { withRouter, Route, Link } from 'react-router-dom';

import { Login, Logout, RecoverPassword, Register } from '../components/User';
import SVGLogo from '../components/SVGLogo';

const HistoryLink = withRouter(({history, ...props}) => {
	var domain = `${window.location.protocol}//${window.location.host}`;
	var redirectAfterAuth = props.last_url || domain;
	var redirect_uri = `${domain}/auth/${props.strategy}?redirect_to=${encodeURIComponent(redirectAfterAuth)}`
        var link = `https://www.strava.com/oauth/authorize?client_id=20313&response_type=code&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=read&state=mystate&approval_prompt=force`

	return (<a className="auth strava" href={link}>Log in with Strava</a>);


})

class UserLogin extends React.Component {
	constructor(props) {
		super(props);
		this.state = props;
		this.error = this.error.bind(this);
	}

	logout() {
		if (this.state.user
			&& this.state.user.logout()) {
				this.state.setUser(null);
		}
	}

	error(error) {
		this.setState({error});
	}

	render() {
		if (this.state.user) {
			return ( <Logout logoutCallback={this.logout.bind(this)}/> )
		}

		return (
			<div id="loginBg">
			<section className="login">
				<div className="logocenter">
				<SVGLogo/>
				</div>
				{this.state.error &&
					<div className="error"><span role="img" aria-label="error">⚠️</span> {this.state.error}</div>}
				<Route exact={true} path="/login" render={() => (
					<LoginFrag setUserData={this.props.setUserData} error={this.error}/>
				)}/>
				<Route exact={true} path="/login/register" render={() => (
					<RegisterFrag error={this.error} setUserData={this.props.setUserData}/>
				)}/>
				<Route exact={true} path="/login/recover" render={() => (
					<RecoverPassword/>
				)}/>
				
			</section>
			</div>
		)
	}
}

const LoginFrag = ({setUserData, error}) => (
	<div>
		<HistoryLink strategy="strava"/>
		<Login setUserData={setUserData} error={error}/>
		<Link to="/login/recover">Forgot password?</Link>
		<Link className="register" to="/login/register">Register with email</Link>
	</div>

)

const RegisterFrag = ({setUserData, error}) => (
	<Register setUserData={setUserData} error={error}/>
)

export { UserLogin }
