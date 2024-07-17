import json
import os
import sys
from flask import Flask, jsonify
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from config.dbConfig import db
from models.country import Country
from models.state import State
from models.city import City
from models.countryInfos import CountryInfos, CategoryEnum as CountryEnum
from models.stateInfos import StateInfos, CategoryEnum as StateEnum
from models.cityInfos import CityInfos, CategoryEnum as CityEnum

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def insert_countries_to_db(countries):
    for country_data in countries:
        try:
            existing_country = Country.query.filter_by(name=country_data['name']).first()
            if existing_country:
                print(f"Country {country_data['name']} already exists in the database.")
                continue

            new_country = Country(
                name=country_data['name'],
                continent=country_data['continent'],
                sub_continent=country_data['subContinent'],
                currency=country_data['currency'],
                capital=country_data['capital'],
                population=country_data['population'],
                population_name=country_data['populationName'],
                timezone=country_data['timezone'],
                flag=country_data['flag']
            )
            db.session.add(new_country)
            db.session.commit()

            for language in country_data.get('languages', []):

                country_info = CountryInfos(
                    country_id=new_country.id,
                    content=language,
                    category=CountryEnum.LANGUAGE
                )
                db.session.add(country_info)
                db.session.commit()

        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error inserting country data: {e}")
            return jsonify({'error': str(e)}), 400
    return jsonify({'message': 'Countries created successfully'}), 201

def insert_states_to_db(states_data):
    success_count = 0
    for region_data in states_data:
        country_name = region_data['country']
        country = Country.query.filter_by(name=country_name).first()
        if not country:
            print(f"Country {country_name} not found in the database.")
            continue

        for state_data in region_data['states']:
            state_name = state_data['name']
            existing_state = State.query.filter_by(name=state_name, country_id=country.id).first()
            if existing_state:
                print(f"State {state_name} in {country_name} already exists in the database. Skipping insertion.")
                continue
            try:
                new_state = State(
                    name=state_data['name'],
                    regional_capital=state_data['regionalCapital'],
                    population=state_data['population'],
                    population_name=state_data['populationName'],
                    country_id=country.id
                )
                db.session.add(new_state)
                db.session.commit()
                success_count += 1
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting state data: {e}")

    return f"{success_count} states created successfully"

def insert_cities_to_db(cities_data):
    success_count = 0

    for city_data in cities_data:
        country_name = city_data["country_name"]
        state_name = city_data["state_name"]
        city_name = city_data["name"]
        population = city_data["population"]
        population_name = city_data["populationName"]

        # Find the country
        country = Country.query.filter_by(name=country_name).first()
        if not country:
            print(f"Country {country_name} not found in the database. Skipping city {city_name}.")
            continue

        # Find the state within the country
        state = State.query.filter_by(name=state_name, country_id=country.id).first()
        if not state:
            print(f"State {state_name} in {country_name} not found in the database. Skipping city {city_name}.")
            continue

        # Check if city already exists in the database
        existing_city = City.query.filter_by(name=city_name, state_id=state.id).first()
        if existing_city:
            print(f"City {city_name} in {state_name}, {country_name} already exists in the database. Skipping insertion.")
            continue

        # Create a new City object and add it to the session
        new_city = City(
            name=city_name,
            population=population,
            state_id=state.id,
            country_id=country.id,
            population_name=population_name
        )
        try:
            db.session.add(new_city)
            db.session.commit()
            success_count += 1
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error inserting city {city_name}: {e}")

    return f"{success_count} cities created successfully"

def insert_country_infos_to_db():
    country_infos = [
        {"country_id": 224, "category": CountryEnum.LANGUAGE, "content": "English is the primary language spoken in the USA."},
        {"country_id": 224, "category": CountryEnum.CULTURE, "content": "The USA is known for its diverse culture, including Hollywood and music festivals."},
        {"country_id": 224, "category": CountryEnum.LAW, "content": "The USA has a federal legal system with state-specific laws."},
        {"country_id": 224, "category": CountryEnum.COOKING, "content": "The USA is famous for its fast food and diverse culinary offerings."},
        {"country_id": 224, "category": CountryEnum.HEALTH, "content": "Healthcare in the USA is expensive; travelers should have insurance."},
        {"country_id": 130, "category": CountryEnum.LANGUAGE, "content": "English is the primary language spoken in the UK."},
        {"country_id": 130, "category": CountryEnum.CULTURE, "content": "The UK has a rich historical culture with landmarks like Big Ben and Buckingham Palace."},
        {"country_id": 130, "category": CountryEnum.LAW, "content": "The UK has a common law legal system."},
        {"country_id": 130, "category": CountryEnum.COOKING, "content": "British cuisine includes fish and chips, Sunday roast, and afternoon tea."},
        {"country_id": 130, "category": CountryEnum.HEALTH, "content": "The NHS provides healthcare in the UK; it is free at the point of use for residents."}
    ]

    for info in country_infos:
        try:
            country_info = CountryInfos(**info)
            db.session.add(country_info)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error inserting country info: {e}")

