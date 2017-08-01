var scraper = {
	jobs_url: 'http://chm.tbe.taleo.net/chm02/ats/careers/searchResults.jsp?org=CYCLINGSPORTSGROUP&cws=1',
	listscraper: {
				urls: {
					listItem: ".top a",
					data: {
						url: {
							attr: "href"
						}
					}
				}
	 },
	relativelinks: false,
	jobscraper: {
		title: { selector: "h1", eq: 0},
		description: { selector: "tr:nth-child(9)", how: "html" },
		location: { selector: "b", how:"html" , eq: 0 }

	},
}

module.exports = scraper;