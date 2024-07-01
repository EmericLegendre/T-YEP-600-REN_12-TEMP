from config.dbConfig import db

class City(db.Model):
    __tablename__ = 'city'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    countryId = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    # stateId = db.Column(db.Integer, db.ForeignKey('state.id'), nullable=False)
    population = db.Column(db.String(255), nullable=False)
    populationName = db.Column(db.String(255), nullable=False)

    cityInfos = db.relationship('CityInfos', backref='city', lazy=True)

    def __repr__(self) -> str:
        return f"City(id={self.id!r}, name={self.name!r}, countryId={self.countryId!r}, stateId={self.stateId!r}, population={self.population!r}, populationName={self.populationName!r})"
