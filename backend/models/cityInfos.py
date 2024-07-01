from config.dbConfig import db

class CityInfos(db.Model):
    __tablename__ = 'cityInfos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cityId = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
    category = db.Column(db.Enum('Culture', 'Transport', 'Cooking', 'Health'), nullable=False)
    content = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return f"CityInfos(id={self.id!r}, cityId={self.cityId!r}, category={self.category!r}, content={self.content!r})"
