from config.dbConfig import db


class Country(db.Model):
    __tablename__ = 'country'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(50), nullable=False)
    continent = db.Column(db.String(50), nullable=False)
    subContinent = db.Column(db.String(50), nullable=False)
    currency = db.Column(db.String(50), nullable=False)
    capital = db.Column(db.String(50), nullable=False)
    population = db.Column(db.Integer, nullable=False)
    populationName = db.Column(db.String(50), nullable=False)
    timezone = db.Column(db.String(50), nullable=False)
    countryInfos = db.relationship('CountryInfos', backref='country')
    states = db.relationship('State', backref='country')
    cities = db.relationship('City', backref='country')

    def __repr__(self) -> str:

        return (f"Country(id={self.id!r}, name={self.name!r}, continent={self.continent!r}, "
                f"subContinent={self.subContinent!r}, currency={self.currency!r}, capital={self.capital!r}, "
                f"population={self.population!r}, populationName={self.populationName!r}, timezone={self.timezone!r}, "
                f"countryInfos={self.countryInfos!r})")
