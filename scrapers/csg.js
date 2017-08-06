var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'http://chm.tbe.taleo.net/chm02/ats/careers/searchResults.jsp?org=CYCLINGSPORTSGROUP&cws=1';
		this.listscraper = {
				urls: {
					listItem: ".top a",
					data: {
						url: {
							attr: "href"
						}
					}
				}
	 	};
		this.relativelinks = false;
		this.jobscraper = {
			title: { selector: "h1", eq: 0},
			description: { selector: "tr:nth-child(9)", how: "html" },
			location: { selector: "b", how:"html" , eq: 0 }
		};
	}
}

module.exports = scraper;