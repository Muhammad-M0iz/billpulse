import boto3
from botocore.client import Config
from fastapi import UploadFile
from app.services.storage.base import AbstractStorageService


class S3StorageService(AbstractStorageService):
    def __init__(
        self,
        endpoint_url: str,
        public_endpoint_url: str,  # <-- Added public URL parameter
        access_key: str,
        secret_key: str,
        bucket_name: str,
        region_name: str = "us-east-1",
    ):
        self.bucket_name = bucket_name
        self.endpoint_url = endpoint_url
        self.public_endpoint_url = public_endpoint_url.rstrip("/")
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=endpoint_url,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            config=Config(signature_version="s3v4"),
            region_name=region_name,
        )

    async def upload(self, file: UploadFile, filename: str, content_type: str) -> str:
        content = await file.read()
        
        self.s3_client.put_object(
            Bucket=self.bucket_name,
            Key=filename,
            Body=content,
            ContentType=content_type,
        )
        await file.seek(0)
        
        return f"{self.public_endpoint_url}/{self.bucket_name}/{filename}"

    async def delete(self, url: str) -> bool:
        key = url.split("/")[-1]
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=key)
            return True
        except Exception:
            return False