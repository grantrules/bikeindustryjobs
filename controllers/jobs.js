var Job = require('../models/job');
var Company = require('../models/company');
var Star = require('../models/star');
var log = require('loglevel');
var sanitizeHtml = require('sanitize-html');






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

exports.postJobs = (req,res) => {
	Company.findOne({company: req.body.company, 'owners.user_id': req.user._id}, (err, company) => {
		if (company) {
			var job = new Job({
				title: req.body.title,
				url: req.body.url,
				description: sanitizeHtml(req.body.description),
				company: req.body.company,
				location: req.body.location,
			})

			job.save((err, job) => {
				if (err) {
					console.log(err);
					return res.json({err: "error saving job"});
				}
				return res.json(job);
			})
		}
		else {
			return res.json({err: "not authorized to post jobs for company or company doesn't exist"});
		}
	})

}

exports.deleteJob = (req,res) => {
	// look up job first, make sure user has ownership to company
	var job_id = req.body.job_id;

	Job.findOne({_id: job_id}, (err, job) => {
		if (err) {
			return res.json({err: "unable to find job"});
		}
		Company.findOne({company:job.company,'owners.user_id': req.user._id}, (err, company) =>{
			if (company) {
				Job.remove({_id: job_id}).exec(err => {
					if (err) {
						console.log(err);
						return res.json({err: "error removing job"});
					}
					log.debug(`job deleted: job_id: ${req.body.job_id}, user: ${req.user._id}`);		
					res.json({success:"success"})
				})
			}
			else {
				return res.json({err: "no permissions"});
			}
		})
	})
}

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
	var job_id = req.body.job_id;
	if (!job_id) {
		return res.json({err: "no job_id"});
	}
	Star.remove({user_id: req.user._id, job_id: req.body.job_id}).exec(err => {
		if (err) {
			console.log(err);
			return res.json({err: "error removing star"});
		}
		log.debug(`star deleted: job_id: ${req.body.job_id}, user: ${req.user._id}`);		
		res.json({success:"success"})
	})
}



