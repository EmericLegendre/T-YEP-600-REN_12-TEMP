import json
import requests
import os

GEONAMES_USERNAME = 'math56'
PROGRESS_FILE = 'progress.json'
CITIES_FILE = 'cities_data.json'

def save_progress(country_index, state_index, city_index):
    with open(PROGRESS_FILE, 'w') as f:
        json.dump({'country_index': country_index, 'state_index': state_index, 'city_index': city_index}, f)

def load_progress():
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {'country_index': 0, 'state_index': 0, 'city_index': 0}

def save_to_json(data, file_path):
    with open(file_path, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

def fetch_largest_cities_in_state(states_data, min_population=100000, max_results_per_state=10):
    base_url = "http://api.geonames.org/searchJSON"
    all_cities = []

    progress = load_progress()
    country_index = progress['country_index']
    state_index = progress['state_index']
    city_index = progress['city_index']

    for i, country_data in enumerate(states_data):
        if i < country_index:
            continue

        country_name = country_data["country"]
        country_code = country_data["countryCode"]
        print(f"Fetching cities for {country_name}...")

        for j, state in enumerate(country_data["states"]):
            if i == country_index and j < state_index:
                continue

            adminCode1 = state["adminCode1"]
            state_name = state["name"]
            print(f"Fetching cities for {state_name}...")

            params = {
                "country": country_code,
                "adminCode1": adminCode1,
                "username": GEONAMES_USERNAME,
                "orderby": "population",
                "featureCode": ["PPLC", "PPLA", "PPLA2"]
            }

            try:
                response = requests.get(base_url, params=params)
                response.raise_for_status()
                data = response.json()
                print(data)

                if 'geonames' in data and data['geonames']:
                    cities = data['geonames']
                    print(f"Found {len(cities)} cities for {state_name}")

                    # Separate PPLA, PPLA2, and PPLC cities
                    ppla_cities = [city for city in cities if city.get('fcode', '') == 'PPLA']
                    ppla2_cities = [city for city in cities if city.get('fcode', '') == 'PPLA2']
                    pplc_cities = [city for city in cities if city.get('fcode', '') == 'PPLC']

                    # Combine and limit the results to max_results_per_state
                    cities_to_add = (pplc_cities + ppla_cities + ppla2_cities)[:max_results_per_state]

                    for k, city in enumerate(cities_to_add):
                        if i == country_index and j == state_index and k < city_index:
                            continue

                        city_data = {
                            "name": city["name"],
                            "population": city.get("population", 0),
                            "state_name": state_name,
                            "country_name": country_name,
                            "populationName": ""
                        }
                        all_cities.append(city_data)
                        save_progress(i, j, k + 1)
                        save_to_json(all_cities, CITIES_FILE)

            except requests.exceptions.RequestException as e:
                print(f"An error occurred: {e}")

    return all_cities

def main():
    with open('states_data.json', 'r', encoding='utf-8') as file:
        countries_states_data = json.load(file)

    cities = fetch_largest_cities_in_state(countries_states_data)

    if cities:
        print(f"City data saved to {CITIES_FILE}")
    else:
        print("Failed to fetch cities.")

if __name__ == '__main__':
    main()
