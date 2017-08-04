var scrapeIt = require('scrape-it');
var mongoose = require('mongoose');
var Job = require('./models/job');
var Company = require('./models/company');


var done = 0;

var test = false;

if (!test) mongoose.connect('mongodb://127.0.0.1/bikeindustryjobs');

// request tracker so i know when it's safe to exit
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


/* save job */

var saveJob = (company,url,page) => {

	if (page == null) {
		page = {};
	}
	var jobData = {
		url: url.url,
		title: page.title || url.title,
		description: page.description || url.description,
		company: company.company,
		location: page.location || url.location,
		last_seen: new Date(),


	};
	
	console.log(jobData);
	if (test) {
		console.log("job test: "+jobData.title + " location: "+page.location);
	} else {
		console.log('hello');
		Job.findOneAndUpdate({'url':url.url}, {$set:jobData,$setOnInsert: {
			first_seen: new Date()
		}}, {upsert:true}, (err,doc) => {
			console.log('hi');
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



/* recursive function to iterate through job urls,
   scrape using jobscraper if it exists, otherwise save job */
var scrapejobloop = (scraper,company,urls,index,callback) => {
	var url = urls[index++];
	
	// bad place for this, this can get called before everything's done scraping.
	// i just gave it a timeout of 30 seconds before quitting
	// but this really needs to move
	if (typeof url == "undefined") { return callback(); }
	
	if (scraper.jobscraper) {

		scrapeIt(url.url,
				scraper.jobscraper,
				(err, page) => {
					// job page

					if (!err) {
						saveJob(company,url,page);
					}

					// move this into the update?
					scrapejobloop(scraper,company,urls,index,callback);
				}
		);
	} else {
		saveJob(company,url,null);
		scrapejobloop(scraper,company,urls,index,callback);
	}
}

/* callback for main job page request,
   find job urls and scrape those */
var scrapejobs = (scraper,company,err,page) => {
	if (err) {
		return console.log(err);
	}
	console.log(`found ${page.urls.length} ${company.company} jobs`);
	
	var urls = page.urls.map((e) => { e.url = (scraper.relativelinks ? scraper.baseurl : '') + e.url.replace(/;jsessionid=[A-Z0-9]+/, ''); return e; });
	
	rt++;
	scrapejobloop(scraper,company,urls,0,()=>{if (--rt <1) { setTimeout(()=>{process.exit();},30000)  }});
}

/* pull companies from db with hasScraper,
   scrape main job page */
Company.find({'hasScraper': true},(err,res)=>{
	if (res) {
		res.forEach((company) => {
			var scraper = require(`./scrapers/${company.company}`)
			
			console.log('scraping '+company.company);
			
			scrapeIt(
				scraper.jobs_url,
				scraper.listscraper,
				(err,page) => scrapejobs(scraper,company,err,page)
			);
		})
	}
})
