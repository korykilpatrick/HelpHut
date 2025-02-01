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

# Define the CRUD function.
def crud_func(args: CRUDToolInput) -> str:
    # Placeholder: perform a CRUD operation.
    return f"Performed CRUD operation: {args.operation} with data: {args.data}"

# Wrap the CRUD function as a tool using a Pydantic model for the input.
crud_tool = RunnableLambda(crud_func).as_tool(
    CRUDToolInput,
    name="crud_tool",
    description="Performs database CRUD operations."
)

# Define the Navigation function.
def navigation_func(args: NavigationToolInput) -> str:
    # Placeholder: help user navigate the website.
    return f"Navigating to page: {args.page}"

navigation_tool = RunnableLambda(navigation_func).as_tool(
    NavigationToolInput,
    name="navigation_tool",
    description="Helps users navigate the website."
)

# Define the Synthesis function.
def synthesis_func(args: SynthesisToolInput) -> str:
    # Placeholder: synthesize provided data.
    return f"Synthesized data from: {args.data}"

synthesis_tool = RunnableLambda(synthesis_func).as_tool(
    SynthesisToolInput,
    name="synthesis_tool",
    description="Synthesizes data from various sources."
)
