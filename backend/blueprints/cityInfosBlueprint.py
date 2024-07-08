from flask import Blueprint, jsonify, request
from models.cityInfos import CityInfos, CategoryEnum
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token

cityInfosBp = Blueprint('cityInfosBlueprint', __name__)

@cityInfosBp.route('/add', methods=['POST'])
@jwt_required()
def add_city_info():
    data = request.get_json()
    required_fields = ['city_id', 'category', 'content']
    
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
        new_city_info = CityInfos(
            city_id=data['city_id'],
            category=category,
            content=data['content']
        )
        db.session.add(new_city_info)
        db.session.commit()
        return jsonify({'message': 'CityInfo created successfully', 'cityInfo': new_city_info.id}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400