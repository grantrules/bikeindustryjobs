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
			var json = JSON.parse(body);
			this.getListFromJson(json).forEach(j=>saveJobCallback(this.getJobData(j)));
			allDoneCallback();
			
		});
	}

}



class HTMLScraper extends Scraper {
	
	constructor(company) {
		super(company);
	}
	
	/* fixes url in element obj */
	fixUrl(element) {
		element.url = this.getFullUrl(element.url);
		return element;
	}
	
	/* override scrapejobs for single-page, non-list sites */
	scrapejobs(err,page) {
		if (err) {
			return console.log(err);
		}
		console.log(`found ${page.urls.length} ${this.company} jobs`);

		var urls = page.urls.map(this.fixUrl.bind(this));

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

class NonListHTMLScraper extends HTMLScraper {
	
	constructor(company) {
		super(company);
	}
	
	scrapejobs(err,page) {
		if (err) {
			return console.log(err);
		}

		var jobs = this.getJobsFromPage(page);
		this.saveJobCallback(...jobs);
		
	}
	
}

module.exports = {Scraper, JSONScraper, HTMLScraper, NonListHTMLScraper}