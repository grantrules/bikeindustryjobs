var scraper = {
	jobs_url: 'http://www.jbi.bike/site/careers.php',
	listscraper: {
				urls: {
					listItem: ".panel",
					data: {
						title: {
							selector: ".panel-title a",
						},
						url: {
							selector: "a",
							attr: "href"
						},
						location: {
							selector: "strong", eq: 0
						},
						description: {
							selector: ".panel-body", how: "html",
						}
					}
				}
	 },
	relativelinks: true,
	baseurl: 'http://www.jbi.bike/site/careers.php',
}

module.exports = scraper;