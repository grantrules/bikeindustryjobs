import React from 'react';

import { Login, Logout, RecoverPassword, Register } from '../components/User';

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
				<Login setUserData={this.props.setUserData}/>
				<Register setUserData={this.props.setUserData}/>
			</div>
		)
	}
}

export { UserLogin }