from flask import Blueprint, jsonify
from models.cityInfos import CityInfos
from config.dbConfig import db

cityInfosBp = Blueprint('cityInfosBlueprint', __name__)
