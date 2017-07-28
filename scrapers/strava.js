var scraper = {
	jobs_url: 'https://boards.greenhouse.io/strava',
	baseurl: 'https://boards.greenhouse.io/',
	listscraper: {
				urls: {
					listItem: ".opening",
					data: {
						url: {
							selector: "a",
							attr: "href"
						}
					}
				}
	 },
	relativelinks: true,
	jobscraper: {
		title: { selector: ".app-title" },
		description: { selector: "#content", how: "html" },
		location: { selector: ".location", how:"html" }
	},
}

module.exports = scraper;