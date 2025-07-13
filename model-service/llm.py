import requests

LLM_URL   = "http://localhost:11434/api/generate"
LLM_MODEL = "mistral"
TIMEOUT   = 30  # seconds

def ask_llm(prompt: str) -> str:
    """
    Send a prompt to your local Ollama server (model: mistral) and return the
    raw string response. Raises or logs meaningful errors on failure.
    """
    payload = {
        "model":  LLM_MODEL,
        "prompt": prompt,
        "stream": False
    }

    try:
        resp = requests.post(LLM_URL, json=payload, timeout=TIMEOUT)
        resp.raise_for_status()             # 4xx / 5xx => exception

        data = resp.json()                  # parse only ONCE
        answer = (data.get("response") or "").strip()

        # optional: log full response object if you need it
        print("[LLM‑RAW]", answer[:250])    # preview first 250 chars
        return answer

    except requests.exceptions.Timeout:
        msg = "LLM request timed out after {}'s".format(TIMEOUT)
    except requests.exceptions.HTTPError as e:
        msg = f"LLM server returned HTTP : {e}"
    except requests.exceptions.RequestException as e:
        msg = f"Error connecting to LLM service: {e}"
    except ValueError:
        msg = "LLM service returned invalid JSON"

    # log the problem and fall back
    print("[LLM‑ERROR]", msg)
    return "Sorry, our AI service is temporarily unavailable. Please try again later."
