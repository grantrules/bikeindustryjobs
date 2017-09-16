import React from 'react';
import { html, safeHtml } from 'common-tags';


const Job = ({ job, company }) => (
	<div>
		{company.logo ?
			<img alt="" className="logo" src={company.logo}/>
			:
			<strong>{company.title}</strong>
		}

		<div className="jobdata">
			{job.title}

			<div className="location">
				{job.location || company.location}
			</div>

			<div className="description">
				<a href={job.url}>View and apply on company website</a>
				<div className="descriptiontext"
					dangerouslySetInnerHTML={{__html: html`${safeHtml`${job.description}` }`}}/>
			</div>			
		</div>
	</div>
);

export { Job }