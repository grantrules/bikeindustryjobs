var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'http://www.bike.nyc/jobs/';
		this.listscraper = {
					urls: {
						listItem: ".inner p",
						data: {
							url: {
								selector: "a",
								attr: "href"
							}
						}
					}
		 };
		this.relativelinks = false;
		this.jobscraper = {
			title: { selector: ".cutout_text", convert: x => x.replace("Job Description: ","")},
			description: { selector: ".column", how: "html" },		
		}
	}
}

module.exports = scraper;