var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://jobs.jobvite.com/trek-bicycle/jobs?nl=1&nl=1';
		this.baseurl = 'https://jobs.jobvite.com';
		this.listscraper = {
			urls: {
				listItem: ".jv-job-list tr",
				data: {
					url: {
						selector: "a",
						attr: "href"
					},
					location: {
						selector: ".jv-job-list-location"
					}
				}
			}
		};
		this.relativelinks = true;
		this.jobscraper = {
			title: { selector: ".jv-header"},
			description: { selector: ".jv-job-detail-description", how: "html" }
		};
	}
}

module.exports = scraper;
