import unittest
from backend.config.dbConfig import db
from backend.models.keyLocations import KeyLocations
from sqlalchemy import inspect

class TestKeyLocationsModel(unittest.TestCase):

    def setUp(self):
        self.engine = db.create_engine('sqlite:///:memory:')
        db.metadata.create_all(self.engine)
        self.connection = self.engine.connect()
        self.trans = self.connection.begin()
        self.session = db.orm.sessionmaker(bind=self.connection)()

    def tearDown(self):
        self.session.close()
        self.trans.rollback()
        self.connection.close()
        self.engine.dispose()

    def test_keylocations_table_mapping(self):
        inspector = inspect(self.engine)
        self.assertIn('keyLocations', inspector.get_table_names())

    def test_keylocations_non_null_constraints(self):
        columns = inspect(self.engine).get_columns('keyLocations')
        non_nullable_columns = [col['name'] for col in columns if not col['nullable']]
        self.assertIn('name', non_nullable_columns)
        self.assertIn('description', non_nullable_columns)
        self.assertIn('latitude', non_nullable_columns)
        self.assertIn('longitude', non_nullable_columns)

    def test_keylocations_timestamp_fields(self):
        columns = inspect(self.engine).get_columns('keyLocations')
        created_at_column = next(col for col in columns if col['name'] == 'created_at')
        updated_at_column = next(col for col in columns if col['name'] == 'updated_at')
        self.assertEqual(created_at_column['default'], "CURRENT_TIMESTAMP")
        self.assertEqual(updated_at_column['default'], "CURRENT_TIMESTAMP")
        self.assertEqual(updated_at_column['onupdate'], "CURRENT_TIMESTAMP")

if __name__ == '__main__':
    unittest.main()