# File: app/services/donation_parser.py

from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from app.config import settings
from app.models.schemas import DonationDetails

# Initialize the LLM using your API key.
llm = ChatOpenAI(model="gpt-4o", temperature=0, openai_api_key=settings.OPENAI_API_KEY)

# Wrap the LLM for structured output to match DonationDetails.
structured_llm = llm.with_structured_output(DonationDetails)

# Define a prompt template that instructs the model to extract donation details.
# For handling, the prompt now instructs the model to decide true or false for each attribute
# based solely on the text (without needing explicit user declarations).
prompt_template = (
    "Assume today is {current_date}. You are an assistant tasked with extracting structured donation details "
    "from a natural language query. The output must be a valid JSON object with the following keys:\n"
    "- \"food_type\": one of \"Baked Goods\", \"Fresh Produce\", \"Other\", \"Pantry Items\", or \"Prepared Foods\".\n"
    "- \"quantity\": an object with:\n"
    "     - \"amount\": a number extracted from the text.\n"
    "     - \"unit\": one of \"Pounds\", \"Kilograms\", \"Items\", or \"Servings\". If the text mentions an unrecognized unit such as \"loaves\", map it to \"Items\".\n"
    "- \"pickup_window\": an object with:\n"
    "     - \"startTime\": an ISO 8601 datetime string.\n"
    "     - \"endTime\": an ISO 8601 datetime string.\n"
    "   Interpret phrases like \"tomorrow morning\" as meaning the pickup starts at 08:00 and ends at 12:00 on the day after {current_date}.\n"
    "- \"handling\": an object with the following boolean attributes: \"refrigeration\", \"freezing\", \"fragile\", and \"heavyLifting\". "
    "For each attribute, based solely on the input text, decide whether it should be true or false. "
    "For example, set \"refrigeration\" to true if the text implies the item needs to be kept cold (e.g. mentions \"refrigerated\", \"chilled\", or \"keep cold\"); "
    "set \"freezing\" to true if the text implies it should be frozen (e.g. mentions \"frozen\" or \"freezer\"); "
    "set \"fragile\" to true if the text indicates the item is delicate (e.g. mentions \"fragile\", \"delicate\", or \"easily broken\"); "
    "set \"heavyLifting\" to true if the text suggests the item is heavy or cumbersome (e.g. mentions \"heavy\", \"bulk\", or \"difficult to move\"). "
    "Otherwise, set the value to false.\n"
    "- \"notes\": include any additional descriptive details from the text. For instance, if the text mentions a specific variety (like \"bread\"), "
    "include that in \"notes\" and adjust \"food_type\" if appropriate (e.g. if \"bread\" is mentioned, use \"Baked Goods\").\n\n"
    "Extract the details from the following text:\n{text}\n\n"
    "Output must be valid JSON."
)

# Create a prompt template that accepts both 'text' and 'current_date'.
prompt = PromptTemplate(template=prompt_template, input_variables=["text", "current_date"])

# Build the chain using the chaining operator.
donation_chain = prompt | structured_llm

async def parse_donation(text: str) -> dict:
    # Compute the current date as a string (YYYY-MM-DD).
    current_date = datetime.now().strftime("%Y-%m-%d")
    # Invoke the chain asynchronously. Note: pass a mapping with keys matching input_variables.
    donation_details = await donation_chain.ainvoke(input={"text": text, "current_date": current_date})
    # Return the structured output as a dictionary.
    return donation_details.dict()
