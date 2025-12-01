import secrets
import string


def generate_room_id(length: int = 8) -> str:
    """Generate a random room ID using alphanumeric characters"""
    alphabet = string.ascii_letters + string.digits
    return ''.join(secrets.choice(alphabet) for _ in range(length))

