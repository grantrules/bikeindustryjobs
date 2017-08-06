var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://www.fitzii.com/careers/cervelo/';
		this.baseurl = 'https://www.fitzii.com';
		this.listscraper = {
					urls: {
						listItem: "#jtable_body tr td:first-child",
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
			title: { selector: ".cutout_text"},
			description: { selector: "#description", how: "html" },		
		}
	}
}

module.exports = scraper;