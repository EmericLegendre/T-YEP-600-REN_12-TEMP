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


# Create User -> JSON {email, password, firstName, lastName, country, city}
@userBp.route('/add', methods=['POST'])
def addUser():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    country = data.get('country')
    city = data.get('city')

    required_fields = ['email', 'password', 'firstName', 'lastName', 'country', 'city']
    if not all(data.get(field) for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400

    existingUser = User.query.filter(User.email == email).first()
    if existingUser:
        return jsonify({'error': 'User with this email already exists'}), 400

    newUser = User(
        email=email,
        password=password,
        firstName=firstName,
        lastName=lastName,
        country=country,
        city=city
    )

    db.session.add(newUser)
    db.session.commit()

    return jsonify({'message': 'User created successfully',
                    'user': {'id': newUser.id, 'email': newUser.email}}), 201


# Delete User -> userId in URL
@userBp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def deleteUser(id):
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


# Update user infos -> JSON {optionals : email, password, firstName, lastName, country, city}
@userBp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def updateUser(id):
    data = request.get_json()
    updatable_fields = ['email', 'password', 'firstName', 'lastName', 'country', 'city']

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
