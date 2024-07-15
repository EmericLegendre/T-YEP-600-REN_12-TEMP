import requests

country_code = "WF"
GEONAMES_USERNAME = "math56"


base_url = "http://api.geonames.org/searchJSON"
params = {
    "country": country_code,
    "featureCode": "PPLA,PPLA2",
    "username": GEONAMES_USERNAME
}
response = requests.get(base_url, params=params)
response.raise_for_status()  # Raise an exception for HTTP errors
data = response.json()
print(data)