import requests
import json

def fetch_and_save_data():
    get_all_info = 'https://restcountries.com/v3.1/all'
    try:
        response = requests.get(get_all_info)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching country data: {e}")
        return

    countries_info = []
    for country in data:
        country_name = country['name'].get('nativeName', {}).get('fra', {}).get('common', country['translations'].get('fra', {}).get('common', ''))
        country_code = country["cca2"]
        country_capital = country.get('capital', [''])[0]
        country_population = country.get('population', '')
        country_demonyms = country.get('demonyms', {}).get('fra', {}).get('m', '') or country.get('demonyms', {}).get('eng', {}).get('m', '')
        country_currency = next(iter([currency_info['name'] for currency_info in country.get('currencies', {}).values()]), '')
        country_region = country.get('region', '')
        country_subregion = country.get('subregion', '')
        country_timezones = country.get('timezones', [''])[0]
        country_flag = country.get('flags', {}).get('png', '')
        if 'languages' in country:
                country_languages = list(country['languages'].values())
        else:
            country_languages = []

        country_info = {
            "name": country_name,
            "countryCode": country_code,
            "capital": country_capital,
            "population": country_population,
            "populationName": country_demonyms,
            "currency": country_currency,
            "continent": country_region,
            "subContinent": country_subregion,
            "timezone": country_timezones,
            "languages": country_languages,
            "flag": country_flag
        }

        countries_info.append(country_info)

    with open('countriesData.json', 'w') as json_file:
        json.dump(countries_info, json_file, indent=4)

    print("Data saved to countries_data.json")

if __name__ == '__main__':
    fetch_and_save_data()