cat to-scrape.txt | while read -r line; do node manual_scraper.js "$line"; done
