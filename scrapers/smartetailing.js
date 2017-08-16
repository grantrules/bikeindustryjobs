var Scraper = require('./Scraper');

class scraper extends Scraper.UltiproScraper {
	
	constructor(company) {
        var string1 = "QUA1003QBP";
        var string2 = "0a11c700-8c72-42cc-bea0-d774f5014673";
        super(company, string1, string2);
    }
	
}

module.exports = scraper;