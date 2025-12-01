from fastapi import APIRouter
from app.schemas.room import AutocompleteRequest, AutocompleteResponse
from app.services.autocomplete_service import get_autocomplete_suggestion

router = APIRouter(prefix="/autocomplete", tags=["autocomplete"])


@router.post("/", response_model=AutocompleteResponse)
def get_autocomplete(request: AutocompleteRequest):
    """Get autocomplete suggestions for the given code and cursor position"""
    return get_autocomplete_suggestion(request)

