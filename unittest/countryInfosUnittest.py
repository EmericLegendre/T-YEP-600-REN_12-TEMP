import unittest
from backend.config.dbConfig import db
from backend.models import CountryInfos, CategoryEnum

class TestCountryInfosModel(unittest.TestCase):

    def setUp(self):
        self.app = your_flask_app.test_client()
        self.app_context = your_flask_app.app_context()
        self.app_context.push()
        db.create_all()

    def tearDown(self):
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_countryinfos_model_storage(self):
        country_info = CountryInfos(countryId=1, category=CategoryEnum.LANGUAGE, content="Sample content")
        db.session.add(country_info)
        db.session.commit()

        retrieved_info = CountryInfos.query.first()
        self.assertIsNotNone(retrieved_info)
        self.assertEqual(retrieved_info.countryId, 1)
        self.assertEqual(retrieved_info.category, CategoryEnum.LANGUAGE)
        self.assertEqual(retrieved_info.content, "Sample content")

    def test_countryinfos_category_enum_validation(self):
        with self.assertRaises(ValueError):
            country_info = CountryInfos(countryId=1, category="InvalidCategory", content="Sample content")
            db.session.add(country_info)
            db.session.commit()

    def test_countryinfos_content_length_validation(self):
        long_content = "a" * 256
        country_info = CountryInfos(countryId=1, category=CategoryEnum.LANGUAGE, content=long_content)
        db.session.add(country_info)
        with self.assertRaises(Exception):
            db.session.commit()

if __name__ == '__main__':
    unittest.main()