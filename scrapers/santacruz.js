var scraper = {
	company: 'santacruz',
	title: 'Santa Cruz Bicycles',
	location: 'Santa Cruz, CA',
	logo: 'http://i.imgur.com/AjKwOfi.png',
	jobs_url: 'https://www.santacruzbicycles.com/en-US/current-job-openings',
	listscraper: {
				urls: {
					listItem: ".article li",
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
		title: { selector: ".article h1", how: "text" },
		description: { selector: "p", how: "html" }
	},
}

module.exports = scraper;