import json
import requests
from urllib.parse import urlencode

GEONAMES_USERNAME = 'math56'

def get_all_state(states_file_path):
    with open(states_file_path, 'r', encoding='utf-8') as state_file:
        return json.load(state_file)

def make_geonames_request(base_url, params):
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get('geonames', [])
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return []

def get_PPL_cities(country_code):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureClass": "p",
        "username": GEONAMES_USERNAME,
    }
    return make_geonames_request(base_url, params)

def main():
    input_states_file = 'statesData.json'
    output_cities_file = 'citiesData.json'

    all_cities = []

    with open(output_cities_file, 'r', encoding='utf-8') as f:
        old_cities = json.load(f)
        for city in old_cities:
            all_cities.append(city)

    all_states = get_all_state(input_states_file)

    for country in all_states:
        country_code = country['countryCode']
        cities = get_PPL_cities(country_code)
        print(f"Fetching cities for {country['country']} : {len(cities)} cities found")
        for state in country['states']:
            for city in cities:
                if city.get('adminCode1','') == state['adminCode1'] and city["population"] > 100000:
                    city_name = city['name']
                    city_population = city.get('population', '')
                    city_country = country['country']
                    city_state = state['name']
                    city_info = {
                        "name": city_name,
                        "population": city_population,
                        "country_name": city_country,
                        "state_name": city_state,
                        "populationName": ""
                    }
                    all_cities.append(city_info)
            
    with open(output_cities_file, 'w', encoding='utf-8') as f:
        json.dump(all_cities, f, indent=2,ensure_ascii=False)

if __name__ == '__main__':
    main()
