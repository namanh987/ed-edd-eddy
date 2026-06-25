# Ed, Edd n Eddy — AI English Companions Backend

FastAPI + SQLAlchemy + SQLite + Google Gemini

## Setup

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 4. Run the server
python main.py
```

Server runs at `http://localhost:8000`  
Docs at `http://localhost:8000/docs`

## Folder Structure

```
app/
├── api/
│   └── routes/
│       ├── chat.py          # POST /api/chat/stream (SSE)
│       ├── conversations.py # CRUD for conversations
│       └── personas.py      # GET /api/personas
├── core/
│   ├── config.py            # Settings from .env
│   └── personas.py          # Ed, Edd, Eddy definitions
├── db/
│   └── database.py          # Async SQLAlchemy engine
├── models/
│   ├── conversation.py      # Conversation ORM model
│   └── message.py           # Message ORM model
├── schemas/
│   └── schemas.py           # Pydantic request/response schemas
├── services/
│   ├── conversation_service.py  # DB CRUD logic
│   └── gemini_service.py        # Gemini AI + streaming
└── main.py                  # FastAPI app + middleware
```

## Key Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/personas` | List all three personas |
| POST | `/api/conversations` | Create a new conversation |
| GET | `/api/conversations` | List all conversations |
| GET | `/api/conversations/{id}` | Get conversation + messages |
| DELETE | `/api/conversations/{id}` | Delete conversation |
| POST | `/api/chat/stream` | Stream AI response (SSE) |

## SSE Chat Usage

```js
const response = await fetch('http://localhost:8000/api/chat/stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ conversation_id: 'uuid', message: 'Hello!' }),
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const lines = decoder.decode(value).split('\n');
  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const event = JSON.parse(line.slice(6));
      if (event.type === 'chunk') process(event.content);
      if (event.type === 'done') finish();
    }
  }
}
```
