from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token
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
    description = data.get('description')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    required_fields = ['name', 'description', 'latitude', 'longitude']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    existing_key_location = KeyLocations.query.filter(KeyLocations.name == name).first()
    if existing_key_location:
        return jsonify({'error': 'Key Location with this name already exists'}), 400

    new_key_location = KeyLocations(
        name=name,
        description=description,
        latitude=latitude,
        longitude=longitude,
    )

    db.session.add(new_key_location)
    db.session.commit()

    return jsonify({'message': 'Key Location created successfully',
                    'user': {'id': new_key_location.id, 'email': new_key_location.name}}), 201


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
            'description': key_location.description,
            'latitude': key_location.latitude,
            'longitude': key_location.longitude
        } for key_location in key_locations]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@keyLocationsBp.route('/get/<int:id>', methods=['GET'])
@jwt_required()
def get_key_location_by_id(id):
    key_location = KeyLocations.query.get(id)
    try:
        key_location = KeyLocations.query.get(id)
        if key_location is None:
            return jsonify({'error': 'Key location not found'}), 404
        return jsonify({
            'id': key_location.id,
            'name': key_location.name,
            'description': key_location.description,
            'latitude': key_location.latitude,
            'longitude': key_location.longitude
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@keyLocationsBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_key_location(id):
    data = request.get_json()
    updatable_fields = ['name', 'description', 'latitude', 'longitude']

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
