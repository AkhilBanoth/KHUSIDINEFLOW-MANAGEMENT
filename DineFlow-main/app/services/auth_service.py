import bcrypt

from app.database.mongodb import users_collection
from app.services.common import serialize_user_document


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


class AuthService:

    @staticmethod
    def authenticate(email: str, password: str) -> dict:
        user = users_collection.find_one({"email": email.lower()})
        if not user:
            raise ValueError("Invalid email or password")
        if not verify_password(password, user.get("password", "")):
            raise ValueError("Invalid email or password")
        if not user.get("is_active", True):
            raise ValueError("User account is deactivated")
        return serialize_user_document(user)

    @staticmethod
    def login(email: str, password: str) -> dict:
        return AuthService.authenticate(email, password)

    @staticmethod
    def register(data) -> dict:
        from app.services.user_service import UserService
        return UserService.create_user(data)
