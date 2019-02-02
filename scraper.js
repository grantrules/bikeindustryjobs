const mongoose = require('mongoose');
const config = require('./config');
const Job = require('./models/job');
const Company = require('./models/company');

/*
var test = false;

if (!test) mongoose.connect(config.mongodb);
*/
/*
^--- seem good to go

https://chc.tbe.taleo.net/chc01/ats/careers/searchResults.jsp?org=SHIMANO&cws=1
^--- maybe multiple pages? also has fish

http://wheelsmfg.com/employment-opportunities
https://www.eastoncycling.com/about-us/careers/
^--- all on one page


^--- json but easy looking to scrape

https://www.giant-bicycles.com/us/job-openings

http://www.finishlineusa.com/resources/careers.php
https://www.brompton.com/About-Us/Careers
^--- weird pdfs

https://www.pinkbike.com/about/jobs/
https://recruiting.ultipro.com/QUA1003QBP/JobBoard/4b01c3ed-7e54-43da-954f-c74c4b3945a6/OpportunityDetail?opportunityId=19b344bd-5891-40ec-9fa0-46d4393c3b98
https://www.fitzii.com/careers/cervelo/
https://www.trekbikes.com/us/en_US/current_openings?p=jobs&nl=1
https://www.specialized.com/us/en/careers
https://www.santacruzbicycles.com/en-US/current-job-openings
^--- donezo


*/


class jobsaver {
  constructor(completedCallback, completeCheck) {
    this.jobQueue = [];
    this.done = true;
    this.completedCallback = completedCallback;
    this.completeCheck = completeCheck;
  }

  next() {
    return this.jobQueue.shift();
  }

  add(...job) {
    if (job == undefined) {
      console.log("undefined job");
      return;
    }
    this.jobQueue.push(...job);
    this.start();
  }

  start() {
    if (this.done) {
      this.done = false;
      this.saveJob();
    }
  }

  stop() {
    this.done = true;
    // have all companies been scraped?
    if (this.completeCheck()) {
      console.log('all done');
      this.completedCallback();
    }

  }

  saveJob() {
    const job = this.next();


    if (job == undefined) { this.stop(); return; }

    // insert made up tag
    // job.tags = [getTag()]

    Job.findOneAndUpdate(
      { url: job.url },
      { $set: job, $setOnInsert: { first_seen: new Date() } },
      { upsert: true },

      (err, doc) => {
        if (err) {
          console.log(err);
        }
        else {
          if (doc == null) {
            console.log("new job added: " + job.title);
          } else {
            console.log("job updated: " + job.title);
          }
        }
        this.saveJob();
      }
    );

  }

}



module.exports = () => {
  /* pull companies from db with hasScraper */

  const params = { 'hasScraper': true }

  const companyComplete = [];

  const started = company => companyComplete[company] = false;

  const completed = company => companyComplete[company] = true

  const companyCompleted = () => Object.keys(companyComplete).every(e => companyComplete[e] == true);
	/*
	if (process.argv[2]) {
		params['company'] = process.argv[2];
	}
	*/
  Company.find(params, (err, res) => {
    if (res) {
      const js = new jobsaver(() => { }, () => companyCompleted());

      res.forEach((company) => {
        const scraper = require(`./scrapers/${company.company}`);
        console.log('scraping ' + company.company);
        started(company.company);

        const s = new scraper(company);
        s.process(
          js.add.bind(js),
          () => { completed(company.company) }
        )

      })
    }
  })

}


