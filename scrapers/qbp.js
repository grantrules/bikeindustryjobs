var Scraper = require('./Scraper');

class scraper extends Scraper.UltiproScraper {
	
	constructor(company) {
		var string1 = "QUA1003QBP";
		var string2 = "4b01c3ed-7e54-43da-954f-c74c4b3945a6";
		super(company, string1, string2);


	}	
	
}

module.exports = scraper;