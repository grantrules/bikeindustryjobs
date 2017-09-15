var Job = require('../models/job');
var Company = require('../models/company');
var Star = require('../models/company');


// GET /api/companies
exports.getCompanies = (req, res) => {
	Company.find({}).sort('title').exec((err,companies)=>res.json(err || companies))
}


// GET /api/jobs
exports.getJobs = (req,res) => {
     var daysago = new Date(Date.now() - (60*60*24*1000));
     Job.find({last_seen: {$gte : daysago}})
		 .sort('-first_seen')
		 .exec(function(err, jobs) {
			if (err)
				return res.json(err);
			res.json(jobs);
    	 }
	 );
};

exports.getStars = (req, res) => {
	Star.find({user_id: req.user._id}).select('job_id').exec((err, stars) => {
		if (err)
			return res.json(err);
		res.json(stars);
	})
}

exports.postStars = (req, res) => {
	Star.create({user_id: req.user._id, job_id: req.body.job_id}).exec((err, star) => {
		if (err)
			return res.json(err);
		res.json(star);
	})
}

exports.deleteStar = (req, res) => {
	Star.remove({user_id: req.user._id, job_id: req.body.job_id}).exec(err => {
		if (err)
			return res.json(err);
		res.json({success:"success"})
	})
}

