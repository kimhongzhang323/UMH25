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
        if chat_id not in self.chats:
            # Or raise HTTPException(status_code=404, detail=f"Chat with ID {chat_id} not found")
            print(f"Error: Chat ID {chat_id} not found. Cannot add message.")
            # Handle appropriately - maybe create the chat implicitly if desired?
            # For now, just print error and return if chat doesn't exist
            # raise ValueError(f"Chat with ID {chat_id} not found.") # Alternative: raise error
            return

        # Ensure the message list exists for the chat_id
        if chat_id not in self.messages:
            self.messages[chat_id] = []

        self.messages[chat_id].append(message)
        print(f"Added message {message.id} to chat {chat_id}") # Debug print

    def get_all_messages(self, chat_id: str) -> List[Message]:
        return self.messages[chat_id]

    def get_all_chats(self) -> List[Chat]:
        return self.chats

    def add_new_chat(self, chat: Chat):
        self.chats.append(chat)
        self.messages[chat.id] = []
