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
    
def get_all_capital_state(country_code):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "country": country_code,
        "featureCode": "PPLA",
        "featureCode": "PPLC",
        "username": GEONAMES_USERNAME
    }
    query_string = urlencode(params)
    url = f"{base_url}?{query_string}&featureCode=PPLA&featureCode=PPLC"
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        capitals = {}
        if 'geonames' not in data:
            return capitals
        for capital in data['geonames']:
            adminCode1 = capital.get('adminCode1', None)
            if adminCode1:
                capitals[adminCode1] = capital['name']
        return capitals
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None
    

def get_country_code(encoded_country_name):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "q": encoded_country_name,
        "featureClass": "A", 
        "featureCode": "PCLI", 
        "username": GEONAMES_USERNAME
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        if data['totalResultsCount'] > 0:
            country_code = data['geonames'][0]['countryCode']
            return country_code
        else:
            return None, None

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None, None

def get_country_states(country_code):
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
    capital_cities = get_all_capital_state(country_code)
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
    return states

def main():
    country_infos = get_all_country_names()
    all_countries_states = []

    for country_info in country_infos:
        original_name = country_info['original_name']
        country_code = country_info['countryCode']
        states = get_country_states(country_code)
        all_countries_states.append({
            "country": original_name,
            "countryCode": country_code,
            "states": states
        })

    with open('test.json', 'w', encoding='utf-8') as f:
        json.dump(all_countries_states, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()