const scrapeIt = require("scrape-it");
const sqlite3 = require("sqlite3").verbose();

var site;

// print process.argv
if(process.argv.length <= 2){
	console.log("This program takes a URL as a parameter!");
	process.exit(-1);
} else {
	console.log(process.argv[2]);
	site = process.argv[2];
	console.log("Updating database with values from: " + site);
}

var db_path = "./incidents.db"
var db = new sqlite3.Database("incident.db", sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, db_callback);

var db_callback = function(err) {
	if (err != null){
		console.log("Error opening db!");
		console.log(err);
	}
	else { 
	}
}

// Otherwise, the database was opened successfully. Lets create a table....
console.log("DB opened successfully!");
db.run("CREATE TABLE IF NOT EXISTS incidents (report_number TEXT PRIMARY KEY, time_reported TEXT, time_of_incident TEXT, disposition TEXT, incident_type TEXT, suspect_name TEXT, incident_location TEXT, description TEXT)", function(err) { 
		console.log("Error occured creating table! This might not be a problem if table already exists.");
		console.log(err);
		});

// Looks like that worked, time to scrape the LUPD website 
var found_dups = 0;
scrapeIt(site, {
title: "#page-title"
}).then(page => {
	console.log(page);
	});

scrapeIt(site, {
	// Incidents:
	incidents: {	
	listItem: ".views-row",
	data: {
		report_number: {
			selector: "div.views-field.views-field-field-report-number > div > div",
			convert: x => x.replace("Report Number: ", "")
		},
		time_reported: "div.views-field.views-field-field-reported-on > div > div > span",
		time_of_incident: "div.views-field.views-field-field-incident-date-time > div > div > span",
		disposition: {
			selector: "div.views-field.views-field-field-disposition > div > div",
			convert: x => x.replace("Disposition: ", "")
		},
		incident_type: "div.views-field.views-field-field-incident-type > span",
		suspect_name: "div.views-field.views-field-field-suspect-name > div > div",
		incident_location: {
			selector: "div.views-field.views-field-field-incident-location > div > div",
			convert: x => x.replace("Incident Location: ", "")
		},
		description: "div.views-field.views-field-body > div > p"
		}
	}
}, (err, page) => {
	if(err != null){
		console.log("Error scraping: " + err);
	}
	for (var i = 0; i < page.incidents.length; i++){
		var temp = page.incidents[i];
		// console.log(page.incidents[i].report_number);
		// console.log(page.incidents[i].suspect_name);
		var x = db.prepare("INSERT INTO incidents (report_number, time_reported, time_of_incident, disposition, incident_type, suspect_name, incident_location, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
		x.run(temp.report_number, temp.time_reported, temp.time_of_incident, temp.disposition, temp.incident_type, temp.suspect_name, temp.incident_location, temp.description, function(err) {
        if(err != null && err.errno == 19){
                found_dups = 1;
                return;
        } else if (err != null){
                console.log(err);
        }
        });
}
});

if(found_dups != 0){
        console.log("Found (and ignored) duplicate entries. Everything looks good.");
}
