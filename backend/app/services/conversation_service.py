from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.conversation import Conversation
from app.models.message import Message
from app.schemas.schemas import ConversationCreate
import uuid


async def create_conversation(db: AsyncSession, data: ConversationCreate) -> Conversation:
    convo = Conversation(
        id=str(uuid.uuid4()),
        persona=data.persona.value,
        title=data.title,
    )
    db.add(convo)
    await db.commit()
    await db.refresh(convo)
    return convo


async def get_conversation(db: AsyncSession, conversation_id: str) -> Conversation | None:
    result = await db.execute(select(Conversation).where(Conversation.id == conversation_id))
    return result.scalar_one_or_none()


async def get_all_conversations(db: AsyncSession) -> list[Conversation]:
    result = await db.execute(select(Conversation).order_by(Conversation.updated_at.desc()))
    return list(result.scalars().all())


async def get_conversation_messages(db: AsyncSession, conversation_id: str) -> list[Message]:
    result = await db.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
    )
    return list(result.scalars().all())


async def add_message(db: AsyncSession, conversation_id: str, role: str, content: str) -> Message:
    msg = Message(
        id=str(uuid.uuid4()),
        conversation_id=conversation_id,
        role=role,
        content=content,
    )
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg


async def delete_conversation(db: AsyncSession, conversation_id: str) -> bool:
    convo = await get_conversation(db, conversation_id)
    if not convo:
        return False
    await db.delete(convo)
    await db.commit()
    return True
