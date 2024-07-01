from flask import Blueprint, jsonify
from models.stateInfos import StateInfos
from config.dbConfig import db

stateInfosBp = Blueprint('stateInfosBlueprint', __name__)
