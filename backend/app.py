from flask import Flask

from blueprints.countryBlueprint import countryBp
from blueprints.userBlueprint import userBp
from blueprints.keyLocationsBlueprint import keyLocationsBp
from config.dbConfig import dbConfig, db
from flask_migrate import Migrate


def create_app():
    app = Flask(__name__)
    app.config.from_object(dbConfig)

    # init config & migrations
    db.init_app(app)
    migrate = Migrate(app, db)

    app.register_blueprint(userBp)
    app.register_blueprint(keyLocationsBp)
    app.register_blueprint(countryBp)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
