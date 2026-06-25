from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import ConversationCreate, ConversationOut, ConversationWithMessages
from app.services import conversation_service

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.post("/", response_model=ConversationOut, status_code=201)
async def create_conversation(data: ConversationCreate, db: AsyncSession = Depends(get_db)):
    return await conversation_service.create_conversation(db, data)


@router.get("/", response_model=list[ConversationOut])
async def list_conversations(db: AsyncSession = Depends(get_db)):
    return await conversation_service.get_all_conversations(db)


@router.get("/{conversation_id}", response_model=ConversationWithMessages)
async def get_conversation(conversation_id: str, db: AsyncSession = Depends(get_db)):
    convo = await conversation_service.get_conversation(db, conversation_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")
    messages = await conversation_service.get_conversation_messages(db, conversation_id)
    return ConversationWithMessages(
        id=convo.id,
        persona=convo.persona,
        title=convo.title,
        created_at=convo.created_at,
        updated_at=convo.updated_at,
        messages=messages,
    )


@router.delete("/{conversation_id}", status_code=204)
async def delete_conversation(conversation_id: str, db: AsyncSession = Depends(get_db)):
    deleted = await conversation_service.delete_conversation(db, conversation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Conversation not found")
