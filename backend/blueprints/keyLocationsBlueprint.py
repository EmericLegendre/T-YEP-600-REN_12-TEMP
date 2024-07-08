from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token
from models.keyLocations import KeyLocations
from config.dbConfig import db

keyLocationsBp = Blueprint('keyLocationsBlueprint', __name__)


# KeyLocations Routes

# Add new Key Location -> JSON{ name, latitude, longitude, description(optional) }

@keyLocationsBp.route('/add', methods=['POST'])
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
