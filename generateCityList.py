import googlemaps
import json

cities = [
	"Chicago, IL",
	"New York, NY",
	"San Francisco, CA",
	"Champaign, IL",
	"Miami, FL",
	"Austin, TX",
	"Los Angeles, CA",
	"Houston, TX",
	"Philadelphia, PA",
	"Detroit, MI",
	"Orlando, FL",
	"St. Louis, MO",
	"Helena, MT",
	"Boston, MA",
	"Phoenix, AZ",
	"New Orleans, LA",
	"Minneapolis, MN",
	"Omaha NE",
	"Salt Lake City, UT",
	"Washington D.C.",
	"Atlanta, GA",
	"Seattle, WA",	
]

city_list = []

gmaps = googlemaps.Client(key='AIzaSyARmSn07TiWTbZK661MYPaVP9hHl0nSD2U')

for city in cities:
	coord = (gmaps.geocode(city)[0]['geometry']['location'])
	city_list.append({'name':city, 'coord': coord})

with open('city_list.json', 'w') as outfile:
    json.dump(city_list, outfile)
