import React from 'react';
import { html } from 'common-tags';
import JobList from '../components/JobList';
import { SlideHeader, RegularHeader } from '../components/SlideHeader';
import {
	ShareButtons,
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
			<img alt={`${company.title} logo`} className="company-logo" src={company.logo}/>
			:
			<h2>{company.title}</h2>
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

				{job.url &&
				<a className="tagblap" href={job.url}>Apply</a>}

				{job.email &&
					<a className="tagblap" href={`mailto:${job.email}`}>Apply by Email</a>}
				
				<FacebookShareButton
            		url={window.location.href}
					quote={`Position available: ${job.title} at ${company.title}`}
					className="facebook-share share-button">
					<FacebookIcon
						size={24}
						square />
				</FacebookShareButton>
				<EmailShareButton
					url={window.location.href}
					subject={`Position available: ${job.title} at ${company.title}`}
					body={window.location.href}
					className="email-share share-button">
					<EmailIcon
						size={24}
						square />
				</EmailShareButton>
			</div>

			<div className="location">
				{job.location || company.location}
			</div>

			<div className="description">
				<div className="descriptiontext"
					dangerouslySetInnerHTML={{__html: html`${job.description}`}}/>
			</div>			
		</section>

		{company.about &&
		<section className="companyInfo">
			<h3>About {company.title}</h3>
			<p
				dangerouslySetInnerHTML={{__html: company.about}}/>
		</section>}

		<section className="otherJobs">
			<SlideHeader logout={props.logout} user={props.user}/>
			<h2>More jobs from {company.title}</h2>
			<JobList {...props} onJobClick={()=>{window.scrollTo(0,0)}} company={company.company} initLoad="1"/>
		</section>
	</main>
	</section>
);

export { Job }