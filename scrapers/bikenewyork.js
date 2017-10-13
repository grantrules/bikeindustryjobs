var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'http://www.bike.nyc/jobs/';
		this.listscraper = {
					urls: {
						listItem: ".paragraph p",
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
			title: { selector: "title", convert: x => x.replace(" | Bike New York","")},
			description: { selector: ".layoutArea", how: "html" },		
		}
	}
}

module.exports = scraper;