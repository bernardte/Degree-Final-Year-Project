import aiohttp
import json
import asyncio

LLM_URL   = "http://localhost:11434/api/generate"
LLM_MODEL = "mistral"
TIMEOUT   = 30  # seconds

async def stream_llm(prompt: str):
    """
    Stream tokens from local Ollama server as they are generated.
    Handles timeouts and connection issues gracefully.
    """
    payload = {
        "model":  LLM_MODEL,
        "prompt": prompt,
        "stream": True,   # Enable streaming
        "temperature": 0.2
    }

    try:
        timeout = aiohttp.ClientTimeout(total=TIMEOUT)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.post(LLM_URL, json=payload) as resp:
                if resp.status != 200:
                    yield f"[Error] LLM server returned status {resp.status}"
                    return

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

    except asyncio.TimeoutError:
        yield "[Error] LLM request timed out."
    except aiohttp.ClientConnectionError:
        yield "[Error] Could not connect to LLM server."
    except Exception as e:
        yield f"[Error] Unexpected issue: {str(e)}"
