from flask import Blueprint, jsonify, request
from models.stateInfos import StateInfos, CategoryEnum
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required

stateInfosBp = Blueprint('stateInfosBlueprint', __name__)


# State Infos routes

@stateInfosBp.route('/add', methods=['POST'])
@jwt_required()
def add_country_info():
    data = request.get_json()
    required_fields = ['state_id', 'category', 'content']

    # Check for missing fields
    for field in required_fields:
        if field not in data:
            return jsonify({'error': 'Missing required fields'}), 400

    # Check if category is valid
    try:
        category = CategoryEnum[data['category']]
    except KeyError:
        return jsonify({'error': 'Invalid category'}), 400

    try:
        new_state_info = StateInfos(
            state_id=data['state_id'],
            category=category,
            content=data['content']
        )
        db.session.add(new_state_info)
        db.session.commit()
        return jsonify({'message': 'Country info created successfully', 'country_info': new_state_info.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@stateInfosBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_state_info(id):
    try:
        state_info = StateInfos.query.get(id)
        if state_info is None:
            return jsonify({'error': 'StateInfo not found'}), 404

        db.session.delete(state_info)
        db.session.commit()
        return jsonify({'message': 'StateInfo deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400