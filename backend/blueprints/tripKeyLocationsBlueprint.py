from flask import Blueprint, jsonify, request
from models.tripKeyLocations import TripKeyLocations
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required

tripKeyLocationsBp = Blueprint('tripKeyLocationsBlueprint', __name__)


# TripKeyLocations routes

