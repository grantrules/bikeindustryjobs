var scrapeIt = require('scrape-it');
var mongoose = require('mongoose');
var Job = require('./models/job');

var done = 0;

var test = false;

if (!test) mongoose.connect('mongodb://127.0.0.1/bikeindustryjobs');


/*
https://www.fitzii.com/careers/cervelo/
^--- seem good to go

https://www.eastoncycling.com/about-us/careers/
https://www.pinkbike.com/about/jobs/
^--- all on one page

https://www.giant-bicycles.com/us/job-openings

https://www.brompton.com/About-Us/Careers
^--- weird pdfs


https://www.trekbikes.com/us/en_US/current_openings?p=jobs&nl=1
https://www.specialized.com/us/en/careers
https://www.santacruzbicycles.com/en-US/current-job-openings



*/




var scrapers = require('./scrapers/scrapers');

var scrapejobloop = (scraper,urls,index) => {
	var url = urls[index++];
	if (typeof url == "undefined") { return }
	
	scrapeIt(url,
			scraper.jobscraper,
			(err, page) => {
				// job page
				//console.log(err || page);
		
				if (!err) {
					
					var jobData = {
						url: url,
						title: page.title,
						description: page.description,
						company: scraper.company,
						last_seen: new Date(),
						
						
					};
					if (test) {
						console.log("job test: "+jobData.title);
					} else {
						Job.findOneAndUpdate({'url':url}, {$set:jobData,$setOnInsert: {
    						first_seen: new Date()
  						}}, {upsert:true}, (err,doc) => {
							if (err) {
								console.log(err);
							}
							else {
								if (doc == null) {
									// newly created
									console.log("new job added: "+jobData.title);
								} else {
									// updated
									console.log("job updated: "+jobData.title);
								}
							}
						});
					}
				}
		
				// move this into the update?
				scrapejobloop(scraper,urls,index);
			}
	);
}

var scrapejobs = (scraper,err,page) => {
	if (err) {
		return console.log(err);
	}
	console.log(`found ${page.urls.length} jobs`);
	
	var urls = page.urls.map((e) => { return (scraper.relativelinks ? scraper.baseurl : '') + e.url });

	scrapejobloop(scraper,urls,0);
}


scrapers.forEach((scraper) => {
	console.log('scraping '+scraper.company);
	scrapeIt(
		scraper.jobs_url,
		scraper.listscraper,
		(err,page) => { return scrapejobs(scraper,err,page); }
	);
	
});