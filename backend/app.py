from flask import Flask

from blueprints.stateBlueprint import stateBp
from blueprints.countryInfosBlueprint import countryInfosBp
from blueprints.countryBlueprint import countryBp
from blueprints.userBlueprint import userBp
from blueprints.cityBlueprint import cityBp
from blueprints.cityInfosBlueprint import cityInfosBp
from blueprints.stateInfosBlueprint import stateInfosBp
from blueprints.keyLocationsBlueprint import keyLocationsBp
from config.dbConfig import dbConfig, db
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(dbConfig)

    # init config & migrations
    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(userBp, url_prefix='/api/users')
    app.register_blueprint(keyLocationsBp)
    app.register_blueprint(countryBp)
    app.register_blueprint(countryInfosBp)
    app.register_blueprint(cityBp)
    app.register_blueprint(cityInfosBp)
    app.register_blueprint(stateInfosBp)
    app.register_blueprint(stateBp)
    
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
