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
			time_reported: "div.views-field.views-field-field-reported-on > div > div > span",
			time_of_incident: "div.views-field.views-field-field-incident-date-time > div > div > span",
			disposition: "div.views-field.views-field-field-disposition > div > div",
			incident_type: "div.views-field.views-field-field-incident-type > span",
			suspect_name: "div.views-field.views-field-field-suspect-name > div > div",
			incident_location: "div.views-field.views-field-field-incident-location > div > div",
			report_number: "div.views-field.views-field-field-report-number > div > div",
			description: "div.views-field.views-field-body > div > p"
		}
	}
}, (err, page) => {
	console.log(err || page);
});
