var mongoose = require('mongoose');
var Job = require('./models/job');
var Company = require('./models/company');

var test = false;

if (!test) mongoose.connect('mongodb://127.0.0.1/bikeindustryjobs');

// request tracker so i know when it's safe to exit


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



var saveJobs = (jobs) => {
	jobs.forEach(job=>{
		Job.findOneAndUpdate({'url':job.url}, {$set:job,$setOnInsert: {
			first_seen: new Date()
		}}, {upsert:true}, (err,doc) => {
			if (err) {
				console.log(err);
			}
			else {
				if (doc == null) {
					console.log("new job added: "+job.title);
				} else {
					console.log("job updated: "+job.title);
				}
			}

		});
	})
}


/* pull companies from db with hasScraper,
   scrape main job page */

Company.find({'hasScraper': true},(err,res)=>{
	if (res) {
		res.forEach((company) => {
			var scraper = require(`./scrapers/${company.company}`)
			var s = new scraper(company);
			
			s.process(saveJobs);
			
			console.log('scraping '+company.company);
			
			
		})
	}
})
