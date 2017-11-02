var Job = require('../models/job');
var Company = require('../models/company');
var log = require('loglevel');
var aws = require('aws-sdk');
var crypto = require('crypto');
var config = require('../config');

var s3_bucket = 'derp';
var secret = "the snozzberries taste like snozzberries";

// GET /api/companies
exports.getCompanies = (req, res) => {
	Company.find({}).sort('title').select('title company location website about jobs_url logo details').exec((err,companies)=>res.json(err ? {err: "error fetching companies"} : companies))
}

// GET /api/companies/my
exports.getMyCompanies = (req, res) => {
	Company.find({'owners.user_id': req.user._id})
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


// IMAGE HANDLING



// GET /api/imageUploadUrl/?contentType=
exports.getImageUploadUrl = function(req,res) {
	var accesskeyid = config.AWSACCESSKEYID;
	var secretaccesskey = config.AWSSECRETACCESSKEY;
	var s3_bucket = config.AWSS3BUCKET;
	aws.config.update({accessKeyId: accesskeyid, secretAccessKey: secretaccesskey})
	const s3 = new aws.S3();

    var fileName = crypto.createHash('sha256').update(`${new Date().getMilliseconds()}`).digest('base64').toString();
	var contentType = req.params.contentType;

    var s3params = {
        Bucket: s3_bucket,
        ContentType: contentType,
        Expires: 60,
        Key: fileName,
        ACL: "public-read",
    }
    
    s3.getSignedUrl('putObject', s3params, function(err,data) {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        
        var url = `https://${s3_bucket}.s3.amazonaws.com/${fileName}`
        
        res.json({
            secret: crypto.createHash('sha256').update(url + "shabadoo" + config.secret)
            .digest('base64').toString(),
            signedRequest: data,
            fileName:  url
        });
        
    });
}

// PUT /api/restaurantimages/?hash=
exports.putRestaurantImages = function(req,res) {
    // maybe hash the filename with the secret key, client sends both after aws upload and we check against hash here
    if (req.params.hash != crypto.createHash('sha256').update(req.params.fileName + "shabadoo" + config.secret))
        return res.json('Error uploading file');
    
    // create image in mongo
}