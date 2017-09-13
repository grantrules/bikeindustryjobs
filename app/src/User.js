import React from 'react';
import AuthService from './services/auth';

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
			<div>
				<Login/>
				<Register/>
			</div>
		)
	}
}

class Logout extends React.Component {

    render() {
        return (
            <button onClick={this.props.logoutCallback}>Log Out</button>
        )
    }

}

class Login extends React.Component {
    
        loginCallback(err,user) {
            if (err) {
                console.log(err.blob());
            } else {
                console.log(`logged in ${user}`);
            }
        }
    
        handleSubmit(event) {
            event.preventDefault();
            const data = new FormData(event.nativeEvent.target);
            for (var v of data) {
                console.log(v);
            }
            AuthService.login(data,this.loginCallback.bind(this));
    
        }
    
        render() {
            return (
                <form className="userForm" id="loginForm" onSubmit={this.handleSubmit.bind(this)}>
                    <label htmlFor="email">Email </label><input id="email" name="email" type="email" placeholder="email"/>
                    <label htmlFor="password">Password </label><input id="password" name="password" type="password"/>
                    <button type="submit">Log in</button>
                </form>
            )
        }
    }

    class RecoverPassword extends React.Component {

    }

    class Register extends React.Component {
        
        registerCallback(err,user) {
            if (err) {
                console.log(err);
            } else {
                console.log(`logged in ${user}`);
            }
        }
    
        handleSubmit(event) {
            event.preventDefault();
            const data = new FormData(event.nativeEvent.target);
            for (var v of data) {
                console.log(v);
            }
            AuthService.register(data,this.registerCallback.bind(this));
    
        }
    
        render() {
            return (
                <form className="userForm" id="registerForm" onSubmit={this.handleSubmit.bind(this)}>
                    <label htmlFor="registerFirstName">First Name </label><input id="registerFirstName" name="first_name" type="text"/>
                    <label htmlFor="registerLastName">Last Name </label><input id="registerLastName" name="last_name" type="text"/>
                    <label htmlFor="registerEmail">Email </label><input id="registerEmail" name="email" type="email"/>
                    <label htmlFor="registerPassword">Password </label><input id="registerPassword" name="password" type="password"/>
                    <label htmlFor="registerPasswordConfirm">Confirm Password </label><input id="registerPasswordpasswordConfirm" name="passwordConfirm" type="password"/>
                    <button type="submit">Register</button>
                </form>
            )
        }
    }

    export { UserLogin }