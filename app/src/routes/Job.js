import React from 'react';
import { html, safeHtml } from 'common-tags';
import JobList from '../components/JobList';
import { SlideHeader, RegularHeader } from '../components/SlideHeader';



const Job = ({ job, company, ...props }) => (
	<section>
    <RegularHeader {...props}/>
	<main className="jobpage main">
		<section className="companydata">
		{company.logo ?
			<img alt={`${company.title} logo`} className="logo" src={company.logo}/>
			:
			<h2 className="logo">{company.title}</h2>
		}
		<ul>
			<li>👨‍💼 50-150 Employees</li>
			<li>📅 Founded 2003</li>
			<li>🏢 Headquarters: London, UK</li>
			<li>🏭 Fashion</li>
			</ul>
		</section>
		<section className="jobdata">
			<h1>{job.title}</h1>
			<div className="buttons">
				<a className="tagblap" href="#">Apply</a>
				<a className="tagblap" href="#">Share</a>
			</div>

			<div className="location">
				{job.location || company.location}
			</div>

			<div className="description">
				<a href={job.url}>View and apply on company website</a>
				<div className="descriptiontext"
					dangerouslySetInnerHTML={{__html: html`${job.description}`}}/>
			</div>			
		</section>
		<SlideHeader logout={props.logout} user={props.user}/>
		<JobList {...props} onJobClick={()=>{window.scrollTo(0,0)}} company={company.company} initLoad="1"/>
	</main>
	</section>
);

export { Job }