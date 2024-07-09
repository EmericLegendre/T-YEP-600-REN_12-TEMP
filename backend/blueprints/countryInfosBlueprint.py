from flask import Blueprint, jsonify, request
from models.countryInfos import CountryInfos, CategoryEnum
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required

countryInfosBp = Blueprint('countryInfosBlueprint', __name__)


# Country infos routes

@countryInfosBp.route('/add', methods=['POST'])
@jwt_required()
def add_country_info():
    data = request.get_json()
    required_fields = ['country_id', 'category', 'content']

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
        new_country_info = CountryInfos(
            country_id=data['country_id'],
            category=category,
            content=data['content']
        )
        db.session.add(new_country_info)
        db.session.commit()
        return jsonify({'message': 'Country info created successfully', 'country_info': new_country_info.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@countryInfosBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_country_info(id):
    try:
        country_info = CountryInfos.query.get(id)
        if country_info is None:
            return jsonify({'error': 'Country info not found'}), 404

        db.session.delete(country_info)
        db.session.commit()
        return jsonify({'message': 'Country info deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@countryInfosBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_country_info(id):
    data = request.get_json()
    updatable_fields = ['country_id', 'category', 'content']

    for field in data.keys():
        if field not in updatable_fields:
            return jsonify({'error': f'Invalid field: {field}'}), 400

    try:
        country = CountryInfos.query.get(id)
        if country is None:
            return jsonify({'error': 'Country info not found'}), 404

        for field in updatable_fields:
            if field in data:
                setattr(country, field, data[field])

        db.session.commit()
        return jsonify({'message': 'Country info updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
