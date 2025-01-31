from app.config import settings
from langchain_openai import ChatOpenAI 
from langchain.schema import HumanMessage, AIMessage

# Initialize the chat model using your OpenAI API key.
chat_model = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=settings.OPENAI_API_KEY)

# Global conversation history (in memory)
conversation_history = []

async def get_chat_response(message: str) -> str:
    global conversation_history
    # Append the user’s message.
    conversation_history.append(HumanMessage(content=message))
    # Get the AI response asynchronously.
    response = await chat_model.ainvoke(conversation_history)
    conversation_history.append(response)
    return response.content

def get_history():
    return [
        {"role": "human" if msg.__class__.__name__ == "HumanMessage" else "ai", "content": msg.content}
        for msg in conversation_history
    ]
