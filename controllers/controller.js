var Job = require('../models/job');
var Company = require('../models/company');
var Star = require('../models/company');


// GET /api/companies
exports.getCompanies = (req, res) => {
	Company.find({}).sort('title').exec((err,companies)=>res.json(err ? {err: "error fetching companies"} : companies))
}


// GET /api/jobs
exports.getJobs = (req,res) => {
     var daysago = new Date(Date.now() - (60*60*24*1000));
     Job.find({last_seen: {$gte : daysago}})
		 .sort('-first_seen')
		 .exec(function(err, jobs) {
			if (err) {
				console.log(err);
				return res.json({err: "error fetching jobs"});
			}
			res.json(jobs);
    	 }
	 );
};

exports.getStars = (req, res) => {
	Star.find({user_id: req.user._id}).select('job_id').exec((err, stars) => {
		if (err) {
			console.log(err);
			return res.json({err: "error fetching stars"});
		}
		res.json(stars);
	})
}

exports.postStars = (req, res) => {
	var star = new Star({user_id: req.user._id, job_id: req.body.job_id});
	star.save((err, star) => {
		if (err) {
			console.log(err);
			return res.json({err: "error saving star"});
		}
		res.json(star);
	})
}

exports.deleteStar = (req, res) => {
	Star.remove({user_id: req.user._id, job_id: req.body.job_id}).exec(err => {
		if (err) {
			console.log(err);
			return res.json({err: "error removing star"});
		}
		res.json({success:"success"})
	})
}

