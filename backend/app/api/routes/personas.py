from fastapi import APIRouter
from app.core.personas import PERSONAS

router = APIRouter(prefix="/personas", tags=["personas"])


@router.get("/")
async def list_personas():
    """Return all persona metadata for the frontend."""
    return [
        {
            "id": key.value,
            "name": config["name"],
            "display_name": config["display_name"],
            "tagline": config["tagline"],
            "color": config["color"],
            "emoji": config["emoji"],
        }
        for key, config in PERSONAS.items()
    ]
