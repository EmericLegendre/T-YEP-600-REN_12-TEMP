from flask import Blueprint, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required, create_access_token
from models.keyLocations import KeyLocations
from config.dbConfig import db

keyLocationsBp = Blueprint('keyLocationsBlueprint', __name__)


# KeyLocations Routes

# Add new Key Location -> JSON{ name, latitude, longitude, description(optional) }

@keyLocationsBp.route('/add', methods=['POST'])
def addKeyLocation():
    data = request.get_json()

    name = data.get('name')
    description = data.get('description')
    latitude = data.get('latitude')
    longitude = data.get('longitude')

    required_fields = ['name', 'description', 'latitude', 'longitude']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    existingKeyLocation = KeyLocations.query.filter(KeyLocations.name == name).first()
    if existingKeyLocation:
        return jsonify({'error': 'Key Location with this name already exists'}), 400

    newKeyLocation = KeyLocations(
        name=name,
        description=description,
        latitude=latitude,
        longitude=longitude,
    )

    db.session.add(newKeyLocation)
    db.session.commit()

    return jsonify({'message': 'Key Location created successfully',
                    'user': {'id': newKeyLocation.id, 'email': newKeyLocation.name}}), 201
