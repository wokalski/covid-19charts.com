curl "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv" -o ./data/input.csv
esy start ./data/input.csv ./data/locations.json ./data/days.json ./data/data.json
