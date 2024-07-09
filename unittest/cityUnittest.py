import unittest
from flask import Flask
from backend.config.dbConfig import db
from backend.models import City, CityInfos  # Adjust the import according to your project structure
from sqlalchemy.exc import IntegrityError
def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    return app

class TestCityModel(unittest.TestCase):

    def setUp(self):
        self.app = create_app()  # Assuming you have a Flask app factory
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_city_model_save_and_retrieve(self):
        city = City(name="Test City", country_id=1, state_id=1, population=100000, population_name="Large")
        db.session.add(city)
        db.session.commit()

        retrieved_city = City.query.first()
        self.assertIsNotNone(retrieved_city)
        self.assertEqual(retrieved_city.name, "Test City")
        self.assertEqual(retrieved_city.country_id, 1)
        self.assertEqual(retrieved_city.state_id, 1)
        self.assertEqual(retrieved_city.population, 100000)
        self.assertEqual(retrieved_city.population_name, "Large")

    def test_city_model_non_null_constraints(self):
        with self.assertRaises(IntegrityError):
            city = City(country_id=1, state_id=1, population=100000, population_name="Large")
            db.session.add(city)
            db.session.commit()

        with self.assertRaises(IntegrityError):
            city = City(name="Test City", state_id=1, population=100000, population_name="Large")
            db.session.add(city)
            db.session.commit()

        with self.assertRaises(IntegrityError):
            city = City(name="Test City", country_id=1, population=100000, population_name="Large")
            db.session.add(city)
            db.session.commit()

        with self.assertRaises(IntegrityError):
            city = City(name="Test City", country_id=1, state_id=1, population_name="Large")
            db.session.add(city)
            db.session.commit()

        with self.assertRaises(IntegrityError):
            city = City(name="Test City", country_id=1, state_id=1, population=100000)
            db.session.add(city)
            db.session.commit()

    def test_city_model_relationship_with_city_infos(self):
        city = City(name="Test City", country_id=1, state_id=1, population=100000, population_name="Large")
        db.session.add(city)
        db.session.commit()

        city_info = CityInfos(info="Some info", city_id=city.id)
        db.session.add(city_info)
        db.session.commit()

        retrieved_city = City.query.first()
        self.assertEqual(len(retrieved_city.city_infos), 1)
        self.assertEqual(retrieved_city.city_infos[0].info, "Some info")

if __name__ == '__main__':
    unittest.main()