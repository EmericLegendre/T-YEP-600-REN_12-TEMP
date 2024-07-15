from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token
from models.user import User
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError

userBp = Blueprint('userBlueprint', __name__)


# User Routes

# User Authentication ad give JWT token
@userBp.route('/auth', methods=['POST'])
def authentication():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()

    if user and user.verify_password(password):
        token = create_access_token(identity=user.email)
        return jsonify({'apiToken': token}), 200
    else:
        return jsonify({'error': 'Invalid username or password'}), 401


# Create User -> JSON {email, password, first_name, last_name, country, city}
@userBp.route('/add', methods=['POST'])
def add_user():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    country = data.get('country')
    city = data.get('city')

    required_fields = ['email', 'password', 'first_name', 'last_name', 'country', 'city']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    existing_user = User.query.filter(User.email == email).first()
    if existing_user:
        return jsonify({'error': 'User with this email already exists'}), 400

    new_user = User(
        email=email,
        password=password,
        firstName=first_name,
        lastName=last_name,
        country=country,
        city=city
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully',
                    'user': {'id': new_user.id, 'email': new_user.email}}), 201


# Delete User -> userId in URL
@userBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    try:
        country = User.query.get(id)
        if country is None:
            return jsonify({'error': 'User not found'}), 404

        db.session.delete(country)
        db.session.commit()
        return jsonify({'message': 'User deleted successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# Update user infos -> JSON {optionals : email, password, first_name, last_name, country, city}
@userBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    data = request.get_json()
    updatable_fields = ['email', 'password', 'first_name', 'last_name', 'country', 'city']

    for field in data.keys():
        if field not in updatable_fields:
            return jsonify({'error': f'Invalid field: {field}'}), 400

    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({'error': 'Country not found'}), 404

        for field in updatable_fields:
            if field in data:
                setattr(user, field, data[field])

        db.session.commit()
        return jsonify({'message': 'User updated successfully'}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400


# Get User informations -> userId in URL
@userBp.route('/get/<int:id>', methods=['GET'])
@jwt_required()
def get_country_by_id(id):
    try:
        user = User.query.get(id)
        if user is None:
            return jsonify({'error': 'User not found'}), 404
        return jsonify({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'country': user.country,
            'city': user.city

        }), 200
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 400
