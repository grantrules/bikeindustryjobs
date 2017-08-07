var Scraper = require('./Scraper');

class scraper extends Scraper.NonListHTMLScraper {
	
	
	constructor(company) {
		super(company);
		this.jobs_url = 'https://www.pinkbike.com/about/jobs/';
		this.baseurl = 'https://www.pinkbike.com/about/jobs/';
		this.listscraper = {
					links: {
						listItem: ".questions li",
						data: {
							link: { selector: "a", attr: "href" },
							title: { selector: "a" },
						},
					},
					description: {
						listItem: ".answers"
					}

		};
		this.relativelinks = true;
	}
	
	getJobsFromPage(page) {
		var jobs = [];
		for (var i = 0;i<page.links.length;i++) {
			var link = page.links[i];
			var description = page.description[i];
			var jobData = {
				url: this.getFullUrl(link.link),
				title: link.title,
				description: description,
				company: this.company,
				location: "Squamish, BC",
				last_seen: new Date(),
			};
			jobs.push(jobData)
		}
		return jobs;
	}
}

module.exports = scraper;
