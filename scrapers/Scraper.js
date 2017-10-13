var scrapeIt = require('scrape-it');
var request = require('request');


class Scraper {
	
	constructor(company) {
		this.company = company.company;
		this.jobs = [];
	}
	
	process(saveJobCallback,allDoneCallback) {
		console.log("huh?");
		this.saveJobCallback = saveJobCallback;
		this.allDoneCallback = allDoneCallback;
	}
	
	getFullUrl(url) {
		return (this.relativelinks ? this.baseurl : '') + url.replace(/;jsessionid=[A-Z0-9]+/, '');
	}
	
}

/* json job lists */
class JSONScraper extends Scraper {
	
	constructor(company) {
		super(company)
	}
	
	getJobData(job) {
		// override me in company scraper
		var jobData = {}
		console.log("this shouldn't be called");
		return jobData;
	}
	
	
	/* override this if your json is
	   not like {'listprop':[{,,,,}]} */
	getListFromJson (json) {
		return json[this.listprop];
	}
	
	process(saveJobCallback,allDoneCallback) {
		request(this.jobs_url,  (err, res, body) => {
			// parse json
			try {
				var json = JSON.parse(body);
				this.getListFromJson(json).forEach(j=>saveJobCallback(this.getJobData(j)));
			} catch (e) {
				console.log(`error fetching JSON from ${this.company}`);
			}
			allDoneCallback();
			
		});
	}

}

/* job listing in list form, can follow links to scrape more info */

class HTMLScraper extends Scraper {
	
	constructor(company) {
		super(company);
	}
	
	/* fixes url in element obj */
	fixUrl(element) {
		element.url = this.getFullUrl(element.url);
		return element;
	}
	
	scrapejobs(err,page) {
		if (err) {
			this.allDoneCallback();
			console.log(`error scraping job list from ${this.company}`);
			return console.log(err);
		}

		var urls = page.urls.filter(url => url.url);
		urls = urls.map(this.fixUrl.bind(this));

		console.log(`found ${urls.length} ${this.company} jobs`);
		
		this.urlsIterator = urls[Symbol.iterator]();
		
		this.scrapeJobLoop();
		
	}
	
	process(saveJobCallback,allDoneCallback) {
		this.saveJobCallback = saveJobCallback;
		this.allDoneCallback = allDoneCallback;
		scrapeIt(
				this.jobs_url,
				this.listscraper,
				this.scrapejobs.bind(this)
		);
	}
	
	scrapeJobPage(url,err,page) {
		// job page

		if (!err) {
			var jobData = {
				url: url.url,
				title: page.title || url.title,
				description: page.description || url.description,
				company: this.company,
				location: page.location || url.location,
				last_seen: new Date(),
			};
			this.saveJobCallback(jobData);
		}
		this.scrapeJobLoop();
	}
	
	/* recursive creaping loop */
	scrapeJobLoop() {
		var {value,done} = this.urlsIterator.next();
		var url = value;
		if (done) {
			this.allDoneCallback();
		}
		
		if (url) {
			scrapeIt(url.url,
					this.jobscraper,
					(err,page) => this.scrapeJobPage(url,err,page)
			);
		}

	}
	
}

/* single-page job listings without a list */

class NonListHTMLScraper extends HTMLScraper {
	
	constructor(company) {
		super(company);
	}
	
	scrapejobs(err,page) {
		if (err) {
			console.log(`error fetching html from ${this.company}`);
			return console.log(err);
		} else {		
			var jobs = this.getJobsFromPage(page);
			this.saveJobCallback(...jobs);
		}
		this.allDoneCallback();
		
	}
	
}

/* Ultipro scraper */

class UltiproScraper extends JSONScraper {

	constructor(company, string1, string2) {
		super(company);
		this.jobs_url = `https://recruiting.ultipro.com/${string1}/JobBoard/${string2}/JobBoardView/LoadOpportunities`;
		this.listprop = "opportunities";
		this.baseurl = `https://recruiting.ultipro.com/${string1}/JobBoard/${string2}/OpportunityDetail?opportunityId=`;
		this.relativelinks = true;
	}
	
	getJobData(job) {
		return {
			url: this.getFullUrl(job.Id),
			title: job.Title,
			description: job.BriefDescription,
			company: this.company,
			location:job.Locations.map(e=>e.LocalizedName).join(", "),
			last_seen: new Date(),
		}
	}
}

module.exports = {Scraper, JSONScraper, HTMLScraper, NonListHTMLScraper, UltiproScraper}