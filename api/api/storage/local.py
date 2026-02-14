import os
import secrets

from fastapi import UploadFile

from api.storage.base import StorageBase


class LocalStorage(StorageBase):
    def __init__(self, root: str = "uploads") -> None:
        self.root = root
        os.makedirs(self.root, exist_ok=True)

    async def save_upload(self, upload: UploadFile, key_prefix: str) -> tuple[str, str]:
        ext = os.path.splitext(upload.filename or "")[1]
        key = f"{key_prefix}/{secrets.token_hex(12)}{ext}"
        path = os.path.join(self.root, key)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(await upload.read())
        return key, f"/uploads/{key}"
