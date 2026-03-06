# Flask Agentic AI Backend

This is a Flask backend application integrated with Agentic AI (LangChain) for handling AI-powered queries.

## Project Structure

```
backend/
├── app.py                  # Main Flask application
├── config.py               # Configuration management
├── agent.py                # AI Agent implementation
├── routes.py               # API endpoints and blueprints
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### 1. Create Virtual Environment

```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# or
source venv/bin/activate  # On macOS/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_here
```

### 4. Run the Application

```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Health Check
- **Endpoint:** `GET /api/agent/health`
- **Description:** Check if the AI agent is initialized and running

### Query Endpoint
- **Endpoint:** `POST /api/agent/query`
- **Request Body:**
  ```json
  {
    "query": "Your question or prompt here"
  }
  ```
- **Response:**
  ```json
  {
    "query": "Your question or prompt here",
    "response": "AI response",
    "status": "success"
  }
  ```

### Chat Endpoint
- **Endpoint:** `POST /api/agent/chat`
- **Request Body:**
  ```json
  {
    "message": "Your message here"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Your message here",
    "reply": "AI response",
    "status": "success"
  }
  ```

## Example Usage

```bash
# Health check
curl http://localhost:5000/api/agent/health

# Send a query
curl -X POST http://localhost:5000/api/agent/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is 5 + 3?"}'

# Chat
curl -X POST http://localhost:5000/api/agent/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, how are you?"}'
```

## Configuration

The application supports multiple environments via `config.py`:
- **development:** Debug mode enabled
- **production:** Debug mode disabled
- **testing:** Testing configuration

Set the environment using the `FLASK_ENV` variable in `.env`

## Key Features

- ✅ Flask REST API with CORS support
- ✅ LangChain integration for Agentic AI
- ✅ OpenAI GPT-4 support
- ✅ Error handling and validation
- ✅ Multi-environment configuration
- ✅ Extensible tool system for agents

## Adding Custom Tools

Edit `agent.py` and add tools to the `_setup_tools()` method:

```python
def _setup_tools(self):
    tools = [
        Tool(
            name="Your Tool Name",
            func=self._your_tool_function,
            description="Description of what this tool does"
        )
    ]
    return tools
```

## Troubleshooting

- **OPENAI_API_KEY not set:** Make sure your `.env` file has the correct API key
- **Module not found:** Run `pip install -r requirements.txt`
- **Port already in use:** Change the port in `app.py` or kill the process using port 5000

## License

This project is part of CodeCrusaders team.
