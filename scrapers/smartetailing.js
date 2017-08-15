var Scraper = require('./Scraper');

class scraper extends Scraper.JSONScraper {
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://recruiting.ultipro.com/QUA1003QBP/JobBoard/0a11c700-8c72-42cc-bea0-d774f5014673/JobBoardView/LoadOpportunities';
		this.listprop = "opportunities";
		this.baseurl = "https://recruiting.ultipro.com/QUA1003QBP/JobBoard/0a11c700-8c72-42cc-bea0-d774f5014673/OpportunityDetail?opportunityId=";
		this.relativelinks = true;
	}
	
	getJobData(job) {
		return {
			url: this.getFullUrl(job.Id),
			title: job.Title,
			description: job.BriefDescription,
			company: this.company,
			location:job.Locations.map(e=>e.LocalizedName).join(", "),
			last_seen: new Date(),
		}
	}
	
}

module.exports = scraper;