var Job = require('../models/job');
var Company = require('../models/company');
var log = require('loglevel');

// GET /api/companies
exports.getCompanies = (req, res) => {
	Company.find({}).sort('title').select('title company location website about jobs_url logo details').exec((err,companies)=>res.json(err ? {err: "error fetching companies"} : companies))
}

// GET /api/companies/my
exports.getMyCompanies = (req, res) => {
	Company.find({'owners.user_id': req.user._id})
	.where('owners.user_id')
	.sort('title')
	.select('title company location website about jobs_url logo details owners')
	.exec((err,companies)=>res.json(err ? {err: "error fetching companies"} : companies))
}

exports.postCompanies = (req, res) => {
	var company = new Company({
		owners: [{user_id: req.user._id}],
		company: req.body.company,
		title: req.body.title,
		location: req.body.location,
		website: req.body.website,
		about: req.body.about,
		logo: req.body.logo,
		hasScraper: false,
		details: {
			numEmployees: req.body.numEmployees,
			founded: req.body.founded,
			headquarters: "",
			industry: req.body.industry,
		}
	});
	company.save((err, company) => {
		if (err) {
			log.error(err);
			return resizeBy.json({err: "error saving company"});
		}
		log.debug(`company saved: company_id: ${company._id}, user: ${req.user._id}`);
		res.json(company);
	});
}