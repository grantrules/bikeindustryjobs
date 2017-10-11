var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://ridewithgps.com/careers';
		this.baseurl = 'https://ridewithgps.com';
		this.listscraper = {
					urls: {
						listItem: ".position",
						data: {
							url: {
								selector: "a",
								attr: "href"
							}
						}
					}
		 };
		this.relativelinks = true;
		this.jobscraper = {
			title: { selector: ".text"},
			description: { selector: ".body", how: "html" },		
		}
	}
}

module.exports = scraper;