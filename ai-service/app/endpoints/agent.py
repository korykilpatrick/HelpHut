# app/endpoints/agent.py
from fastapi import APIRouter, HTTPException
from app.services.agent import get_agent_response

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/send")
async def send_agent(message: str):
    try:
        response = await get_agent_response(message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
