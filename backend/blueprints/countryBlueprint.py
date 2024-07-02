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
