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


@tripBp.route('/archive/<int:id>', methods=['PUT'])
@jwt_required()
def archive_trip(id):

    try:
        trip = Trip.query.get(id)
        if trip is None:
            return jsonify({'error': 'Trip not found'}), 404
        if trip.archived:
            return jsonify({'error': 'Trip already archived'}), 400

        setattr(trip, 'archived', True)

        db.session.commit()
        return jsonify({'message': 'Trip archived successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


@tripBp.route('/get', methods=['GET'])
@jwt_required()
def get_trips():
    try:
        trips = Trip.query.all()
        return jsonify([{
            'id': trip.id,
            'user_id': trip.user_id,
            'archived': trip.archived
        } for trip in trips]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@tripBp.route('/get/archived', methods=['GET'])
@jwt_required()
def get_archived_trips():
    try:
        trips = Trip.query.filter(Trip.archived == True).all()
        return jsonify([{
            'id': trip.id,
            'user_id': trip.user_id,
            'archived': trip.archived
        } for trip in trips]), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400


@tripBp.route('/get/<int:id>', methods=['GET'])
@jwt_required()
def get_trip_by_id(id):
    try:
        trip = Trip.query.get(id)
        if trip is None:
            return jsonify({'error': 'Trip not found'}), 404
        return jsonify({
            'id': trip.id,
            'user_id': trip.user_id,
            'archived': trip.archived
        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400

