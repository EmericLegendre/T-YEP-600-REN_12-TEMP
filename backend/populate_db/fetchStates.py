import json
import requests
from urllib.parse import urlencode

GEONAMES_USERNAME = 'math56'

def get_all_country_names(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        countries = json.load(file)
        
        country_names = []
        for country in countries:
            name = country['name']
            countryCode = country['countryCode']
            country_names.append({
                "original_name": name,
                "countryCode": countryCode
            })
            
        return country_names

def make_geonames_request(base_url, params):
    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()
        return data.get('geonames', [])
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return []

def get_capital_cities(country_code):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureCode": "PPLC",
        "username": GEONAMES_USERNAME
    }
    return make_geonames_request(base_url, params)

def get_other_cities(country_code):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureCode": "PPLA",
        "username": GEONAMES_USERNAME
    }
    return make_geonames_request(base_url, params)

def get_country_states(country_code, country_name):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureCode": "ADM1",
        "username": GEONAMES_USERNAME
    }
    states_data = make_geonames_request(base_url, params)

    capital_cities = get_capital_cities(country_code)
    other_cities = get_other_cities(country_code)
    all_cities = capital_cities + other_cities

    all_country_cities = []
    states = []

    for state in states_data:
        state_name = state["adminName1"]
        state_population = state.get("population", 0)
        adminCode1 = state.get("adminCode1", "")  # Ensure adminCode1 is available or default to empty string
        countryCode = state["countryCode"]
        
        regional_capital = next((city.get("name", "") for city in all_cities if city.get("adminCode1") == adminCode1), "")

        population_name = ""
        
        states.append({
            "name": state_name,
            "regionalCapital": regional_capital,
            "population": state_population,
            "populationName": population_name,
            "adminCode1": adminCode1,
            "countryCode": countryCode
        })
        
        for city in all_cities:
            if city.get('adminCode1') == adminCode1:  # Ensure adminCode1 is available or default to empty string
                city_data = {
                    "name": city.get("name", ""),
                    "population": city.get("population", 0),
                    "state_name": state_name,
                    "country_name": country_name,
                    "populationName": ""
                }
                all_country_cities.append(city_data)

    return states, all_country_cities

def main():
    input_countries_file = 'countriesData.json'
    output_states_file = 'statesData.json'
    output_cities_file = 'citiesData.json'

    country_infos = get_all_country_names(input_countries_file)
    all_countries_states = []
    all_cities = []

    for country_info in country_infos:
        country_name = country_info['original_name']
        country_code = country_info['countryCode']
        
        states, countries_cities = get_country_states(country_code, country_name)
        
        all_countries_states.append({
            "country": country_name,
            "countryCode": country_code,
            "states": states
        })
        
        all_cities.extend(countries_cities)

    with open(output_states_file, 'w', encoding='utf-8') as f:
        json.dump(all_countries_states, f, indent=2, ensure_ascii=False)

    with open(output_cities_file, 'w', encoding='utf-8') as f:
        json.dump(all_cities, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
