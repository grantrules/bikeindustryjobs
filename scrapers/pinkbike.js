var scraper = {
	jobs_url: 'https://www.pinkbike.com/about/jobs/',
	listscraper: {
				urls: {
					listItem: "ol.questions li",
					data: {
						url: {
							selector: "a",
							attr: "href"
						}
					}
				}
	 },
	jobscraper: ,
}