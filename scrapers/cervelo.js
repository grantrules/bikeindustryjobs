var scraper = {
	company: 'cervelo',
	title: 'Cervelo',
	location: 'Cervelo, Canada',
	//logo: 'http://i.imgur.com/AjKwOfi.png',
	jobs_url: 'https://www.fitzii.com/careers/cervelo/',
	baseurl: 'https://www.fitzii.com',
	listscraper: {
				urls: {
					listItem: "#jtable_body tr td:first-child",
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
		title: { selector: ".cutout_text"},
		description: { selector: "#description", how: "html" },		
	},
}

module.exports = scraper;