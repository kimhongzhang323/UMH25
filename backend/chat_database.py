from pydantic import BaseModel
from typing import List
from uuid import uuid4


# ID should be UUID v4
# timestamps are Unix timestamp
class Chat(BaseModel):
    id: str
    title: str
    preview: str
    timestamp: int


# id and chat_id should be UUID v4
# sender is either 'user' or 'bot'
# timestamps are Unix timestamp
class Message(BaseModel):
    id: str
    text: str
    sender: str
    timestamp: int
    image_url: str = None


class ChatDatabase(BaseModel):
    messages: dict[str, List[Message]]
    chats: List[Chat]

    def add_message(self, message: Message, chat_id: str):
        pass

    def get_all_messages(self, chat_id: str) -> List[Message]:
        return self.messages[chat_id]

    def get_all_chats(self) -> List[Chat]:
        return self.chats

    def add_new_chat(self, title: str, preview: str, timestamp: int):
        chat_id = uuid4()
        self.chats.append(
            Chat(
                id=chat_id,
                title=title,
                preview=preview,
                timestamp=timestamp
            )
        )

        self.messages[chat_id] = []
