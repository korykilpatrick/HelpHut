import warnings
# Suppress beta warnings from the as_tool API (optional)
warnings.filterwarnings("ignore")

from pydantic import BaseModel
from langchain_core.runnables import RunnableLambda

# Define Pydantic models for tool input schemas.
class CRUDToolInput(BaseModel):
    operation: str
    data: dict = {}

class NavigationToolInput(BaseModel):
    page: str

class SynthesisToolInput(BaseModel):
    data: dict

# Update tool functions to use model_validate instead of parse_obj.
def crud_func(args: dict) -> str:
    parsed = CRUDToolInput.model_validate(args)
    return f"Performed CRUD operation: {parsed.operation} with data: {parsed.data}"

crud_tool = RunnableLambda(crud_func).as_tool(
    CRUDToolInput,
    name="crud_tool",
    description="Performs database CRUD operations."
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
