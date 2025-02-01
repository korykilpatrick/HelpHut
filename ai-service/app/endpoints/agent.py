# app/endpoints/agent.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.agent import get_agent_response

class AgentRequest(BaseModel):
    message: str
    config: dict  # expect a configuration dictionary

router = APIRouter(prefix="/agent", tags=["agent"])

@router.post("/send")
async def send_agent(request: AgentRequest):
    try:
        response = await get_agent_response(request.message, request.config)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
