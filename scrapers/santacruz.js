var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://www.santacruzbicycles.com/en-US/current-job-openings';
		this.listscraper = {
				urls: {
					listItem: ".article li",
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
			title: { selector: ".container h1", how: "text" },
			description: { selector: ".description", how: "html" }
		};
	}
}

module.exports = scraper;