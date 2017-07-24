var Job = require('./job.js');

// GET /api/companies
exports.getCompanies = (req, res) => {
	var scrapers = require('./scrapers/scrapers');
	var companies = scrapers.map((e) => {
		return {
			company: e.company,
			title: e.title,
			location: e.location,
			website: e.website,
		}
	});
	res.json(companies);
}


// GET /api/jobs
exports.getJobs = function(req,res) {
     var daysago = new Date(Date.now() - (5*60*60*24*1000));
     Job.find({last_seen: {$gte : daysago}}).exec(function(err, jobs) {
        if (err)
            return res.json(err);
        res.json(jobs);
    });
};

