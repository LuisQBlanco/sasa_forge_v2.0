from fastapi import UploadFile

from api.storage.base import StorageBase


class S3Storage(StorageBase):
    def __init__(self, *args, **kwargs):
        raise NotImplementedError("S3Storage stub ready. Configure boto3 client and bucket env vars.")

    async def save_upload(self, upload: UploadFile, key_prefix: str) -> tuple[str, str]:
        raise NotImplementedError
