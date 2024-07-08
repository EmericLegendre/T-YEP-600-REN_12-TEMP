from flask import Blueprint, jsonify, request
from models.city import City
from models.country import Country
from models.state import State
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token

cityBp = Blueprint('cityBlueprint', __name__)

@cityBp.route('/add', methods=['POST'])
@jwt_required()

def add_city():
    data = request.get_json()
    required_fields = ['name', 'country_id', 'state_id', 'population', 'population_name']
    
    # Vérifier les champs obligatoires
    for field in required_fields:
        if field not in data:
            return jsonify({'error': 'Missing required fields'}), 400

    # Vérifier si country_id et state_id existent
    if not Country.query.get(data['country_id']):
        return jsonify({'error': 'Country not found'}), 404
    if not State.query.get(data['state_id']):
        return jsonify({'error': 'State not found'}), 404
    
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
    
@cityBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_city(id):
    data = request.get_json()
    updatable_fields = ['name', 'country_id', 'state_id', 'population', 'population_name']
    
    # Valider que tous les champs dans la requête sont valides
    for field in data.keys():
        if field not in updatable_fields:
            return jsonify({'error': f'Invalid field: {field}'}), 400
    
    try:
        city = City.query.get(id)
        if city is None:
            return jsonify({'error': 'City not found'}), 404

        # Vérifier si country_id et state_id existent si mis à jour
        if 'country_id' in data and not Country.query.get(data['country_id']):
            return jsonify({'error': 'Country not found'}), 404
        if 'state_id' in data and not State.query.get(data['state_id']):
            return jsonify({'error': 'State not found'}), 404

        # Mettre à jour seulement les champs fournis
        for field in updatable_fields:
            if field in data:
                setattr(city, field, data[field])

        db.session.commit()
        return jsonify({'message': 'City updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
