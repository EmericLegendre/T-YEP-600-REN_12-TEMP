import unittest
from datetime import datetime
from backend.config.dbConfig import db
from backend.models.state import State  # Replace 'your_module' with the actual module name where the State class is defined
from sqlalchemy.exc import IntegrityError

class TestStateModel(unittest.TestCase):

    def setUp(self):
        self.app = your_flask_app  # Replace with your actual Flask app
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(self.app)
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_state_model_mapping(self):
        with self.app.app_context():
            state = State(name="Test State", countryId=1, population=1000000, populationName="Million", regionalCapital="Test Capital")
            db.session.add(state)
            db.session.commit()
            retrieved_state = State.query.filter_by(name="Test State").first()
            self.assertIsNotNone(retrieved_state)
            self.assertEqual(retrieved_state.name, "Test State")
            self.assertEqual(retrieved_state.countryId, 1)
            self.assertEqual(retrieved_state.population, 1000000)
            self.assertEqual(retrieved_state.populationName, "Million")
            self.assertEqual(retrieved_state.regionalCapital, "Test Capital")

    def test_state_name_uniqueness(self):
        with self.app.app_context():
            state1 = State(name="Unique State", countryId=1, population=1000000, populationName="Million", regionalCapital="Capital A")
            db.session.add(state1)
            db.session.commit()
            state2 = State(name="Unique State", countryId=2, population=2000000, populationName="Million", regionalCapital="Capital B")
            db.session.add(state2)
            with self.assertRaises(IntegrityError):
                db.session.commit()

    def test_state_timestamps(self):
        with self.app.app_context():
            state = State(name="Timestamp State", countryId=1, population=1000000, populationName="Million", regionalCapital="Capital")
            db.session.add(state)
            db.session.commit()
            self.assertIsNotNone(state.created_at)
            self.assertIsNotNone(state.updated_at)
            self.assertIsInstance(state.created_at, datetime)
            self.assertIsInstance(state.updated_at, datetime)
            old_updated_at = state.updated_at
            state.name = "Updated Timestamp State"
            db.session.commit()
            self.assertNotEqual(state.updated_at, old_updated_at)

if __name__ == '__main__':
    unittest.main()