curl "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv" -o ./data/cases.csv
curl "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_deaths_global.csv" -o ./data/deaths.csv
esy start ./data/cases.csv ./data/deaths.csv ./data/locations.json ./data/days.json ./data/data.json
