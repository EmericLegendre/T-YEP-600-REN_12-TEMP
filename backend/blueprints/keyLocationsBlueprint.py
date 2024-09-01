from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required
from models.keyLocations import KeyLocations
from models.trip import Trip
from models.tripKeyLocations import TripKeyLocations
from models.keyLocations import KeyLocations
from config.dbConfig import db

keyLocationsBp = Blueprint('keyLocationsBlueprint', __name__)


# KeyLocations Routes

# Add new Key Location -> JSON{ name, latitude, longitude, description(optional) }

@keyLocationsBp.route('/add', methods=['POST'])
@jwt_required()
def add_key_location():
    data = request.get_json()

    name = data.get('name')
    place_id = data.get('place_id')

    required_fields = ['name', 'place_id']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    existing_key_location = KeyLocations.query.filter(KeyLocations.place_id == place_id).first()
    if existing_key_location:
        return jsonify({'alreadyExist': 'Key Location with this place_id already exists', 'keyLocation' : {'id' : existing_key_location.id}}), 400

    new_key_location = KeyLocations(
        name=name,
        place_id=place_id
    )

    db.session.add(new_key_location)
    db.session.commit()

    return jsonify({'message': 'Key Location created successfully',
                    'keyLocation': {'id': new_key_location.id, 'place_id': new_key_location.place_id, 'name': new_key_location.name}}), 201


@keyLocationsBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_key_location(id):
    try:
        key_location = KeyLocations.query.get(id)
        if key_location is None:
            return jsonify({'error': 'Key location not found'}), 404

        db.session.delete(key_location)
        db.session.commit()
        return jsonify({'message': 'Key location deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@keyLocationsBp.route('/get', methods=['GET'])
@jwt_required()
def get_key_locations():
    try:
        key_locations = KeyLocations.query.all()
        return jsonify([{
            'id': key_location.id,
            'name': key_location.name,
            'place_id': key_location.place_id
        } for key_location in key_locations]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@keyLocationsBp.route('/get/<int:id>', methods=['GET'])
@jwt_required()
def get_key_location_by_id(id):
    try:
        key_location = KeyLocations.query.get(id)
        if key_location is None:
            return jsonify({'error': 'Key location not found'}), 404
        return jsonify({
            'id': key_location.id,
            'name': key_location.name,
            'place_id': key_location.place_id
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@keyLocationsBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_key_location(id):
    data = request.get_json()
    updatable_fields = ['name', 'place_id']

    for field in data.keys():
        if field not in updatable_fields:
            return jsonify({'error': f'Invalid field: {field}'}), 400

    try:
        key_location = KeyLocations.query.get(id)
        if key_location is None:
            return jsonify({'error': 'Key location not found'}), 404

        for field in updatable_fields:
            if field in data:
                setattr(key_location, field, data[field])

        db.session.commit()
        return jsonify({'message': 'Key location updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    

@keyLocationsBp.route('/get/currentkeylocation', methods=['POST'])
@jwt_required()
def get_current_key_location_by_user_id():
    data = request.get_json()

    if not data or "user_id" not in data:
        return jsonify({"error" : "User ID is required"}), 400
    
    user_id= data['user_id']

    try:
        current_trip = Trip.query.filter_by(user_id=user_id, archived=False).first()

        if current_trip:
            trip_key_locations = TripKeyLocations.query.filter_by(trip_id=current_trip.id).all()

            if trip_key_locations:
                key_location_info = []

                for trip_key_location in trip_key_locations:
                    key_location = KeyLocations.query.get(trip_key_location.key_locations_id)

                    if key_location:
                        key_location_info.append({
                            "trip_key_location_id": trip_key_location.id,
                            "name" : key_location.name,
                            "place_id" : key_location.place_id,
                            "position": trip_key_location.position
                        })
                return jsonify({"key_locations": key_location_info}), 200
        
            else:
                return jsonify({"message": "No current trip_key_locations"}), 404
        else:
            return jsonify({"message": "No current trip fround"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 400