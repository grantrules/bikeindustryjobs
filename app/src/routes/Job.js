import React from 'react';
import { html, safeHtml } from 'common-tags';
import JobList from '../components/JobList';
import { SlideHeader } from '../components/SlideHeader';



const Job = ({ job, company, ...props }) => (
	<article className="jobpage">
		{company.logo ?
			<img alt={`${company.title} logo`} className="logo" src={company.logo}/>
			:
			<h2>{company.title}</h2>
		}

		<div className="jobdata">
			<h1>{job.title}</h1>

			<div className="location">
				{job.location || company.location}
			</div>

			<div className="description">
				<a href={job.url}>View and apply on company website</a>
				<div className="descriptiontext"
					dangerouslySetInnerHTML={{__html: html`${job.description}`}}/>
			</div>			
		</div>
		<SlideHeader/>
		<JobList {...props} onJobClick={()=>{window.scrollTo(0,0)}} company={company.company} initLoad="1"/>
	</article>
);

export { Job }