var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://www.specialized.com/us/en/careers';
		this.listscraper = {
			urls: {
				listItem: ".open li",
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
			title: { selector: ".app-title" },
			description: { selector: "#content", how: "html" },
			location: { selector: ".location", how: "text" }
		};
	}
}

module.exports = scraper;