from abc import ABC, abstractmethod

from fastapi import UploadFile


class StorageBase(ABC):
    @abstractmethod
    async def save_upload(self, upload: UploadFile, key_prefix: str) -> tuple[str, str]:
        """Returns (storage_key, public_url)."""
