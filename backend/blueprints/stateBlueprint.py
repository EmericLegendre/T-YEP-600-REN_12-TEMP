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

@stateBp.route('/get', methods=['GET'])
@jwt_required()
def getStates():
    try:
        states = State.query.all()
        return jsonify([{
            'id': state.id,
            'name': state.name,
            'countryId': state.countryId,
            'population': state.population,
            'populationName': state.populationName,
            'regionalCapital': state.regionalCapital
        } for state in states]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400

@stateBp.route('/get/<int:id>', methods=['GET'])
def getStateById(id):
    try:
        state = State.query.get(id)
        if state is None:
            return jsonify({'error': 'State not found'}), 404
        return jsonify({
            'id': state.id,
            'name': state.name,
            'countryId': state.countryId,
            'population': state.population,
            'populationName': state.populationName,
            'regionalCapital': state.regionalCapital
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400

@stateBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def deleteState(id):
    try:
        state = State.query.get(id)
        if state is None:
            return jsonify({'error': 'State not found'}), 404

        db.session.delete(state)
        db.session.commit()
        return jsonify({'message': 'State deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
