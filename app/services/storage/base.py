from abc import ABC, abstractmethod

from fastapi import UploadFile


class AbstractStorageService(ABC):
    @abstractmethod
    async def upload(self, file: UploadFile, filename: str, content_type: str) -> str:
        """
        Uploads a file to the storage service.
        :param file: The file to upload.
        :param filename: The name of the file.
        :param content_type: The content type of the file.
        :return: The URL of the uploaded file.
        """

    @abstractmethod
    async def delete(self, url: str) -> bool:
        """
        Deletes a file from the storage service.
        :param url: The URL of the file to delete.
        :return: True if the file was deleted, False otherwise.
        """
