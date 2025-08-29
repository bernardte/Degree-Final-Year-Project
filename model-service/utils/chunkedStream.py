async def chunkedStream(text: str, chunk_size: int = 20):
    """
    将文本切分成小片段，用于流式发送。
    每片长度为 chunk_size，最后一片 is_final=True。
    """
    total_len = len(text)
    start = 0
    while start < total_len:
        end = min(start + chunk_size, total_len)
        chunk = text[start:end]
        is_final = end == total_len
        yield chunk, is_final
        start = end