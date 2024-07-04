import json
import os
import sys
from flask import Flask, jsonify
from sqlalchemy.exc import SQLAlchemyError
from dotenv import load_dotenv
from config.dbConfig import db
from models.country import Country
from models.countryInfos import CountryInfos
from models.state import State
from models.city import City
from models.stateInfos import StateInfos
from models.cityInfos import CityInfos

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
            else:
                new_country = Country(
                    name=country_data['name'],
                    continent=country_data['continent'],
                    subContinent=country_data['subContinent'],
                    currency=country_data['currency'],
                    capital=country_data['capital'],
                    population=country_data['population'],
                    populationName=country_data['populationName'],
                    timezone=country_data['timezone']
                )
                db.session.add(new_country)
                db.session.commit()
                
                for language in country_data.get('languages', []):
                    existing_country_info = CountryInfos.query.filter_by(content=language, category='Language').first()
                    if existing_country_info:
                        print(f"Language {language} for country {country_data['name']} already exists in the database.")
                        continue
                    
                    country_info = CountryInfos(
                        countryId=new_country.id,
                        content=language,
                        category='Language'
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

        for region_data in region_data['states']:
            region_name = region_data['name']
            existing_region = State.query.filter_by(name=region_name, countryId=country.id).first()
            if existing_region:
                print(f"Region {region_name} in {country_name} already exists in the database. Skipping insertion.")
                continue
            try:
                new_state = State(
                    name=region_data['name'],
                    regionalCapital=region_data.get('regionalCapital', ''),
                    population=region_data['population'],
                    populationName=region_data['populationName'],
                    countryId=country.id
                )
                db.session.add(new_state)
                db.session.commit()
                success_count += 1
            except SQLAlchemyError as e:
                db.session.rollback()
                print(f"Error inserting state data: {e}")

    return f"{success_count} states created successfully"

def populate_countries_from_json():
    with open('countries_data.json', 'r') as json_file:
        countries = json.load(json_file)

    response = insert_countries_to_db(countries)
    print(response)

def populate_states_from_json():
    with open('countries_states.json', 'r') as json_file:
        states_data = json.load(json_file)

    result = insert_states_to_db(states_data)
    print(result)

if __name__ == '__main__':
    if len(sys.argv) > 2:
        print("Usage: python script.py [countries|states]")
        sys.exit(1)

    option = sys.argv[1] if len(sys.argv) > 1 else ""

    with app.app_context():
        if option == "countries":
            populate_countries_from_json()
        elif option == "states":
            populate_states_from_json()
        else:
            populate_countries_from_json()
            populate_states_from_json()

