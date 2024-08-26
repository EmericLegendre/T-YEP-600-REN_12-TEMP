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

    required_fields = ['keyLocation_id', 'trip_id', 'position']
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


@tripKeyLocationsBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_trip_key_location(id):
    try:
        trip_key_location = TripKeyLocations.query.get(id)
        if trip_key_location is None:
            return jsonify({'error': 'Trip key location not found'}), 404

        db.session.delete(trip_key_location)
        db.session.commit()
        return jsonify({'message': 'Trip key location deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@tripKeyLocationsBp.route('/get', methods=['GET'])
@jwt_required()
def get_trip_key_locations():
    try:
        trip_key_locations = TripKeyLocations.query.all()
        return jsonify([{
            'key_location_id': trip_key_location.key_locations_id,
            'trip_id': trip_key_location.trip_id,
            'position': trip_key_location.position
        } for trip_key_location in trip_key_locations]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400

