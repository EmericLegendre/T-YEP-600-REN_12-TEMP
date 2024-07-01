from flask import Blueprint, jsonify
from models.keyLocations import KeyLocations
from config.dbConfig import db

keyLocationsBp = Blueprint('keyLocationsBlueprint', __name__)
