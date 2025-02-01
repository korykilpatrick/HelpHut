# tests/test_agent.py
import os
import sys
from fastapi.testclient import TestClient
from app.main import app

# Ensure the project root is in the PYTHONPATH if needed.
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

client = TestClient(app)

# Configuration for the checkpointer; this supplies required keys.
CONFIG = {"configurable": {"thread_id": "test_thread", "checkpoint_ns": ""}}

def test_agent_crud():
    message = "Please delete user John"
    response = client.post("/agent/send", json={"message": message, "config": CONFIG})
    print("\n=== CRUD Test Response ===")
    print(response.json())
    assert response.status_code == 200

def test_agent_navigation():
    message = "Take me to the dashboard"
    response = client.post("/agent/send", json={"message": message, "config": CONFIG})
    print("\n=== Navigation Test Response ===")
    print(response.json())
    assert response.status_code == 200

def test_agent_synthesis():
    message = "Please summarize the following data: { 'sales': 100, 'profit': 20 }"
    response = client.post("/agent/send", json={"message": message, "config": CONFIG})
    print("\n=== Synthesis Test Response ===")
    print(response.json())
    assert response.status_code == 200

def test_agent_generic():
    message = "Hello, how are you?"
    response = client.post("/agent/send", json={"message": message, "config": CONFIG})
    print("\n=== Generic Test Response ===")
    print(response.json())
    assert response.status_code == 200
