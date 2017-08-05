var Job = require('../models/job');
var Company = require('../models/company');


// GET /api/companies
exports.getCompanies = (req, res) => {
	Company.find({}).sort('title').exec((err,companies)=>res.json(err || companies))
}


// GET /api/jobs
exports.getJobs = (req,res) => {
     var daysago = new Date(Date.now() - (5*60*60*24*1000));
     Job.find({last_seen: {$gte : daysago}})
		 .sort('-first_seen')
		 .exec(function(err, jobs) {
			if (err)
				return res.json(err);
			res.json(jobs);
    	 }
	 );
};

