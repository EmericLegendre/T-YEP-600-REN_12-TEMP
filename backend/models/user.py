from config.dbConfig import db
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(50), nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)
    firstName = db.Column(db.String(50), nullable=False)
    lastName = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(50), nullable=True)
    postalCode = db.Column(db.String(50), nullable=True)
    country = db.Column(db.String(50), nullable=True)

    def __repr__(self) -> str:
        return f"User(id={self.id!r}, mail={self.email!r}, password={self.password!r}, firstName={self.firstName!r},\
        lastname={self.lastName!r}, address={self.address!r}, city={self.city!r}, postalCode={self.postalCode!r}, country={self.country!r})"

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
