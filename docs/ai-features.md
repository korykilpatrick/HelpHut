# HelpHut AI Features

This document outlines the AI features planned for HelpHut, their requirements, and implementation considerations.

## 1. Smart Donation Form Auto-Population

### Overview
An AI-powered text input field at the top of the donation form that can interpret natural language descriptions and automatically populate form fields.

### User Experience
1. User enters a natural language description of their donation
2. AI processes the text and extracts relevant information
3. Form fields are automatically populated
4. User can review and adjust any fields before submission

### Information Extraction
The system should extract:
- Food type/items
- Quantity and units
- Pickup date and time
- Storage requirements
- Expiration dates
- Special handling instructions
- Location details (if provided)

### Example Inputs
```
"I have 50 pounds of fresh apples available for pickup tomorrow morning"
→ Food Type: "Fresh Produce" (foodTypeId from available options)
→ Quantity: { amount: 50, unit: "lbs" }
→ Handling Requirements: {
    refrigeration: true,
    freezing: false,
    fragile: false,
    heavyLifting: false
  }
→ Pickup Window: {
    startTime: "2024-03-21T09:00" (tomorrow morning),
    endTime: "2024-03-21T12:00" (tomorrow noon)
  }
→ Notes: "Fresh apples in good condition"

"3 trays of unused catering food from an event, needs pickup by 6pm today"
→ Food Type: "Prepared Food" (foodTypeId from available options)
→ Quantity: { amount: 3, unit: "items" }
→ Handling Requirements: {
    refrigeration: true,
    freezing: false,
    fragile: false,
    heavyLifting: false
  }
→ Pickup Window: {
    startTime: "2024-03-20T14:00" (current date, afternoon),
    endTime: "2024-03-20T18:00" (today 6pm)
  }
→ Notes: "Unused catering trays from corporate event"

"20 gallons of milk expiring in 3 days, refrigerated storage required"
→ Food Type: "Dairy" (foodTypeId from available options)
→ Quantity: { amount: 20, unit: "items" }
→ Handling Requirements: {
    refrigeration: true,
    freezing: false,
    fragile: false,
    heavyLifting: true
  }
→ Pickup Window: {
    startTime: (current date/time),
    endTime: (3 days from now)
  }
→ Notes: "Milk gallons expiring in 3 days, requires refrigeration"
```

### Technical Requirements
1. Python AI Service:
   - FastAPI server with CORS support
   - Separate deployment from main Express backend
   - JSON response format matching TypeScript types
   - Error handling with standard HTTP status codes

2. LangChain Components:
   - Structured output parser
   - Custom prompt template
   - Output validation
   - Chat memory management
   - Vector storage (if needed)

3. Integration Points:
   - Frontend API client for AI endpoints
   - Form field mapping
   - Validation system
   - Error handling
   - Type definitions shared between Python and TypeScript

4. Edge Cases:
   - Ambiguous quantities
   - Multiple food items
   - Unclear timing
   - Missing required information
   - AI service timeout handling
   - Rate limiting

5. Development Setup:
   - Local Python environment
   - FastAPI development server
   - Environment variables for service URLs
   - Docker configuration (optional)

## 2. Contextual Chat Assistant

### Overview
A context-aware chat interface available in the bottom right corner of every page that can answer questions and perform actions based on user role and history.

### User Experience
1. Chat icon always visible in bottom right
2. Opens into a chat interface
3. Maintains conversation history
4. Provides suggested actions/questions
5. Can perform actions directly through chat

### Role-Based Capabilities

#### All Users
- View personal statistics
- Get help with system features
- Check status of active items
- Update profile information
- View impact metrics

#### Donors
- Update existing donations
- Check donation status
- Schedule new pickups
- Modify pickup times
- View donation history

#### Volunteers
- Query available pickups
- Update delivery status
- Check route information
- Modify schedule
- Report issues

#### Partners
- Check incoming deliveries
- Update receiving capacity
- Modify preferences
- View expected donations

### Example Interactions

```
Donor Queries:
- "Update my last order to be for 30 lbs, not 20 lbs"
- "What's the status of my donation from yesterday?"
- "Can someone pick up this donation by 3pm?"

Volunteer Queries:
- "How many donations have I claimed this week?"
- "Show me available pickups near downtown"
- "Mark my current delivery as completed"

Partner Queries:
- "When is our next delivery arriving?"
- "Update our receiving hours for tomorrow"
- "How much food have we received this month?"
```

### Technical Requirements

1. Core Components:
   - FastAPI Python service
   - Chat interface (React)
   - Message history management (Python/LangChain)
   - Role-based access control
   - Action executor
   - Response generator

2. Integration Points:
   - User authentication
   - Database queries
   - Form operations
   - Notification system
   - Analytics system
   - WebSocket support (optional for real-time chat)

3. Python Service Architecture:
   - FastAPI routes for chat operations
   - LangChain chat memory management
   - Action handlers for different user roles
   - Type definitions matching TypeScript
   - Error handling and validation

4. Security Considerations:
   - Authentication validation
   - Action authorization
   - Data access controls
   - Input sanitization
   - Rate limiting
   - API key management
   - CORS configuration
