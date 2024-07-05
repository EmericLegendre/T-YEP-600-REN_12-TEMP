import os
import json
import requests
from sqlalchemy.exc import SQLAlchemyError
from urllib.parse import quote
from dotenv import load_dotenv
from flask import Flask
from config.dbConfig import db
from models.country import Country
from models.state import State
from models.city import City
from models.countryInfos import CountryInfos
from models.stateInfos import StateInfos
from models.cityInfos import CityInfos


load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

GEONAMES_USERNAME = 'math56'

REGIONAL_DATA = {
    "France": {
        "Auvergne-Rhône-Alpes": {"capital": "Lyon", "populationName": "Auvergnat-Rhonalpin"},
        "Bourgogne-Franche-Comté": {"capital": "Dijon", "populationName": "Bourguignon-Franc-Comtois"},
        "Bretagne": {"capital": "Rennes", "populationName": "Breton"},
        "Centre-Val de Loire": {"capital": "Orléans", "populationName": "Centriste-Valois"},
        "Corse": {"capital": "Ajaccio", "populationName": "Corse"},
        "Grand Est": {"capital": "Strasbourg", "populationName": "Alsacien-Champenois-Lorrain"},
        "Hauts-de-France": {"capital": "Lille", "populationName": "Nordiste-Picard"},
        "Île-de-France": {"capital": "Paris", "populationName": "Francilien"},
        "Normandie": {"capital": "Rouen", "populationName": "Normand"},
        "Nouvelle-Aquitaine": {"capital": "Bordeaux", "populationName": "Néo-Aquitain"},
        "Occitanie": {"capital": "Toulouse", "populationName": "Occitan"},
        "Pays de la Loire": {"capital": "Nantes", "populationName": "Pays de la Loire"},
        "Provence-Alpes-Côte d'Azur": {"capital": "Marseille", "populationName": "Provençal-Alpin-Azuréen"},
        "Guadeloupe": {"capital": "Basse-Terre", "populationName": "Guadeloupéen"},
        "Martinique": {"capital": "Fort-de-France", "populationName": "Martiniquais"},
        "Guyane": {"capital": "Cayenne", "populationName": "Guyanais"},
        "La Réunion": {"capital": "Saint-Denis", "populationName": "Réunionnais"},
        "Mayotte": {"capital": "Mamoudzou", "populationName": "Mahorais"}
    }
}

def get_all_country_names():
    try:
        with app.app_context():
            countries = Country.query.all()
            country_names = []
            
            for country in countries:
                name = country.name
                encoded_name = name.replace(' ', '-')
                country_names.append({
                    "original_name": name,
                    "encoded_name": encoded_name
                })
            return country_names
    except SQLAlchemyError as e:
        print(f"Database error: {e}")
        return []

def get_country_id(encoded_country_name):
    base_url = "http://api.geonames.org/searchJSON"
    params = {
        "q": encoded_country_name,
        "featureClass": "A",  # Countries
        "featureCode": "PCLI",  # Primary country subdivisions
        "username": GEONAMES_USERNAME
    }

    try:
        response = requests.get(base_url, params=params)
        response.raise_for_status()
        data = response.json()

        if data['totalResultsCount'] > 0:
            country_id = data['geonames'][0]['geonameId']
            country_code = data['geonames'][0]['countryCode']
            return country_id, country_code
        else:
            return None, None

    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None, None

def get_country_states(country_id, country_name):
    url = f"http://api.geonames.org/childrenJSON?geonameId={country_id}&username={GEONAMES_USERNAME}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        states = []
        for state in data['geonames']:
            state_name = state["name"]
            state_population = state.get("population", 0)
            adminCode1 = state["adminCode1"]
            countryCode = state["countryCode"]
            regional_capital = REGIONAL_DATA.get(country_name, {}).get(state_name, {}).get("capital", "")
            population_name = REGIONAL_DATA.get(country_name, {}).get(state_name, {}).get("populationName", "")
            states.append({
                "name": state_name,
                "regionalCapital": regional_capital,
                "population": state_population,
                "populationName": population_name,
                "adminCode1": adminCode1
            })
        return states
    return []

def main():
    country_infos = get_all_country_names()
    all_countries_states = []

    for country_info in country_infos:
        original_name = country_info['original_name']
        encoded_name = country_info['encoded_name']
        country_id, country_code = get_country_id(encoded_name)
        if country_id:
            states = get_country_states(country_id, original_name)
            all_countries_states.append({
                "country": original_name,
                "countryCode": country_code,
                "states": states
            })
        else:
            print(f"Could not find country ID for {original_name}")

    with open('countries_states.json', 'w', encoding='utf-8') as f:
        json.dump(all_countries_states, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    main()
