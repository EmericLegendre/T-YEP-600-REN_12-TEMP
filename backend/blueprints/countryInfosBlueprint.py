from flask import Blueprint, jsonify
from models.countryInfos import CountryInfos
from config.dbConfig import db

countryBp = Blueprint('countryBlueprint', __name__)
