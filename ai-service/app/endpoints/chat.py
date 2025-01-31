from fastapi import APIRouter, HTTPException
from app.services import chat

router = APIRouter(prefix="/chat", tags=["chat"])

@router.post("/send")
async def send_chat(message: str):
    try:
        response = await chat.get_chat_response(message)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
def chat_history():
    return {"history": chat.get_history()}
