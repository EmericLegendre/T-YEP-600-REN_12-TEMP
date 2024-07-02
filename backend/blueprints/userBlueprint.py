from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from models.user import User
from config.dbConfig import db

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
