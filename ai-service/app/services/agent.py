# app/services/agent.py
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain.schema import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from app.config import settings
from app.services.tools import crud_tool, navigation_tool, synthesis_tool

# Instantiate the ChatOpenAI model using the API key from settings.
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=settings.OPENAI_API_KEY)

# List of tools: placeholders for CRUD, navigation, and synthesis.
tools = [crud_tool, navigation_tool, synthesis_tool]

# Use a simple memory saver to persist conversation context.
memory = MemorySaver()

# Create the agent executor using the React Agent pattern.
agent_executor = create_react_agent(llm, tools, checkpointer=memory)

async def get_agent_response(query: str) -> str:
    """
    Given a natural language query, this function invokes the agent executor.
    The input is wrapped as a list of HumanMessage objects.
    The agent determines whether to call one of the tools or provide a direct answer.
    """
    messages = [HumanMessage(content=query)]
    result = await agent_executor.ainvoke({"messages": messages})
    # For this first draft, assume the final agent response is the last message.
    agent_messages = result.get("agent", {}).get("messages", [])
    if agent_messages:
        return agent_messages[-1].content
    return "The agent did not return a response."
