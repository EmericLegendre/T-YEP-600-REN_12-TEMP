import requests
from flask import Flask
from config.dbConfig import dbConfig, db
from models.country import Country

def insert_countries_to_db(countries):
    for country_data in countries:
        country = Country(
            name=country_data['name'],
            continent=country_data['region'],
            subContinent=country_data['subregion'],
            currency=country_data['currency'],
            capital=country_data['capital'],
            population=country_data['population'],
            populationName=country_data['demonyms'],
            timezone=country_data['timezones']
        )
        db.session.add(country)
        print("country : ", country.id)
    
    db.session.commit()
    print("Countries inserted successfully!")

def fetch_and_populate():
    get_all_info = 'https://restcountries.com/v3.1/all'
    data = requests.get(get_all_info).json()
    countries_info = []

    for country in data:
        country_name = country.get('name', {}).get('common', '')
        country_capital = country.get('capital', [''])[0]
        country_population = country.get('population', '')
        country_demonyms = country.get('demonyms', {}).get('eng', {}).get('m', '')
        country_currency = next(iter([currency_info['name'] for currency_info in country.get('currencies', {}).values()]), '')
        country_region = country.get('region', '')
        country_subregion = country.get('subregion', '')
        country_timezones = country.get('timezones', [''])[0]

        country_info = {
            "name": country_name,
            "capital": country_capital,
            "population": country_population,
            "demonyms": country_demonyms,
            "currency": country_currency,
            "region": country_region,
            "subregion": country_subregion,
            "timezones": country_timezones
        }

        countries_info.append(country_info)

    return countries_info

if __name__ == '__main__':
    countries = fetch_and_populate()
    insert_countries_to_db(countries)
