from flask import Blueprint, jsonify
from models.country import Country
from config.dbConfig import db

keyLocationsBp = Blueprint('countryBlueprint', __name__)
