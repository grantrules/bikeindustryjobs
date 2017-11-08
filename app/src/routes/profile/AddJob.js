import React from 'react';
import ControlledForm from '../../components/ControlledForm'
import JobService from '../../services/jobs'
import RichTextEditor from 'react-rte';
import { withRouter } from 'react-router-dom';


class AddJob extends ControlledForm {
    
        constructor(props) {
            super(props);
            var job = props.job || {};
            if ( typeof job.description !== "undefined") {
                job.description = RichTextEditor.createValueFromString(job.description, 'html')
            } else {
                job.description = RichTextEditor.createEmptyValue()
            }
            this.state = {
                title: job.title || "",
                location: job.location || "",
                url: job.url || "",
                email: job.email || "",
                description: job.description,
            }
            this.handleInputChange = this.handleInputChange.bind(this);
        }
    
        handleSubmit(event) {
            event.preventDefault();
            this.state.description = this.state.description.toString("html");
            const data = new FormData();
            for ( var key in this.state ) {
                data.append(key, this.state[key]);
            }
    
            if (this.props.job) {
                JobService.updateJob(this.props.job._id, data, (err,job) => {
                    if (err) {
                        this.error("Error saving update");
                    } else {
                        // success add job
                    }
                })
            } else {
                JobService.postJob(data, (err,job) => {
                    if (err) {
                        this.error("Error saving update");
                    } else {
                        this.props.history.push(`/profile/company/${job.company}`);
                        // success new job
                    }
                })
            }        
    
        }
    
        handleEditorChange(value) {
            this.setState({description: value})
        }
    
        render() {
            var props = this.props;
            return (
                <section id="addJob">
                    <h2>{props.job && `Edit ${props.job.title}`}{!props.job && `Add job for ${props.company}`}</h2>
                    {this.state.error &&
                        <div className="error"><span role="img" aria-label="error">⚠️</span> {this.state.error}</div>}
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
    
                                <label htmlFor="jobDescription">Job Description</label>
                                <RichTextEditor id="jobDescription" name="description"
                                    value={this.state.description}
                                    onChange={this.handleEditorChange.bind(this)}
                                />
                                {/*
                                <textarea id="jobDescription" name="description" value={this.state.description} onChange={this.handleInputChange}/>
                                */}
    
                                <button type="submit">{props.job && "Save"}{!props.job && "Add"} Job</button>
                    </form>
                </section>
            )
        }
    }
    
    export default withRouter(AddJob);