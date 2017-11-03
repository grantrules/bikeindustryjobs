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

class Editable extends React.Component {

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
            [name]: value
        });
    }
    
}

class AddCompany extends Editable {

    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateLogo = this.updateLogo.bind(this);
        this.state = {};

        if (props.company) {
            var c = props.company;
            var d = {} 
            if (c) {
                d = c.details || {};
            }
            this.state = {
                title: c.title || "",
                location: c.location || "",
                website: c.website || "",
                about: c.about || "",
                logo: c.logo || "",
                numEmployees: d.numEmployees || "",
                founded: d.founded || "",
                industry: d.industry || "",
                headquarters: d.headquarters || ""
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
            CompanyService.updateCompany(this.props.company.company, data, (err,company) => {
                //alert(err||company);
            });
        } else {
            CompanyService.postCompany(data, (err,company) => {
               // alert(err||company);
            })        
        }
    }

    render() {
        var company = this.state;
        return (
            <section id="addCompany">
                <h2>{this.props.company && `Edit ${this.props.company.title}`}{!this.props.company && "Add company"}</h2>
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
                            <input id="companyNumEmployees" name="numEmployees" type="text" value={company.numEmployees} onChange={this.handleInputChange}/>

                            <label htmlFor="companyFounded">Year Founded </label>
                            <input id="companyFounded" name="founded" type="text" value={company.founded} onChange={this.handleInputChange}/>

                            <label htmlFor="companyIndustry">Industry </label>
                            <input id="companyIndustry" name="industry" type="text" value={company.industry} onChange={this.handleInputChange}/>

                            <button type="submit">{this.props.company && "Save"}{!this.props.company && "Add"} Company</button>
                </form>
            </section>
        )
    }
}

class AddJob extends Editable {

    constructor(props) {
        super(props);
        var job = props.job || {};
        this.state = {
            title: job.title || "",
            location: job.location || "",
            url: job.url || "",
            email: job.email || "",
            description: job.description || ""
        }
        this.handleInputChange = this.handleInputChange.bind(this);
    }
    

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.nativeEvent.target);
        if (this.props.job) {
            JobService.updateJob(this.props.job._id, data, (err,job) => {
                alert(err||job)
            })
        } else {
            JobService.postJob(data, (err,company) => {
                alert(err||company);
            })
        }        

    }

    render() {
        var props = this.props;
        return (
            <section id="addJob">
                <h2>{props.job && `Edit ${props.job.title}`}{!props.job && `Add job for ${props.company}`}</h2>
                <form className="jobForm" id="jobForm" onSubmit={this.handleSubmit.bind(this)}>

                            <input type="hidden" name="company" value={props.company}/>

                            <label htmlFor="jobName">Job Title </label>
                            <input id="jobName" name="title" type="text" value={this.state.title} onChange={this.handleInputChange}/>

                            <label htmlFor="jobLocation">Location </label>
                            <input id="jobLocation" name="location" type="text" value={this.state.location} onChange={this.handleInputChange}/>

                            <label>Please enter at least one way to apply</label>
                            <label htmlFor="jobUrl">Job Application URL</label>
                            <input id="jobUrl" name="url" type="text" value={this.state.url} onChange={this.handleInputChange}/>

                            <label htmlFor="jobEmail">Job Application Email</label>
                            <input id="jobEmail" name="email" type="text" value={this.state.email} onChange={this.handleInputChange}/>

                            <label htmlFor="jobDescription">Job Description (HTML okay)</label>
                            <textarea id="jobDescription" name="description" value={this.state.description} onChange={this.handleInputChange}/>

                            <button type="submit">{props.job && "Save"}{!props.job && "Add"} Job</button>
                </form>
            </section>
        )
    }
}

const Profile = ({setUserData}) => (
    <section class="profile">
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
                company => (<li><Link to={`/profile/company/${company.company}`}>{company.title}</Link> - <Link to={`/profile/company/${company.company}/edit`}>edit</Link></li>)
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
                job => (<li><Link to={`/profile/job/${job._id}/edit`}>{job.title}</Link></li>)
            )}
        </ul>
        <Link className="btn btn-primary" to={`/profile/company/${company}/add`}>Add job</Link>

        </section>
    )
}




export { UserProfile }