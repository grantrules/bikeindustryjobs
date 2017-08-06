var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://us851.dayforcehcm.com/CandidatePortal/en-US/motivate';
		this.baseurl = 'https://us851.dayforcehcm.com';
		this.listscraper = {
			urls: {
				listItem: ".search-result",
				data: {
					url: {
						selector: ".posting-title a",
						attr: "href"
					},
					title: { selector: ".posting-title a" },
					description: { selector: ".posting-description" },
					location: { selector: ".posting-location"}
				}
			}
		};
		this.relativelinks = true;
	}
}

module.exports = scraper;
