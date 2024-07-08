import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config.dbConfig import db
from backend.models import City, BaseMixin  
from backend.models import City, CityInfos, CategoryEnum  # Assurez-vous d'importer correctement vos modèles


class CityModelTestCase(unittest.TestCase):
    def setUp(self):
        # Créer une base de données en mémoire
        self.engine = create_engine('sqlite:///:memory:')
        db.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.session = self.Session()

    def tearDown(self):
        # Supprimer toutes les tables après chaque test
        db.metadata.drop_all(self.engine)
        self.session.close()

    def test_create_city(self):
        # Créer une instance de City et la sauvegarder dans la base de données
        city = City(name='Paris', country_id=1, state_id=1, population=2148327, population_name='Two Million')
        self.session.add(city)
        self.session.commit()

        # Récupérer la ville de la base de données
        retrieved_city = self.session.query(City).filter_by(name='Paris').first()
        self.assertIsNotNone(retrieved_city)
        self.assertEqual(retrieved_city.name, 'Paris')
        self.assertEqual(retrieved_city.country_id, 1)
        self.assertEqual(retrieved_city.state_id, 1)
        self.assertEqual(retrieved_city.population, 2148327)
        self.assertEqual(retrieved_city.population_name, 'Two Million')

    def test_city_relationship(self):
        # Tester la relation city_infos
        city = City(name='Paris', country_id=1, state_id=1, population=2148327, population_name='Two Million')
        self.session.add(city)
        self.session.commit()

        city_infos = CityInfos(cityId=city.id, category=CategoryEnum.CULTURE, content='Cultural information')
        self.session.add(city_infos)
        self.session.commit()

        retrieved_city = self.session.query(City).filter_by(name='Paris').first()
        self.assertEqual(len(retrieved_city.city_infos), 1)
        self.assertEqual(retrieved_city.city_infos[0].info, 'Some info')

if __name__ == '__main__':
    unittest.main()
