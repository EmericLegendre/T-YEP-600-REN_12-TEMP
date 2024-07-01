from flask import Blueprint, jsonify
from models.country import Country
from config.dbConfig import db

countryBp = Blueprint('countryBlueprint', __name__)
