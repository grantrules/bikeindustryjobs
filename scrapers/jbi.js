var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'http://www.jbi.bike/site/careers.php',
		this.listscraper = {
				urls: {
					listItem: ".panel",
					data: {
						title: {
							selector: ".panel-title a",
						},
						url: {
							selector: "a",
							attr: "href"
						},
						location: {
							selector: "strong", eq: 0
						},
						description: {
							selector: ".panel-body", how: "html",
						}
					}
				}
	 	};
		this.relativelinks = true;
		this.baseurl = 'http://www.jbi.bike/site/careers.php';
	}
}

module.exports = scraper;