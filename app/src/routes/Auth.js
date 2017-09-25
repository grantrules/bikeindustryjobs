
import queryString from 'query-string';
import React from 'react';
import { withRouter } from 'react-router-dom';

import AuthService from '../services/auth';

// OAUTH2 callback sends state/code to API server & gets JWT
class AuthRoute extends React.Component {


    componentDidMount() {

        var strategy = this.props.match.params.strategy;
        
        var { state, code, redirect_to } = queryString.parse(this.props.location.search);
    
        AuthService.oauth2login(strategy, state, code, (err, data) => {
            if (err || !data.user) {
                console.log(`error logging in oauth via ${strategy}`);
            } else {
                this.props.setUserData(data);
                this.props.history.push("/");
            }
        })
    }



    render() {
        return null;
    }
}

export default withRouter(AuthRoute);