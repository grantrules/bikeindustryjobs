var Scraper = require('./Scraper');

class scraper extends Scraper.HTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://www.dtswiss.com/About-DT-Swiss/Vacancies';
		this.baseurl = 'https://www.dtswiss.com';
		this.listscraper = {
			urls: {
				listItem: "article.teaser-text-img",
				data: {
					url: {
						selector: "a",
						attr: "href"
					},
				}
			}
		};
		this.relativelinks = true;
		this.jobscraper = {
			title: { selector: "h1", eq: 0},
			location: { selector: ".job-location", convert: (e) => e.replace('Workingplace: ','') },
			description: { selector: "article.text-block", eq: 0 }
		};
	}
}

module.exports = scraper;
