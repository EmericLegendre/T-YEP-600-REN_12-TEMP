from flask import Blueprint, jsonify
from models.countryInfos import CountryInfos
from config.dbConfig import db

countryInfosBp = Blueprint('countryInfosBlueprint', __name__)
