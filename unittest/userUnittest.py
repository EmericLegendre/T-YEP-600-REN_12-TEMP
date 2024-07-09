import unittest
from backend.config.dbConfig import db
from werkzeug.security import generate_password_hash, check_password_hash
from backend.models.user import User  # Replace 'your_module' with the actual module name where the User class is defined

class TestUserModel(unittest.TestCase):

    def setUp(self):
        self.user = User(email="test@example.com", firstName="John", lastName="Doe")

    def test_password_hashing(self):
        self.user.password = "securepassword"
        self.assertTrue(check_password_hash(self.user.password_hash, "securepassword"))

    def test_password_not_readable(self):
        with self.assertRaises(AttributeError):
            _ = self.user.password

    def test_password_verification(self):
        self.user.password = "securepassword"
        self.assertTrue(self.user.verify_password("securepassword"))
        self.assertFalse(self.user.verify_password("wrongpassword"))

if __name__ == '__main__':
    unittest.main()