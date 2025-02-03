# app/services/tools.py

import warnings
from pydantic import BaseModel
from langchain_core.runnables import RunnableLambda
from app.db import queries

warnings.filterwarnings("ignore")

class CRUDToolInput(BaseModel):
    operation: str
    data: dict = {}

class NavigationToolInput(BaseModel):
    page: str

class SynthesisToolInput(BaseModel):
    data: dict

def crud_func(args: dict) -> str:
    parsed = CRUDToolInput.model_validate(args)
    op = parsed.operation.lower()
    data = parsed.data
    if op in ["get_user", "read_user", "get"]:
        user_id = data.get("user_id")
        if not user_id:
            return "Missing 'user_id' for get_user operation."
        result = queries.get_user(user_id)
        return f"Retrieved user: {result}"
    elif op in ["update_user", "update"]:
        user_id = data.get("user_id")
        user_data = data.get("user_data")
        if not user_id or not user_data:
            return "Missing 'user_id' or 'user_data' for update_user operation."
        result = queries.update_user(user_id, user_data)
        return f"Updated user: {result}"
    elif op in ["delete_user", "delete"]:
        user_id = data.get("user_id")
        if not user_id:
            return "Missing 'user_id' for delete_user operation."
        result = queries.delete_user(user_id)
        return f"Deleted user: {result}"
    elif op in ["get_partners", "partners"]:
        result = queries.get_partners()
        return f"Partner organizations: {result}"
    else:
        return f"Unsupported operation: {parsed.operation}"

crud_tool = RunnableLambda(crud_func).as_tool(
    CRUDToolInput,
    name="crud_tool",
    description="Performs database CRUD operations. Supported operations: get_user, update_user, delete_user."
)

def navigation_func(args: dict) -> str:
    parsed = NavigationToolInput.model_validate(args)
    return f"Navigating to page: {parsed.page}"

navigation_tool = RunnableLambda(navigation_func).as_tool(
    NavigationToolInput,
    name="navigation_tool",
    description="Helps users navigate the website."
)

def synthesis_func(args: dict) -> str:
    parsed = SynthesisToolInput.model_validate(args)
    return f"Synthesized data from: {parsed.data}"

synthesis_tool = RunnableLambda(synthesis_func).as_tool(
    SynthesisToolInput,
    name="synthesis_tool",
    description="Synthesizes data from various sources."
)
