import React from 'react';
import { withRouter, Route, Link } from 'react-router-dom';

import SVGLogo from '../../components/SVGLogo';

import CompanyService from '../../services/companies';
import JobService from '../../services/jobs';


import AddJob from './AddJob'
import AddCompany from './AddCompany'



class UserProfile extends React.Component {
	constructor(props) {
        super(props);
        this.state = {}
    }
    
    componentDidMount() {
        CompanyService.getMyCompanies((err,usercompanies) => {
            this.setState({usercompanies})
        })

    }

	render() {
		if (this.props.user && this.state.usercompanies) {
			return (
                <div id="loginBg">
                <section className="profile">
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

                    <Route exact={true} path="/profile/company/:company" render={({match}) => (
                        <ListJobs company={match.params.company} {...this.props}/>
                    )}/>

                    <Route exact={true} path="/profile/company/:company/add" render={({match}) => (
                        <AddJob company={match.params.company} {...this.props}/>
                    )}/>
                    <Route exact={true} path="/profile/job/:id/edit" render={({match}) => {
                        var job = this.props.jobs.find(g => g._id === match.params.id);
                                                            
                        return <AddJob job={job} {...this.props}/>
                    }}/>


                    <Route exact={true} path="/profile/company/:company/edit" render={({match}) => {
                        var company = this.props.companies.find(g => g.company === match.params.company);
                                                            
                        return <AddCompany company={company} {...this.props}/>
                    }}/>
                    
                </section>
                </div>
            )
        } else {
            return (<div>Not logged in</div>);
        }
	}
}

const ManageJobs = ({...props}) => (
    <section>
        <ListCompanies usercompanies={props.usercompanies} companies={props.companies}/>
    </section>
)







const Profile = ({setUserData}) => (
    <section>
        <h2>Your account</h2>
        <ul>
            <li><Link to="/profile/saved">View your saved jobs</Link></li>
            <li><Link to="/profile/manage">Manage job postings</Link></li>
        </ul>
    </section>
)

const ListCompanies = ({usercompanies, companies}) => (
	<div>
        <h2>Your managed companies</h2>
        <ul>
            {!usercompanies &&
                <li>No companies</li>}
            {usercompanies.map(
                company => (<li key={company.company}><Link to={`/profile/company/${company.company}`}>{company.title}</Link> - <Link to={`/profile/company/${company.company}/edit`}>edit</Link></li>)
            )}

        </ul>
        <Link className="btn btn-primary" to="/profile/manage/newcompany">Add Company</Link>

	</div>

)

const ListJobs = ({company, companies, jobs}) => {

   jobs = jobs.filter(j => j.company === company);
   var c = companies.find(d => d.company === company)

    return (
        <section>
            <h2>Jobs for {c.title}</h2>
        <ul>
            {!jobs &&
                <li>No jobs</li>
            }
            {jobs.map(
                job => (<li key={job._id}><Link to={`/profile/job/${job._id}/edit`}>{job.title}</Link></li>)
            )}
        </ul>
        <Link className="btn btn-primary" to={`/profile/company/${company}/add`}>Add job</Link>

        </section>
    )
}




export { UserProfile }