def insert_state_infos_to_db():
    state_infos = [
        {"state_id": 3486, "category": StateEnum.CULTURE, "content": "California is known for its tech industry in Silicon Valley."},
        {"state_id": 3486, "category": StateEnum.LAW, "content": "California has progressive environmental and labor laws."},
        {"state_id": 3486, "category": StateEnum.COOKING, "content": "California cuisine includes fresh produce and fusion dishes."},
        {"state_id": 3486, "category": StateEnum.HEALTH, "content": "California has a strong healthcare system with many top-rated hospitals."},
        {"state_id": 3478, "category": StateEnum.CULTURE, "content": "New York is known for its cultural diversity and Broadway shows."},
        {"state_id": 3478, "category": StateEnum.LAW, "content": "New York has strict gun control laws."},
        {"state_id": 3478, "category": StateEnum.COOKING, "content": "New York is famous for its pizza and bagels."},
        {"state_id": 3478, "category": StateEnum.HEALTH, "content": "New York City has a comprehensive public health system."}
    ]

    for info in state_infos:
        try:
            state_info = StateInfos(**info)
            db.session.add(state_info)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error inserting state info: {e}")

def insert_city_infos_to_db():
    city_infos = [
        {"city_id": 1, "category": CityEnum.CULTURE, "content": "Los Angeles is known for its entertainment industry and beaches."},
        {"city_id": 1, "category": CityEnum.TRANSPORT, "content": "Los Angeles has a widespread car culture and traffic congestion."},
        {"city_id": 1, "category": CityEnum.COOKING, "content": "Los Angeles offers diverse food options from around the world."},
        {"city_id": 1, "category": CityEnum.HEALTH, "content": "Los Angeles has many fitness centers and health-conscious restaurants."},
        {"city_id": 2, "category": CityEnum.CULTURE, "content": "New York City is known for its museums and cultural landmarks."},
        {"city_id": 2, "category": CityEnum.TRANSPORT, "content": "New York City has an extensive subway system."},
        {"city_id": 2, "category": CityEnum.COOKING, "content": "New York City is famous for its street food and high-end restaurants."},
        {"city_id": 2, "category": CityEnum.HEALTH, "content": "New York City offers a range of healthcare services and facilities."}
    ]

    for info in city_infos:
        try:
            city_info = CityInfos(**info)
            db.session.add(city_info)
            db.session.commit()
        except SQLAlchemyError as e:
            db.session.rollback()
            print(f"Error inserting city info: {e}")

def populate_countries_from_json():
    with open('populate_db/countriesData.json', 'r') as json_file:
        countries = json.load(json_file)

    response = insert_countries_to_db(countries)
    print(response)

def populate_states_from_json():
    with open('populate_db/statesData.json', 'r') as json_file:
        states_data = json.load(json_file)

    result = insert_states_to_db(states_data)
    print(result)

def populate_cities_from_json():
    with open('populate_db/citiesData.json', 'r') as json_file:
        cities_data = json.load(json_file)

    result = insert_cities_to_db(cities_data)
    print(result)

if __name__ == '__main__':
    if len(sys.argv) > 2:
        print("Usage: python script.py [countries|states|cities|json|infos]")
        sys.exit(1)

    option = sys.argv[1] if len(sys.argv) > 1 else ""

    with app.app_context():
        if option == "countries":
            populate_countries_from_json()
        elif option == "states":
            populate_states_from_json()
        elif option == "cities":
            populate_cities_from_json()
        elif option == "json":
            populate_countries_from_json()
            populate_states_from_json()
            populate_cities_from_json()
        elif option == "infos":
            insert_country_infos_to_db()
            insert_state_infos_to_db()
            insert_city_infos_to_db()
        else:
            populate_countries_from_json()
            populate_states_from_json()
            populate_cities_from_json()
            insert_country_infos_to_db()
            insert_state_infos_to_db()
            insert_city_infos_to_db()