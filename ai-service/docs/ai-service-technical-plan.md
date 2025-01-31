# AI Service Technical Plan

## 1. Environment & Architecture Setup

- **Repository & Dependencies:**
  - Create a dedicated folder (`ai-service`) with a FastAPI app.
  - Set up a virtual environment and install dependencies:
    - FastAPI
    - Uvicorn
    - LangChain
    - Pydantic
  - Configure a Dockerfile for containerization.

- **Configuration & Logging:**
  - Implement `config.py` to manage environment variables (API keys, endpoints, etc.).
  - Set up structured logging and error middleware in FastAPI.

---

## 2. Phase 1: Donation Auto-Population

- **Data Modeling:**
  - Define Pydantic schemas in `models/schemas.py` to represent donation fields such as:
    - Food type/items
    - Quantity (amount and unit)
    - Pickup date and time (pickup window)
    - Storage requirements and handling instructions
    - Expiration dates and additional notes
  - Ensure these schemas match the corresponding TypeScript definitions.

- **LangChain Integration:**
  - In `services/donation_parser.py`, build a parser that:
    - Uses custom prompt templates to process natural language input.
    - Leverages a structured output parser to extract donation details.
    - Implements output validation and error handling (e.g., ambiguous or missing fields).

- **API Endpoint:**
  - Create an endpoint in `endpoints/donation.py` (e.g., `POST /donation/parse`) that:
    - Accepts raw natural language input.
    - Calls the donation parser service and returns a JSON response.
    - Handles errors and timeouts with appropriate HTTP status codes.

- **Integration & Testing:**
  - Test the endpoint using sample inputs from your requirements document.
  - Integrate the endpoint with your frontend:
    - Use your TypeScript API client to fetch the parsed JSON.
    - Map the JSON data to the donation form fields.

---

## 3. Phase 2: Contextual Chat Assistant

- **Data Modeling & Role Management:**
  - Expand `models/schemas.py` to include:
    - Chat message schemas
    - Role-based definitions for donors, volunteers, and partners
    - Request and response models covering user messages, context, and suggested actions

- **LangChain Chat Service:**
  - In `services/chat.py`, implement a chat handler that:
    - Maintains conversation history (leveraging LangChain’s memory modules).
    - Processes inputs based on the user's role and context.
    - Triggers role-specific actions and returns structured responses for the frontend.

- **API Endpoints for Chat:**
  - Create endpoints in `endpoints/chat.py`, such as:
    - `POST /chat/send` for processing incoming messages and returning a response.
    - `GET /chat/history` for retrieving conversation history.
    - Optionally, implement WebSocket support for real-time chat interactions.

- **Integration & Testing:**
  - Develop a React chat component to interact with these endpoints.
  - Validate role-based responses and handle edge cases (e.g., invalid roles, timeouts).

---

## 4. Phase 3: Testing, Documentation & Deployment

- **Unit & Integration Testing:**
  - Write tests for the donation parser and chat services.
  - Use tools like Postman or FastAPI’s interactive docs to manually verify endpoints.

- **Documentation:**
  - Utilize FastAPI's built-in OpenAPI support to document endpoints.
  - Provide detailed inline comments and a separate markdown document for:
    - Prompt templates
    - Expected outputs
    - Error handling strategies

- **Deployment:**
  - Finalize the Dockerfile and establish a simple CI/CD pipeline (if necessary).
  - Deploy the service locally or on a lightweight cloud service.
  - Ensure CORS and security configurations are properly set up for cross-service communication.

---

This technical plan provides a step-by-step guide to implementing each feature sequentially, ensuring robustness at every stage before integrating with your main codebase.
