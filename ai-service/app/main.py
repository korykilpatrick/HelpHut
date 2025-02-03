# app/main.py
from fastapi import FastAPI
from app.endpoints import chat, donation, agent

app = FastAPI(title="AI Service")

app.include_router(chat.router)
app.include_router(donation.router)
app.include_router(agent.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
