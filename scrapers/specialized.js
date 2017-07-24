var scraper = {
	company: 'specialized',
	title: 'Specialized',
	location: 'Morgan Hill, CA',
	website: 'http://www.specialized.com',
	jobs_url: 'https://www.specialized.com/us/en/careers',
	listscraper: {
				urls: {
					listItem: ".open li",
					data: {
						url: {
							selector: "a",
							attr: "href"
						}
					}
				}
	 },
	relativelinks: false,
	jobscraper: {
		title: { selector: ".app-title" },
		description: { selector: "#content", how: "html" }
	},
}

module.exports = scraper;