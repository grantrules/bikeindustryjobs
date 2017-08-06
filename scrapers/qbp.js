var Scraper = require('./Scraper');

class scraper extends Scraper.JSONScraper {
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://recruiting.ultipro.com/QUA1003QBP/JobBoard/4b01c3ed-7e54-43da-954f-c74c4b3945a6/JobBoardView/LoadOpportunities';
		this.listprop = "opportunities";
		this.baseurl = "https://recruiting.ultipro.com/QUA1003QBP/JobBoard/4b01c3ed-7e54-43da-954f-c74c4b3945a6/OpportunityDetail?opportunityId=";
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