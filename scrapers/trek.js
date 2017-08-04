var scraper = {
	jobs_url: 'https://jobs.jobvite.com/trek-bicycle/jobs?nl=1&nl=1',
	baseurl: 'https://jobs.jobvite.com',
	listscraper: {
				urls: {
					listItem: ".jv-job-list tr",
					data: {
						url: {
							selector: "a",
							attr: "href"
						},
						location: {
							selector: ".jv-job-list-location"
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
