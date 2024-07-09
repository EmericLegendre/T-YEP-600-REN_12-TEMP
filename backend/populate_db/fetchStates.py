import os
import json
import requests
from urllib.parse import urlencode


GEONAMES_USERNAME = 'math56'


def get_all_country_names():
    with open('countriesData.json', 'r', encoding='utf-8') as file:
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
    
def get_all_capital_state(country_code,):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureCode": ["PPLA", "PPLC"],
        "username": GEONAMES_USERNAME
    }
    query_string = urlencode(params)
    url = f"{base_url}?{query_string}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        cities = response.json()
        capitals = {}
        if 'geonames' not in cities:
            return capitals
        for city in cities['geonames']:
            adminCode1 = city.get('adminCode1', None)
            if adminCode1:
                capitals[adminCode1] = city['name']
        return capitals,cities
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def get_country_states(country_code):
    all_country_cities = []
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureCode": "ADM1",
        "maxRows": 100,
        "username": GEONAMES_USERNAME
    }
    response = requests.get(base_url, params=params)
    response.raise_for_status()
    data = response.json()
    states = []
    capital_cities,cities = get_all_capital_state(country_code)
    for state in data['geonames']:
        state_name = state["adminName1"]
        state_population = state.get("population", 0)
        adminCode1 = state["adminCode1"]
        countryCode = state["countryCode"]
        regional_capital = capital_cities.get(adminCode1, "")
        population_name = ""
        states.append({
            "name": state_name,
            "regionalCapital": regional_capital,
            "population": state_population,
            "populationName": population_name,
            "adminCode1": adminCode1,
            "countryCode": countryCode
        })
        for cities in cities['geonames']:
            if cities['adminCode1'] == adminCode1:
                city_data = {
                            "name": cities["name"],
                            "population": cities.get("population", 0),
                            "state_name": state_name,
                            "country_name": cities,
                            "populationName": ""
                        }
                all_country_cities.extend(city_data)
        
    return states,all_country_cities

def main():
    all_cities = []
    country_infos = get_all_country_names()
    all_countries_states = []

    for country_info in country_infos:
        original_name = country_info['original_name']
        country_code = country_info['countryCode']
        states,countries_cities = get_country_states(country_code)
        all_countries_states.append({
            "country": original_name,
            "countryCode": country_code,
            "states": states
        })
        all_cities.extend(countries_cities)

    with open('statesData.json', 'w', encoding='utf-8') as f:
        json.dump(all_countries_states, f, indent=2, ensure_ascii=False)
    
    

if __name__ == '__main__':
    main()