var scraper = {
	company: 'trek',
	title: 'Trek',
	location: 'Somewhere, I dunno',
	logo: 'http://i.imgur.com/KmXoVY2.png',
	jobs_url: 'https://jobs.jobvite.com/trek-bicycle/jobs?nl=1&nl=1',
	baseurl: 'https://jobs.jobvite.com',
	listscraper: {
				urls: {
					listItem: ".jv-job-list-name",
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
		title: { selector: ".jv-header"},
		description: { selector: ".jv-job-detail-description", how: "html" }
	},
}

module.exports = scraper;