from config.dbConfig import db


class CountryInfos(db.Model):
    __tablename__ = 'countryInfos'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    countryId = db.Column(db.Integer, db.ForeignKey('country.id'), nullable=False)
    category = db.Column(db.Enum('Language', 'Culture', 'Law', 'Cooking', 'Health'), nullable=False)
    content = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return (f"CountryInfos(id={self.id!r}, countryId={self.countryId!r}, category={self.category!r}, "
                f"content={self.content!r})")
