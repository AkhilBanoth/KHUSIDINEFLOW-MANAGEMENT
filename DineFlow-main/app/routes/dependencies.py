from fastapi import Depends, HTTPException, status


def handle_error(error: Exception):
    if isinstance(error, HTTPException):
        raise error
    msg = str(error)
    if "not found" in msg.lower():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=msg,
        )
    raise HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail=msg,
    )


def get_current_user() -> dict:
    return {"id": "public", "name": "Guest", "email": "", "role": "GUEST", "is_active": True}


def require_roles(*allowed_roles: str):
    def role_checker(current_user: dict = Depends(get_current_user)) -> dict:
        return current_user

    return role_checker
