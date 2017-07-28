var scrapeIt = require('scrape-it');
var mongoose = require('mongoose');
var Job = require('./models/job');

var done = 0;

var test = false;

if (!test) mongoose.connect('mongodb://127.0.0.1/bikeindustryjobs');

// request tracker
var rt = 0;


/*
^--- seem good to go

https://chc.tbe.taleo.net/chc01/ats/careers/searchResults.jsp?org=SHIMANO&cws=1
^--- maybe multiple pages? also has fish

http://wheelsmfg.com/employment-opportunities
https://www.eastoncycling.com/about-us/careers/
https://www.pinkbike.com/about/jobs/
^--- all on one page

https://recruiting.ultipro.com/QUA1003QBP/JobBoard/4b01c3ed-7e54-43da-954f-c74c4b3945a6/OpportunityDetail?opportunityId=19b344bd-5891-40ec-9fa0-46d4393c3b98
^--- json but easy looking to scrape

https://www.giant-bicycles.com/us/job-openings

http://www.finishlineusa.com/resources/careers.php
https://www.brompton.com/About-Us/Careers
^--- weird pdfs

https://www.fitzii.com/careers/cervelo/
https://www.trekbikes.com/us/en_US/current_openings?p=jobs&nl=1
https://www.specialized.com/us/en/careers
https://www.santacruzbicycles.com/en-US/current-job-openings
^--- donezo


*/




var scrapers = require('./scrapers/scrapers');

var scrapejobloop = (scraper,urls,index,callback) => {
	var url = urls[index++];
	if (typeof url == "undefined") { callback(); return }
	
	scrapeIt(url,
			scraper.jobscraper,
			(err, page) => {
				// job page
		
				if (!err) {
					
					var jobData = {
						url: url,
						title: page.title,
						description: page.description,
						company: scraper.company,
						location: page.location,
						last_seen: new Date(),
						
						
					};
					if (test) {
						console.log("job test: "+jobData.title + " location: "+page.location);
					} else {
						Job.findOneAndUpdate({'url':url}, {$set:jobData,$setOnInsert: {
    						first_seen: new Date()
  						}}, {upsert:true}, (err,doc) => {
							if (err) {
								console.log(err);
							}
							else {
								if (doc == null) {
									console.log("new job added: "+jobData.title);
								} else {
									console.log("job updated: "+jobData.title);
								}
							}
							
						});
					}
				}
		
				// move this into the update?
				scrapejobloop(scraper,urls,index,callback);
			}
	);
}

var scrapejobs = (scraper,err,page) => {
	if (err) {
		return console.log(err);
	}
	console.log(`found ${page.urls.length} jobs`);
	
	var urls = page.urls.map((e) => { return (scraper.relativelinks ? scraper.baseurl : '') + e.url });

	scrapejobloop(scraper,urls,0,()=>{rt--; if (--rt <1) { process.exit(); }});
}


scrapers.forEach((scraper) => {
	rt++;
	console.log('scraping '+scraper.company);
	scrapeIt(
		scraper.jobs_url,
		scraper.listscraper,
		(err,page) => { scrapejobs(scraper,err,page); }
	);
	
});