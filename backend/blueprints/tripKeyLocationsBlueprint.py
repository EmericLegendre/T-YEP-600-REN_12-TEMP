from flask import Blueprint, jsonify, request
from models.tripKeyLocations import TripKeyLocations
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required


tripKeyLocationsBp = Blueprint('tripKeyLocationsBlueprint', __name__)


# TripKeyLocations routes


@tripKeyLocationsBp.route('/add', methods=['POST'])
@jwt_required()
def add_trip_key_locations():
    data = request.get_json()

    key_location_id = data.get('key_location_id')
    trip_id = data.get('trip_id')

    if not key_location_id or not trip_id:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the TripKeyLocation already exists
    existing_trip_key_location = (TripKeyLocations.query
                                  .filter_by(trip_id=trip_id, key_locations_id=key_location_id)
                                  .first())

    if existing_trip_key_location:
        return jsonify({'error': 'Trip keyLocation already exists'}), 400

    # Get the maximum position for the current trip
    max_position = db.session.query(db.func.max(TripKeyLocations.position)).filter_by(trip_id=trip_id).scalar()
    new_position = (max_position or 0) + 1  # Set the new position to max + 1

    # Create the new TripKeyLocation
    new_trip_key_location = TripKeyLocations(
        key_locations_id=key_location_id,
        trip_id=trip_id,
        position=new_position
    )

    db.session.add(new_trip_key_location)
    db.session.commit()

    return jsonify({'message': 'Trip keyLocation created successfully', "tripKeyLocationId": new_trip_key_location.id, "position":new_trip_key_location.position}), 201

@tripKeyLocationsBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_trip_key_location(id):
    try:
        trip_key_location = TripKeyLocations.query.get(id)
        if trip_key_location is None:
            return jsonify({'error': 'Trip key location not found'}), 404

        trip_id = trip_key_location.trip_id

        # Delete the trip key location
        db.session.delete(trip_key_location)
        db.session.commit()

        # Reorder remaining locations for the same trip
        remaining_trip_key_locations = (TripKeyLocations.query
                                        .filter_by(trip_id=trip_id)
                                        .order_by(TripKeyLocations.position)
                                        .all())

        # Update positions sequentially
        for index, location in enumerate(remaining_trip_key_locations):
            location.position = index + 1

        db.session.commit()

        return jsonify({'message': 'Trip key location deleted and positions reordered successfully'}), 200
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


@tripKeyLocationsBp.route('/get/<int:id>', methods=['GET'])
@jwt_required()
def get_trip_key_location_by_id(id):
    try:
        trip_key_location = TripKeyLocations.query.get(id)
        if trip_key_location is None:
            return jsonify({'error': 'Trip Key location not found'}), 404
        return jsonify({
            'key_location_id': trip_key_location.key_locations_id,
            'trip_id': trip_key_location.trip_id,
            'position': trip_key_location.position
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@tripKeyLocationsBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_trip_key_location(id):
    data = request.get_json()
    new_position = data.get('position')

    if new_position is None:
        return jsonify({'error': 'Missing required field: position'}), 400

    try:
        trip_key_location = TripKeyLocations.query.get(id)
        if trip_key_location is None:
            return jsonify({'error': 'Trip key location not found'}), 404

        trip_id = trip_key_location.trip_id
        old_position = trip_key_location.position

        # If the new position is the same, no need to update
        if new_position == old_position:
            return jsonify({'message': 'No changes made'}), 200

        # Fetch all trip key locations for the same trip
        trip_key_locations = (TripKeyLocations.query
                              .filter_by(trip_id=trip_id)
                              .order_by(TripKeyLocations.position)
                              .all())

        # Shift positions based on the new position
        if new_position < old_position:  # Moving up
            for location in trip_key_locations:
                if new_position <= location.position < old_position:
                    location.position += 1
        else:  # Moving down
            for location in trip_key_locations:
                if old_position < location.position <= new_position:
                    location.position -= 1

        # Set the new position for the updated entry
        trip_key_location.position = new_position

        db.session.commit()

        return jsonify({'message': 'Trip key location updated and positions adjusted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


