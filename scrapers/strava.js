var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://boards.greenhouse.io/strava';
		this.baseurl = 'https://boards.greenhouse.io/';
		this.listscraper = {
			urls: {
				listItem: ".opening",
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
			title: { selector: ".app-title" },
			description: { selector: "#content", how: "html" },
			location: { selector: ".location", how:"html" }
		};
	}
}

module.exports = scraper;