from flask import Blueprint, jsonify, request
from models.state import State
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token

stateBp = Blueprint('stateBlueprint', __name__)

@stateBp.route('/add', methods=['POST'])
@jwt_required()
def addState():
    data = request.get_json()
    required_fields = ['name', 'countryId', 'population', 'populationName', 'regionalCapital']
    
    # Check for missing fields
    for field in required_fields:
        if field not in data:
            return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        new_state = State(
            name=data['name'],
            countryId=data['countryId'],
            population=data['population'],
            populationName=data['populationName'],
            regionalCapital=data['regionalCapital']
        )
        db.session.add(new_state)
        db.session.commit()
        return jsonify({'message': 'State created successfully', 'state': new_state.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400