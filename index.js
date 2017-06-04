const scrapeIt = require("scrape-it");

scrapeIt("https://police.lehigh.edu/crime-log", {
	title: "#page-title"
}).then(page => {
	console.log(page);
});

scrapeIt("https://police.lehigh.edu/crime-log", {
	// Incidents:
	incidents: {	
		listItem: ".views-row",
		data: {
			time_reported: "div.views-field.views-field-field-reported-on > div > div > span"
		}
	}
}, (err, page) => {
	console.log(err || page);
});
