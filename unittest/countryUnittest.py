import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.config.dbConfig import db
from backend.models.country import Country, State, City, CountryInfos  # Assurez-vous d'importer correctement vos modèles

class CountryModelTestCase(unittest.TestCase):
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

    def test_create_country(self):
        # Créer une instance de Country et la sauvegarder dans la base de données
        country = Country(
            name='France',
            continent='Europe',
            sub_continent='Western Europe',
            currency='Euro',
            capital='Paris',
            population=67081000,
            population_name='Sixty-seven million',
            timezone='CET',
            flag='https://flagurl.com/france.png'
        )
        self.session.add(country)
        self.session.commit()

        # Récupérer le pays de la base de données
        retrieved_country = self.session.query(Country).filter_by(name='France').first()
        self.assertIsNotNone(retrieved_country)
        self.assertEqual(retrieved_country.name, 'France')
        self.assertEqual(retrieved_country.continent, 'Europe')
        self.assertEqual(retrieved_country.sub_continent, 'Western Europe')
        self.assertEqual(retrieved_country.currency, 'Euro')
        self.assertEqual(retrieved_country.capital, 'Paris')
        self.assertEqual(retrieved_country.population, 67081000)
        self.assertEqual(retrieved_country.population_name, 'Sixty-seven million')
        self.assertEqual(retrieved_country.timezone, 'CET')
        self.assertEqual(retrieved_country.flag, 'https://flagurl.com/france.png')

    def test_country_relationships(self):
        # Créer une instance de Country
        country = Country(
            name='France',
            continent='Europe',
            sub_continent='Western Europe',
            currency='Euro',
            capital='Paris',
            population=67081000,
            population_name='Sixty-seven million',
            timezone='CET',
            flag='https://flagurl.com/france.png'
        )
        self.session.add(country)
        self.session.commit()

        # Créer une instance de State liée au pays
        state = State(name='Île-de-France', country_id=country.id)
        self.session.add(state)
        self.session.commit()

        # Créer une instance de City liée au pays
        city = City(name='Paris', country_id=country.id, state_id=state.id, population=2148327, population_name='Two Million')
        self.session.add(city)
        self.session.commit()

        # Créer une instance de CountryInfos liée au pays
        country_info = CountryInfos(info='Some country info', country_id=country.id)
        self.session.add(country_info)
        self.session.commit()

        # Vérifier les relations
        retrieved_country = self.session.query(Country).filter_by(id=country.id).first()
        self.assertEqual(len(retrieved_country.states), 1)
        self.assertEqual(retrieved_country.states[0].name, 'Île-de-France')
        self.assertEqual(len(retrieved_country.cities), 1)
        self.assertEqual(retrieved_country.cities[0].name, 'Paris')
        self.assertEqual(len(retrieved_country.country_infos), 1)
        self.assertEqual(retrieved_country.country_infos[0].info, 'Some country info')

if __name__ == '__main__':
    unittest.main()
