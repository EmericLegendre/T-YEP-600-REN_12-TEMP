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
        return jsonify({'message': 'State info created successfully', 'state_info': new_state_info.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@stateInfosBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_country_info(id):
    data = request.get_json()
    updatable_fields = ['state_id', 'category', 'content']

    for field in data.keys():
        if field not in updatable_fields:
            return jsonify({'error': f'Invalid field: {field}'}), 400

    try:
        state = StateInfos.query.get(id)
        if state is None:
            return jsonify({'error': 'State info not found'}), 404

        for field in updatable_fields:
            if field in data:
                setattr(state, field, data[field])

        db.session.commit()
        return jsonify({'message': 'State info updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
