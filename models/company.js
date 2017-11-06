var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
	company: {
		type: String,
		required: true,
		index: {
		  unique: true,
		  sparse: true
		}
	},    title: String,
	location: String,
	website: String,
    about: String,
	jobs_url: String,
    logo: String,
	hasScraper: Boolean,
	details: {
		numEmployees: String,
		founded: String,
		headquarters: String,
		industry: String,
	},
	owners:[{ user_id: String }]
});

companySchema.pre('validate', function(next) {

	if (typeof this.title === "string" && (typeof this.company === "undefined" || this.company === "")) {
		var baseslug = this.title.replace(/[^a-z0-9]/gi, '').toLowerCase();
		var slug = baseslug;
		var num = 1;

		mongoose.model('Company').find({company: new RegExp(`^${slug}`, "i") }).exec((err, companies) => {
		
			if (companies) {
				while (typeof this.company === "undefined") {
					if (companies.find(c => c.company === slug)) {
						slug = `${baseslug}${num++}`						
					} else {
						this.company = slug;
					}
				}
			}
			this.company = slug;
			next();
		})
	} else {
		next();
	}

})



module.exports = mongoose.model('Company', companySchema);
