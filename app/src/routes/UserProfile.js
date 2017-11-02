import React from 'react';
import { /*withRouter,*/ Route, Link } from 'react-router-dom';

import SVGLogo from '../components/SVGLogo';

import CompanyService from '../services/companies';


class UserProfile extends React.Component {
	constructor(props) {
        super(props);
        this.state = {};
    }
    
    componentDidMount() {
        CompanyService.getMyCompanies((err,usercompanies) => {
            console.log(`companies ${usercompanies}`);
            this.setState({usercompanies})
        })

    }

	render() {
		if (this.props.user && this.state.usercompanies) {
			return (
                <div id="loginBg">
                <section className="login">
                    <div className="logocenter">
                    <SVGLogo/>
                    </div>
                    <Route exact={true} path="/profile" render={() => (
                        <Profile setUserData={this.props.setUserData}/>
                    )}/>
                    <Route exact={true} path="/profile/manage" render={() => (
                        <ManageJobs usercompanies={this.state.usercompanies} {...this.props}/>
                    )}/>
                    <Route exact={true} path="/profile/manage/newcompany" render={() => (
                        <AddCompany {...this.props}/>
                    )}/>
                    
                </section>
                </div>
            )
        }
        return (<div>Not logged in</div>);
	}
}

const ManageJobs = ({...props}) => (
    <section>
        <ListCompanies usercompanies={props.usercompanies} companies={props.companies}/>

        <ListJobs usercompanies={props.usercompanies} jobs={props.jobs} companies={props.companies}/>
    </section>
)


class AddCompany extends React.Component {
    

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.nativeEvent.target);
        CompanyService.postCompany(data, (err,company) => {
            alert(err||company);
        })        

    }

    render() {
        var props = this.props;
        return (
            <section id="addCompany">
                <form className="companyForm" id="companyForm" onSubmit={this.handleSubmit.bind(this)}>
                            <label htmlFor="companyName">Company Name </label>
                            <input id="companyName" name="title" type="text"/>

                            <label htmlFor="companyLocation">Location </label>
                            <input id="companyLocation" name="location" type="text"/>

                            <label htmlFor="companyWebsite">Website URL </label>
                            <input id="companyWebsite" name="website" type="text"/>

                            <label htmlFor="companyAbout">Short Description </label>
                            <textarea id="companyAbout" name="about"></textarea>

                            <label htmlFor="companyLogo">Company Logo </label>
                            <input id="companyLogo" name="logo" type="file"/>

                            <label htmlFor="companyNumEmployees">Number of Employees </label>
                            <input id="companyNumEmployees" name="numEmployees" type="text"/>

                            <label htmlFor="companyFounded">Year Founded </label>
                            <input id="companyFounded" name="founded" type="text"/>

                            <label htmlFor="companyIndustry">Industry </label>
                            <input id="companyIndustry" name="industry" type="text"/>

                            <button type="submit">Add Company</button>
                </form>
            </section>
        )
    }
}

const Profile = ({setUserData}) => (
    <ul>
        <li><Link to="/profile/saved">View your saved jobs</Link></li>
        <li><Link to="/profile/manage">Post a job</Link></li>
    </ul>
)

const ListCompanies = ({usercompanies, companies}) => (
	<div>
        <ul>
            {!usercompanies &&
                <li>No companies</li>}
            {usercompanies.map(
                company => (<li>{company.title}</li>)
            )}

            <li><Link to="/profile/manage/newcompany">Add Company</Link></li>
        </ul>
	</div>

)

const ListJobs = ({company, companies, jobs}) => {

   var jobs = jobs.filter(j => j.company === company);

    return (
        <ul>
            
        </ul>
    )
}




export { UserProfile }