"""Authentication and JWT verification dependency."""

from typing import Optional
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from app.core.config import settings

security_bearer = HTTPBearer(auto_error=False)

DEV_FALLBACK_USER_ID = "00000000-0000-0000-0000-000000000001"


async def get_current_user_id(
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security_bearer)
) -> str:
    """Extract and verify authenticated user_id (UUID) from JWT bearer token."""
    # Development mode fallback for convenience if no token provided
    if not credentials:
        if settings.ENVIRONMENT in ["development", "test"]:
            return DEV_FALLBACK_USER_ID
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization Header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    # Allow dev-user shortcut in development or test
    if token.startswith("dev-user-") and settings.ENVIRONMENT in ["development", "test"]:
        return token.replace("dev-user-", "")

    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        user_id: Optional[str] = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing subject claim (sub)",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return user_id
    except JWTError as e:
        if settings.ENVIRONMENT in ["development", "test"] and token == "test-token":
            return DEV_FALLBACK_USER_ID
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
