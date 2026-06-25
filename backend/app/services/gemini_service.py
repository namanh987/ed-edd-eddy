import google.generativeai as genai
from typing import AsyncGenerator
from app.core.config import get_settings
from app.core.personas import PERSONAS, PersonaType

settings = get_settings()

genai.configure(api_key=settings.gemini_api_key)

GEMINI_MODEL = "models/gemini-2.5-flash"


def _build_history(messages: list[dict]) -> list[dict]:
    """Convert stored messages to Gemini chat history format."""
    history = []
    for msg in messages:
        role = "user" if msg["role"] == "user" else "model"
        history.append({"role": role, "parts": [msg["content"]]})
    return history


async def stream_chat_response(
    persona: PersonaType,
    history: list[dict],
    user_message: str,
) -> AsyncGenerator[str, None]:
    """
    Stream a response from Gemini given a persona and conversation history.
    Yields text chunks as they arrive.
    """
    persona_config = PERSONAS[persona]
    system_prompt = persona_config["system_prompt"]

    model = genai.GenerativeModel(
        model_name=GEMINI_MODEL,
        system_instruction=system_prompt,
    )

    # Build history excluding the latest user message (passed separately)
    chat_history = _build_history(history)

    chat = model.start_chat(history=chat_history)

    response = await chat.send_message_async(user_message, stream=True)

    async for chunk in response:
        if chunk.text:
            yield chunk.text


async def get_full_response(
    persona: PersonaType,
    history: list[dict],
    user_message: str,
) -> str:
    """Non-streaming version — collects the full response for saving to DB."""
    full_text = []
    async for chunk in stream_chat_response(persona, history, user_message):
        full_text.append(chunk)
    return "".join(full_text)
