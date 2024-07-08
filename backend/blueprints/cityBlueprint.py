from flask import Blueprint, jsonify, request
from models.city import City
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token

cityBp = Blueprint('cityBlueprint', __name__)

@cityBp.route('/add', methods=['POST'])
@jwt_required()
def create_city():
    data = request.get_json()
    required_fields = ['name', 'country_id', 'state_id', 'population', 'population_name']
    
    # Check for missing fields
    for field in required_fields:
        if field not in data:
            return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        new_city = City(
            name=data['name'],
            country_id=data['country_id'],
            state_id=data['state_id'],
            population=data['population'],
            population_name=data['population_name']
        )
        db.session.add(new_city)
        db.session.commit()
        return jsonify({'message': 'City created successfully', 'city': new_city.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@cityBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_city(id):
    try:
        city = City.query.get(id)
        if city is None:
            return jsonify({'error': 'City not found'}), 404

        db.session.delete(city)
        db.session.commit()
        return jsonify({'message': 'City deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400