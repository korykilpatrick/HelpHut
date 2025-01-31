from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services import donation_parser

router = APIRouter(prefix="/donation", tags=["donation"])

class DonationInput(BaseModel):
    text: str

@router.post("/parse")
async def parse_donation(input: DonationInput):
    try:
        parsed = await donation_parser.parse_donation(input.text)
        return parsed
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
