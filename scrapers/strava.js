var scraper = {
	company: 'strava',
	title: 'Strava',
	location: 'San Francisco, CA',
	website: 'http://www.strava.com',
	jobs_url: 'https://boards.greenhouse.io/strava',
	baseurl: 'https://boards.greenhouse.io/',
	logo: 'http://i.imgur.com/pJynVs8.png',
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