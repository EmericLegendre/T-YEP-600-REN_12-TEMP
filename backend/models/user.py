from config.dbConfig import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    """
    User model for storing user details.
    """
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(100), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    address = db.Column(db.String(100), nullable=True)
    city = db.Column(db.String(50), nullable=True)
    postal_code = db.Column(db.String(50), nullable=True)
    country = db.Column(db.String(50), nullable=True)

    trips = db.relationship('Trip', backref='user', lazy=True)

    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())


    def __repr__(self) -> str:
        return (f"User(id={self.id!r}, email={self.email!r}, firstName={self.first_name!r}, "
                f"lastName={self.last_name!r}, address={self.address!r}, city={self.city!r}, "
                f"postalCode={self.postal_code!r}, country={self.country!r})")

    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)

