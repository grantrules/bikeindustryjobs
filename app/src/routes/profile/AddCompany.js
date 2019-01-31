import React from 'react';
import ControlledForm from '../../components/ControlledForm'
import CompanyService from '../../services/companies'
import RichTextEditor from 'react-rte';
import { withRouter } from 'react-router-dom';
import ReactS3Uploader from 'react-s3-uploader';


class AddCompany extends ControlledForm {
    
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateLogo = this.updateLogo.bind(this);
        var c = {};
        var d = {} 
        

        if (props.company) {
            c = props.company;
            if (c) {
                d = c.details || {};
            }
        }
        
        if (typeof c.about !== "undefined") {
            c.about = RichTextEditor.createValueFromString(c.about, 'html')
        } else {
            c.about = RichTextEditor.createEmptyValue()
        }
        this.state = {
            title: c.title || "",
            location: c.location || "",
            website: c.website || "",
            about: c.about,
            logo: c.logo || "",
            numEmployees: d.numEmployees || "",
            founded: d.founded || "",
            industry: d.industry || "",
            headquarters: d.headquarters || ""
        }
    }

    updateLogo(data) {
        this.setState({logo: data.fileName});
    }
        
    handleSubmit(event) {
        event.preventDefault();
        this.state.about = this.state.about.toString("html");
        const data = new FormData();
        for ( var key in this.state ) {
            data.append(key, this.state[key]);
        }
        if (this.props.company) {
            CompanyService.updateCompany(this.props.company.company, data, (err,company) => {
                if (err) {
                    this.error("Error updating company");
                }
            });
        } else {
            CompanyService.postCompany(data, (err,company) => {
                if (company) {
                    console.log(company);
                    this.props.history.push(`/profile/company/${company.company}`);
                } else {
                    //this.error("Error saving company");
                }          
            })        
        }
    }

    handleEditorChange(value) {
        this.setState({about: value})
    }


    render() {
        var company = this.state;
        return (
            <section id="addCompany">
                <h2>{this.props.company && `Edit ${this.props.company.title}`}{!this.props.company && "Add company"}</h2>
                {this.state.error &&
                    <div className="error"><span role="img" aria-label="error">⚠️</span> {this.state.error}</div>}
                <form className="companyForm" id="companyForm" onSubmit={this.handleSubmit.bind(this)}>
                            <label htmlFor="companyName">Company Name </label>
                            <input id="companyName" name="title" type="text" value={company.title} onChange={this.handleInputChange}/>

                            <label htmlFor="companyLocation">Location </label>
                            <input id="companyLocation" name="location" type="text" value={company.location} onChange={this.handleInputChange}/>

                            <label htmlFor="companyWebsite">Website URL </label>
                            <input id="companyWebsite" name="website" type="text" value={company.website} onChange={this.handleInputChange}/>

                            <label htmlFor="companyAbout">Short Description </label>
                            <RichTextEditor id="companyAbout" name="about"
                                value={this.state.about}
                                onChange={this.handleEditorChange.bind(this)}
                            />
                            {/*<textarea id="companyAbout" name="about" value={company.about} onChange={this.handleInputChange}/>
                            */}

                            <label htmlFor="companyLogo">Company Logo </label>
                            <input id="companylogo" type="hidden" name="logo" value={company.logo} onChange={this.handleInputChange}/>

                            {company.logo &&
                                <img alt="Company logo" className="edit-logo" src={company.logo}/>
                            }
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

export default withRouter(AddCompany);