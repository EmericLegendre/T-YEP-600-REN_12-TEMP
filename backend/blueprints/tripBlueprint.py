from flask import Blueprint, jsonify, request
from models.trip import Trip
from config.dbConfig import db
from sqlalchemy.exc import SQLAlchemyError
from flask_jwt_extended import jwt_required

tripBp = Blueprint('tripBlueprint', __name__)


# Trip routes

