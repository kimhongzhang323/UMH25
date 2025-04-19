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
        if chat_id in self.messages:
            self.messages[chat_id].append(message)

            # Update the chat preview with the latest message
            for chat in self.chats:
                if chat.id == chat_id:
                    chat.preview = message.text[:50] + ("..." if len(message.text) > 50 else "")
                    chat.timestamp = message.timestamp
                    break

    def get_all_messages(self, chat_id: str) -> List[Message]:
        return self.messages[chat_id]

    def get_all_chats(self) -> List[Chat]:
        return self.chats

    def add_new_chat(self, chat: Chat):
        self.chats.append(chat)
        self.messages[chat.id] = []
