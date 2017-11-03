import React from 'react';
import { /*withRouter,*/ Route, Link } from 'react-router-dom';

import SVGLogo from '../components/SVGLogo';

import CompanyService from '../services/companies';
import JobService from '../services/jobs';

import ReactS3Uploader from 'react-s3-uploader';


class UserProfile extends React.Component {
	constructor(props) {
        super(props);
        this.state = {};
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

                    <Route exact={true} path="/profile/company/:company" render={({match}) => (
                        <ListJobs company={match.params.company} {...this.props}/>
                    )}/>

                    <Route exact={true} path="/profile/company/:company/add" render={({match}) => (
                        <AddJob company={match.params.company} {...this.props}/>
                    )}/>
                    <Route exact={true} path="/profile/company/:company/edit" render={({match}) => {
                        var company = this.props.companies.find(g => g.company === match.params.company);
                                                            
                        return <AddCompany company={company} {...this.props}/>
                    }
                    }/>
                    
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


class AddCompany extends React.Component {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateLogo = this.updateLogo.bind(this);

        if (props.company) {
            var c = props.company;
            var d = {} 
            if (c) {
                d = c.details || {};
            }
            this.state = {
                title: c.title,
                location: c.location,
                website: c.website,
                about: c.about,
                logo: c.logo,

                details: {
                    numEmployees: d.numEmployees,
                    founded: d.founded,
                    industry: d.industry,
                    headquarters: d.headquarters
                }

            }
        }
    }

    updateLogo(data) {
        alert(data.fileName);
        this.setState({logo: data.fileName});
    }
    
    

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.nativeEvent.target);
        if (this.props.company) {
            CompanyService.updateCompany(this.props.company._id, data, (err,company) => {
                alert(err||company);
            });
        } else {
            CompanyService.postCompany(data, (err,company) => {
                alert(err||company);
            })        
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
            [name]: value
        });
    }

    render() {
        var company = this.state;
        var details = {};
        if (company) {
            details = company.details || {};
        }
        return (
            <section id="addCompany">
                <form className="companyForm" id="companyForm" onSubmit={this.handleSubmit.bind(this)}>
                            <label htmlFor="companyName">Company Name </label>
                            <input id="companyName" name="title" type="text" value={company.title} onChange={this.handleInputChange}/>

                            <label htmlFor="companyLocation">Location </label>
                            <input id="companyLocation" name="location" type="text" value={company.location} onChange={this.handleInputChange}/>

                            <label htmlFor="companyWebsite">Website URL </label>
                            <input id="companyWebsite" name="website" type="text" value={company.website} onChange={this.handleInputChange}/>

                            <label htmlFor="companyAbout">Short Description </label>
                            <textarea id="companyAbout" name="about" value={company.about} onChange={this.handleInputChange}/>


                            {company.logo &&
                                <img alt="Company logo" className="edit-logo" src={company.logo}/>
                            }
                            <label htmlFor="companyLogo">Company Logo </label>
                            <ReactS3Uploader
                                signingUrl="http://localhost:9004/api/imageUploadUrl"
                                signingUrlMethod="GET"
                                signingUrlHeaders={{"Authorization": `BEARER ${localStorage.getItem('jwt')}`}}
                                accept="image/*"
                                scrubFilename={(filename) => `${(new Date()).getMilliseconds()}${filename}`.replace(/[^\w\d_\-.]+/ig, '')}
                                uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                                contentDisposition="auto"
                                onFinish={this.updateLogo}
                            />
                            <input id="companylogo" type="hidden" name="logo" value={company.logo} onChange={this.handleInputChange}/>

                            <label htmlFor="companyNumEmployees">Number of Employees </label>
                            <input id="companyNumEmployees" name="numEmployees" type="text" value={details.numEmployees} onChange={this.handleInputChange}/>

                            <label htmlFor="companyFounded">Year Founded </label>
                            <input id="companyFounded" name="founded" type="text" value={details.founded} onChange={this.handleInputChange}/>

                            <label htmlFor="companyIndustry">Industry </label>
                            <input id="companyIndustry" name="industry" type="text" value={details.industry} onChange={this.handleInputChange}/>

                            <button type="submit">{company && "Save"}{!company && "Add"} Company</button>
                </form>
            </section>
        )
    }
}

class AddJob extends React.Component {
    

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.nativeEvent.target);
        JobService.postJob(data, (err,company) => {
            alert(err||company);
        })        

    }

    render() {
        var props = this.props;
        return (
            <section id="addCompany">
                <form className="companyForm" id="companyForm" onSubmit={this.handleSubmit.bind(this)}>

                            <input type="hidden" name="company" value={props.company}/>

                            <label htmlFor="jobName">Job Title </label>
                            <input id="jobName" name="title" type="text"/>

                            <label htmlFor="jobLocation">Location </label>
                            <input id="jobLocation" name="location" type="text"/>

                            <label htmlFor="jobDescription">Job Description </label>
                            <textarea id="jobDescription" name="description" type="text"></textarea>

                            <button type="submit">Add Job</button>
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
                company => (<li><Link to={`/profile/company/${company.company}`}>{company.title}</Link> - <Link to={`/profile/company/${company.company}/edit`}>edit</Link></li>)
            )}

            <li><Link to="/profile/manage/newcompany">Add Company</Link></li>
        </ul>
	</div>

)

const ListJobs = ({company, companies, jobs}) => {

   jobs = jobs.filter(j => j.company === company);

    return (
        <ul>
            {!jobs &&
                <li>No jobs</li>
            }
            {jobs.map(
                job => (<li><Link to={`/profile/job/${job._id}`}>{job.title}</Link></li>)
            )}
            <li><Link to={`/profile/company/${company}/add`}>Add job</Link></li>
        </ul>
    )
}




export { UserProfile }