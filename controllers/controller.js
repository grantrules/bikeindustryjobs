var Job = require('../models/job');
var Company = require('../models/company');
var Star = require('../models/star');
var log = require('loglevel');


// GET /api/companies
exports.getCompanies = (req, res) => {
	Company.find({}).sort('title').select('title company location website logo').exec((err,companies)=>res.json(err ? {err: "error fetching companies"} : companies))
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
			log.error(err);
			return res.json({err: "error saving star"});
		}
		log.debug(`star saved: star_id: ${star._id}, user: ${req.user._id}`);
		res.json(star);
	})
}

exports.deleteStar = (req, res) => {
	Star.remove({user_id: req.user._id, job_id: req.body.job_id}).exec(err => {
		if (err) {
			console.log(err);
			return res.json({err: "error removing star"});
		}
		log.debug(`star deleted: job_id: ${job_id}, user: ${user.id}`);		
		res.json({success:"success"})
	})
}

