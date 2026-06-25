from pydantic import BaseModel
from datetime import datetime
from app.core.personas import PersonaType


# ── Message schemas ──────────────────────────────────────────────────────────

class MessageBase(BaseModel):
    role: str
    content: str


class MessageOut(MessageBase):
    id: str
    conversation_id: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ── Conversation schemas ─────────────────────────────────────────────────────

class ConversationCreate(BaseModel):
    persona: PersonaType
    title: str = "New Conversation"


class ConversationOut(BaseModel):
    id: str
    persona: str
    title: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ConversationWithMessages(ConversationOut):
    messages: list[MessageOut] = []


# ── Chat schemas ─────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    conversation_id: str
    message: str
