import json
from app.config import settings
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

# Use the same OpenAI API key.
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=settings.OPENAI_API_KEY)

# Define a prompt template to extract donation details.
prompt_template = """
Extract donation details from the following text and output a JSON object with keys:
"food_type", "quantity" (object with "amount" and "unit"), "pickup_window" (object with "startTime" and "endTime"),
"handling" (object with "refrigeration", "freezing", "fragile", "heavyLifting"),
and optionally "notes".
Text: {text}
"""

prompt = PromptTemplate(template=prompt_template, input_variables=["text"])

donation_chain = LLMChain(llm=llm, prompt=prompt)

async def parse_donation(text: str) -> dict:
    result = await donation_chain.arun(text=text)
    try:
        parsed = json.loads(result)
    except Exception:
        parsed = {"error": "Parsing failed", "raw_output": result}
    return parsed
