import unittest
from flask import Flask
from backend.config.dbConfig import db
from backend.models.city import City, CityInfos  # Adjust the import according to your project structure
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


    def test_city_model_duplicate_name_constraint(self):
        city1 = City(name="Duplicate City", country_id=3, state_id=3, population=75000, population_name="Medium")
        db.session.add(city1)
        db.session.commit()

        with self.assertRaises(IntegrityError):
            city2 = City(name="Duplicate City", country_id=4, state_id=4, population=80000, population_name="Large")
            db.session.add(city2)
            db.session.commit()

    def test_multiple_cities_creation_and_retrieval(self):
        city1 = City(name="City 1", country_id=1, state_id=1, population=10000, population_name="Small")
        city2 = City(name="City 2", country_id=2, state_id=2, population=20000, population_name="Medium")
    
        db.session.add(city1)
        db.session.add(city2)
        db.session.commit()
    
        retrieved_cities = City.query.all()
    
        self.assertEqual(len(retrieved_cities), 2)
        self.assertEqual(retrieved_cities[0].name, "City 1")
        self.assertEqual(retrieved_cities[1].name, "City 2")

    def test_save_city_missing_country_id(self):
        with self.assertRaises(IntegrityError):
            city = City(name="City Without Country", state_id=1, population=5000, population_name="Small")
            db.session.add(city)
            db.session.commit()

    def test_delete_city_entity(self):
        city = City(name="City to Delete", country_id=1, state_id=1, population=5000, population_name="Small")
        db.session.add(city)
        db.session.commit()

        db.session.delete(city)
        db.session.commit()

        retrieved_city = City.query.filter_by(name="City to Delete").first()
        self.assertIsNone(retrieved_city)

    def test_save_city_large_population(self):
        city = City(name="City with Large Population", country_id=2, state_id=2, population=1000000000, population_name="Very Large")
        db.session.add(city)
        db.session.commit()

        retrieved_city = City.query.filter_by(name="City with Large Population").first()
        self.assertIsNotNone(retrieved_city)
        self.assertEqual(retrieved_city.population, 1000000000)

    def test_query_cities_by_population_range(self):
        cities = City.query.filter(City.population.between(50000, 100000)).all()
        for city in cities:
            self.assertTrue(city.population >= 50000 and city.population <= 100000)

    def test_table_creation_multiple_connections(self):
        connection1 = db.engine.connect()
        connection2 = db.engine.connect()
        trans1 = connection1.begin()
        trans2 = connection2.begin()
    
        db.metadata.create_all(db.engine)
    
        trans1.commit()
        trans2.commit()
    
        connection1.close()
        connection2.close()

    def test_rollback_on_invalid_record_addition(self):
        with self.assertRaises(IntegrityError):
            city1 = City(name="Duplicate City", country_id=3, state_id=3, population=75000, population_name="Medium")
            db.session.add(city1)
            db.session.commit()

            with self.assertRaises(IntegrityError):
                city2 = City(name="Duplicate City", country_id=4, state_id=4, population=80000, population_name="Large")
                db.session.add(city2)
                db.session.commit()

    def test_filter_cities_by_country_id(self):
        city1 = City(name="City 1", country_id=1, state_id=1, population=10000, population_name="Small")
        city2 = City(name="City 2", country_id=2, state_id=2, population=20000, population_name="Medium")
        city3 = City(name="City 3", country_id=1, state_id=3, population=30000, population_name="Large")

        db.session.add(city1)
        db.session.add(city2)
        db.session.add(city3)
        db.session.commit()

        filtered_cities = db.query(City).filter(City.country_id == 1).all()
        self.assertEqual(len(filtered_cities), 2)
        self.assertEqual(filtered_cities[0].name, "City 1")
        self.assertEqual(filtered_cities[1].name, "City 3")

    def test_city_model_missing_state_id(self):
        with self.assertRaises(IntegrityError):
            city = City(name="City Without State", country_id=1, population=5000, population_name="Small")
            db.session.add(city)
            db.session.commit()

    def test_delete_non_existing_city_entity(self):
        city = City(name="City to Keep", country_id=1, state_id=1, population=5000, population_name="Small")
        db.session.add(city)
        db.session.commit()

        db.session.delete(city)
        db.session.commit()

        with self.assertRaises(IntegrityError):
            db.session.delete(city)
            db.session.commit()

    def test_query_cities_by_population_name(self):
        city1 = City(name="City 1", country_id=1, state_id=1, population=10000, population_name="Small")
        city2 = City(name="City 2", country_id=2, state_id=2, population=20000, population_name="Medium")
        city3 = City(name="City 3", country_id=3, state_id=3, population=30000, population_name="Large")
    
        db.session.add(city1)
        db.session.add(city2)
        db.session.add(city3)
        db.session.commit()
    
        retrieved_cities = City.query.filter_by(population_name="Medium").all()
    
        self.assertEqual(len(retrieved_cities), 1)
        self.assertEqual(retrieved_cities[0].name, "City 2")

    def test_delete_nonexistent_city(self):
        city = City(name="City to Delete", country_id=1, state_id=1, population=5000, population_name="Small")
        db.session.add(city)
        db.session.commit()
    
        db.session.delete(city)
        db.session.commit()
    
        # Attempting to delete the same city again
        with self.assertRaises(Exception):
            db.session.delete(city)
            db.session.commit()

    def test_save_city_missing_name(self):
        with self.assertRaises(IntegrityError):
            city = City(country_id=1, state_id=1, population=100000, population_name="Large")
            db.session.add(city)
            db.session.commit()

    def test_save_city_missing_population_name(self):
        with self.assertRaises(IntegrityError):
            city = City(name="Test City", country_id=1, state_id=1, population=100000)
            db.session.add(city)
            db.session.commit()

    def test_query_cities_by_country_id(self):
        cities = City.query.filter_by(country_id=1).all()
        for city in cities:
            self.assertEqual(city.country_id, 1)

    def test_save_city_with_non_integer_population(self):
        with self.assertRaises(IntegrityError):
            city = City(name="Non-Integer Population City", country_id=5, state_id=5, population="Invalid", population_name="Invalid")
            db.session.add(city)
            db.session.commit()

    def test_save_city_with_negative_population(self):
        with self.assertRaises(IntegrityError):
            city = City(name="Negative Population City", country_id=5, state_id=5, population=-100, population_name="Invalid")
            db.session.add(city)
            db.session.commit()



if __name__ == '__main__':
    unittest.main()