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
	GooglePlusShareButton,
	LinkedinShareButton,
	TwitterShareButton,
	TelegramShareButton,
	WhatsappShareButton,
	PinterestShareButton,
	VKShareButton,
	OKShareButton,
	RedditShareButton,
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
		<ul>
			<li><span role="img" aria-label="Number of employees">👨‍💼</span> 50-150 Employees</li>
			<li><span role="img" aria-label="Founded">📅</span> Founded 2003</li>
			<li><span role="img" aria-label="Headquarters">🏢</span> Headquarters: London, UK</li>
			<li><span role="img" aria-label="Industry">🏭</span> Fashion</li>
			</ul>
		</section>
		<section className="jobdata">
			<h1>{job.title}</h1>
			<div className="buttons">
				<a className="tagblap" href="#apply">Apply</a>
				<a className="tagblap" href="#share">Share</a>
				<FacebookShareButton
            url={window.location.href}
            quote={job.title}
            className="Demo__some-network__share-button">
            <FacebookIcon
              size={32}
              round />
          </FacebookShareButton>
		  <EmailShareButton
            url={window.location.href}
            subject={job.title}
            body="body"
            className="Demo__some-network__share-button">
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
		<SlideHeader logout={props.logout} user={props.user}/>
		<JobList {...props} onJobClick={()=>{window.scrollTo(0,0)}} company={company.company} initLoad="1"/>
	</main>
	</section>
);

export { Job }