# app/services/agent.py
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent
from langchain.schema import HumanMessage
from langgraph.checkpoint.memory import MemorySaver
from app.config import settings
from app.services.tools import crud_tool, navigation_tool, synthesis_tool

llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=settings.OPENAI_API_KEY)
tools = [crud_tool, navigation_tool, synthesis_tool]
memory = MemorySaver()
agent_executor = create_react_agent(llm, tools, checkpointer=memory)

async def get_agent_response(query: str, config: dict) -> str:
    messages = [HumanMessage(content=query)]
    result = await agent_executor.ainvoke({"messages": messages}, config=config)
    agent_messages = result.get("agent", {}).get("messages", [])
    if agent_messages:
        return agent_messages[-1].content
    return "The agent did not return a response."
