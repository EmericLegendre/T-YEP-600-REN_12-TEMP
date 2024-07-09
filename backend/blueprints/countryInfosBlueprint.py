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
