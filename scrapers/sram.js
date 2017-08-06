var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://www.sram.com/company/jobs';
		this.baseurl = 'https://www.sram.com';
		this.listscraper = {
			urls: {
				listItem: ".field-content",
				data: {
					url: {
						selector: "a",
						attr: "href"
					},
				}
			}
		};
		this.relativelinks = true;
		this.jobscraper = {
			title: { selector: "#content h3", eq:0},
			description: { selector: "#content", how: "html" },
			location : { selector: ".field-name-field-job-location .field-item" }
		};
	}
}

module.exports = scraper;
