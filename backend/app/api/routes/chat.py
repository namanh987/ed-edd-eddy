import json
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_db
from app.schemas.schemas import ChatRequest
from app.services import conversation_service
from app.services.gemini_service import stream_chat_response
from app.core.personas import PersonaType

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/stream")
async def chat_stream(request: ChatRequest, db: AsyncSession = Depends(get_db)):
    """
    Stream a chat response as Server-Sent Events (SSE).
    Saves user message and AI response to DB after streaming completes.
    """
    convo = await conversation_service.get_conversation(db, request.conversation_id)
    if not convo:
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Fetch existing history to give Gemini context
    existing_messages = await conversation_service.get_conversation_messages(db, request.conversation_id)
    history = [{"role": m.role, "content": m.content} for m in existing_messages]

    # Save user message immediately
    await conversation_service.add_message(db, request.conversation_id, "user", request.message)

    persona = PersonaType(convo.persona)

    async def event_generator():
        full_response = []
        try:
            async for chunk in stream_chat_response(persona, history, request.message):
                full_response.append(chunk)
                payload = json.dumps({"type": "chunk", "content": chunk})
                yield f"data: {payload}\n\n"

            # Save the complete AI response to DB
            complete_response = "".join(full_response)
            await conversation_service.add_message(db, request.conversation_id, "assistant", complete_response)

            # Signal done
            yield f"data: {json.dumps({'type': 'done'})}\n\n"

        except Exception as e:
            error_payload = json.dumps({"type": "error", "message": str(e)})
            yield f"data: {error_payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
