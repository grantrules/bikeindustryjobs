var scraper = {
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
		description: { selector: "#content", how: "html" },
		location: { selector: ".location", how:"html" }

	},
}

module.exports = scraper;