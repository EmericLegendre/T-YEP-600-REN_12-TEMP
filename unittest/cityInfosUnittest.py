import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config.dbConfig import db
from backend.models import City, CityInfos, CategoryEnum  # Assurez-vous d'importer correctement vos modèles

class CityInfosModelTestCase(unittest.TestCase):
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

    def test_create_city_infos(self):
        # Créer une instance de City
        city = City(name='Paris', country_id=1, state_id=1, population=2148327, population_name='Two Million')
        self.session.add(city)
        self.session.commit()

        # Créer une instance de CityInfos et la sauvegarder dans la base de données
        city_infos = CityInfos(cityId=city.id, category=CategoryEnum.CULTURE, content='Cultural information')
        self.session.add(city_infos)
        self.session.commit()

        # Récupérer les informations de la ville de la base de données
        retrieved_city_infos = self.session.query(CityInfos).filter_by(cityId=city.id).first()
        self.assertIsNotNone(retrieved_city_infos)
        self.assertEqual(retrieved_city_infos.cityId, city.id)
        self.assertEqual(retrieved_city_infos.category, CategoryEnum.CULTURE)
        self.assertEqual(retrieved_city_infos.content, 'Cultural information')

    def test_city_infos_relationship(self):
        # Créer une instance de City
        city = City(name='Paris', country_id=1, state_id=1, population=2148327, population_name='Two Million')
        self.session.add(city)
        self.session.commit()

        # Créer une instance de CityInfos et la sauvegarder dans la base de données
        city_infos = CityInfos(cityId=city.id, category=CategoryEnum.TRANSPORT, content='Transport information')
        self.session.add(city_infos)
        self.session.commit()

        # Vérifier la relation entre City et CityInfos
        retrieved_city = self.session.query(City).filter_by(id=city.id).first()
        self.assertEqual(len(retrieved_city.city_infos), 1)
        self.assertEqual(retrieved_city.city_infos[0].content, 'Transport information')

if __name__ == '__main__':
    unittest.main()
