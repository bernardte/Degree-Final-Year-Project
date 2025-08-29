import aiohttp
import json

LLM_URL   = "http://localhost:11434/api/generate"
LLM_MODEL = "mistral"
TIMEOUT   = 30  # seconds

async def stream_llm(prompt: str):
    """
    Stream tokens from local Ollama server as they are generated.
    """
    payload = {
        "model":  LLM_MODEL,
        "prompt": prompt,
        "stream": True,   # Enable streaming
        "temperature": 0.2
    }

    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=TIMEOUT)) as session:
        async with session.post(LLM_URL, json=payload) as resp:
            buffer = b""
            async for chunk in resp.content.iter_chunked(1024):
                buffer += chunk
                while b"\n" in buffer:
                    line, buffer = buffer.split(b"\n", 1)
                    if not line.strip():
                        continue
                    try:
                        data = json.loads(line.decode("utf-8"))
                    except json.JSONDecodeError:
                        continue
                    token = data.get("response")
                    if token:
                        yield token
