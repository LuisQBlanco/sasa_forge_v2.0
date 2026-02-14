import time
from collections import defaultdict

from fastapi import HTTPException, Request


_BUCKETS: dict[str, list[float]] = defaultdict(list)


def limiter(prefix: str, limit: int, window_seconds: int):
    async def _dep(request: Request):
        key = f"{prefix}:{request.client.host if request.client else 'unknown'}"
        now = time.time()
        events = [t for t in _BUCKETS[key] if now - t < window_seconds]
        if len(events) >= limit:
            raise HTTPException(status_code=429, detail="Rate limit exceeded")
        events.append(now)
        _BUCKETS[key] = events

    return _dep
