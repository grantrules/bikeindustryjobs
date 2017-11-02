import React from 'react';
import { html, /* safeHtml */ } from 'common-tags';
import JobList from '../components/JobList';
import { SlideHeader, RegularHeader } from '../components/SlideHeader';
import {
	ShareButtons,
	ShareCounts,
	generateShareIcon
} from 'react-share';

const {
	FacebookShareButton,
	EmailShareButton,
  } = ShareButtons;

  const FacebookIcon = generateShareIcon('facebook');
  const EmailIcon = generateShareIcon('email');
  
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
		{company.details &&
		<ul>
			{company.details.numEmployees && <li><span role="img" aria-label="Number of employees">👨‍💼</span> {company.details.numEmployees} Employees</li>}
			{company.details.founded && <li><span role="img" aria-label="Founded">📅</span> Founded {company.details.founded}</li>}
			{company.details.headquarters && <li><span role="img" aria-label="Headquarters">🏢</span> Headquarters: {company.details.headquarters}</li>}
			{company.details.industry && <li><span role="img" aria-label="Industry">🏭</span> {company.details.industry}</li>}
		</ul>
		}
		</section>
		<section className="jobdata">
			<h1>{job.title}</h1>
			<div className="buttons">
				<a className="tagblap" href={job.url}>Apply</a>
				{/*
				<a className="tagblap" href="#share">Share</a>
				*/}
				<FacebookShareButton
            		url={window.location.href}
					quote={`Position available: ${job.title} at ${company.title}`}
					className="facebook-share share-button">
					<FacebookIcon
						size={32}
						round />
				</FacebookShareButton>
				<EmailShareButton
					url={window.location.href}
					subject={`Position available: ${job.title} at ${company.title}`}
					body={window.location.href}
					className="email-share share-button">
					<EmailIcon
						size={32}
						round />
				</EmailShareButton>
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
		<section className="otherJobs">
			<SlideHeader logout={props.logout} user={props.user}/>
			<h2>More jobs from {company.company}</h2>
			<JobList {...props} onJobClick={()=>{window.scrollTo(0,0)}} company={company.company} initLoad="1"/>
		</section>
	</main>
	</section>
);

export { Job }