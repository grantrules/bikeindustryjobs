var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'http://pages.rapha.cc/jobs';
		this.listscraper = {
			urls: {
				listItem: ".jobs-block",
				data: {
					url: {
						selector: "a",
						attr: "href"
					},
					location: {
						selector: "p"
					}
				}
			}
		};
		this.relativelinks = false;
		this.jobscraper = {
			title: { selector: "h1.app-title"},
			description: { selector: "#content", how: "html" }
		};
	}
}

module.exports = scraper;
