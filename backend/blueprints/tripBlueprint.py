from flask import Blueprint, jsonify, request
from models.trip import Trip
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required

tripBp = Blueprint('tripBlueprint', __name__)


# Trip routes

@tripBp.route('/add', methods=['POST'])
@jwt_required()
def add_trip():
    data = request.get_json()

    user_id = data.get("user_id")

    required_fields = ['user_id']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    not_archived_trip = Trip.query.filter(Trip.user_id == user_id).filter(Trip.archived == False).first()
    if not_archived_trip:
        return jsonify({'error': 'Non archived trip found'}), 400

    new_trip = Trip(
        user_id = user_id,
        archived = False
    )

    db.session.add(new_trip)
    db.session.commit()

    return jsonify({'message': 'Trip created successfully'}), 201