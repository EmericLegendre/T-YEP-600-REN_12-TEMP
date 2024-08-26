from flask import Blueprint, jsonify, request
from models.tripKeyLocations import TripKeyLocations
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required


tripKeyLocationsBp = Blueprint('tripKeyLocationsBlueprint', __name__)


# TripKeyLocations routes


@tripKeyLocationsBp.route('/add', methods=['POST'])
@jwt_required()
def add_trip_KeyLocations():
    data = request.get_json()

    key_location_id = data.get('keyLocation_id')
    trip_id = data.get('trip_id')
    position = data.get('position')

    required_fields = ['key_location_id', 'trip_id', 'position']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    existing_trip_key_location = (TripKeyLocations.query.filter(TripKeyLocations.trip_id == trip_id)
                                                        .filter(TripKeyLocations.key_locations_id == key_location_id)
                                                        .first())

    if existing_trip_key_location:
        return jsonify({'error': 'Trip keyLocation already exists'}), 400

    new_trip_key_location = TripKeyLocations(
        key_locations_id = key_location_id,
        trip_id = trip_id,
        position = position
    )

    db.session.add(new_trip_key_location)
    db.session.commit()

    return jsonify({'message': 'Trip created successfully'}), 201

