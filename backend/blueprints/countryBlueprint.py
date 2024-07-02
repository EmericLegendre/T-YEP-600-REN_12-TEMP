from flask import Blueprint, jsonify, request
from models.country import Country
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError

countryBp = Blueprint('countryBlueprint', __name__)

@countryBp.route('/add', methods=['POST'])
def addCountry():
    data = request.get_json()
    required_fields = ['name', 'continent', 'subContinent', 'currency', 'capital', 'population', 'populationName', 'timezone']
    
    # Check for missing fields
    for field in required_fields:
        if field not in data:
            return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        new_country = Country(
            name=data['name'],
            continent=data['continent'],
            subContinent=data['subContinent'],
            currency=data['currency'],
            capital=data['capital'],
            population=data['population'],
            populationName=data['populationName'],
            timezone=data['timezone']
        )
        db.session.add(new_country)
        db.session.commit()
        return jsonify({'message': 'Country created successfully', 'country': new_country.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@countryBp.route('/get', methods=['GET'])
def getCountries():
    try:
        countries = Country.query.all()
        return jsonify([{
            'id': country.id,
            'name': country.name,
            'continent': country.continent,
            'subContinent': country.subContinent,
            'currency': country.currency,
            'capital': country.capital,
            'population': country.population,
            'populationName': country.populationName,
            'timezone': country.timezone
        } for country in countries]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400

@countryBp.route('/get/<int:id>', methods=['GET'])
def getCountryById(id):
    try:
        country = Country.query.get(id)
        if country is None:
            return jsonify({'error': 'Country not found'}), 404
        return jsonify({
            'id': country.id,
            'name': country.name,
            'continent': country.continent,
            'subContinent': country.subContinent,
            'currency': country.currency,
            'capital': country.capital,
            'population': country.population,
            'populationName': country.populationName,
            'timezone': country.timezone
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400
    
@countryBp.route('/delete/<int:id>', methods=['DELETE'])
def deleteCountry(id):
    try:
        country = Country.query.get(id)
        if country is None:
            return jsonify({'error': 'Country not found'}), 404

        db.session.delete(country)
        db.session.commit()
        return jsonify({'message': 'Country deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400