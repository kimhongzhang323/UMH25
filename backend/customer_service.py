from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/customer-service")

@router.get("/chats")
async def get_chats():
    chats = [
  {
    "id": 1,
    "customer": "Ahmad bin Ali",
    "avatar": "https://randomuser.me/api/portraits/men/1.jpg",
    "lastMessage": "My order was missing 2 items",
    "status": "pending",
    "unread": True,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Hello, I just received my order #ORD-385 but it was missing 2 Har Gow",
        "time": "2025-04-10T14:30:00",
        "read": False
      }
    ]
  },
  {
    "id": 2,
    "customer": "Siti Nurhaliza",
    "avatar": "https://randomuser.me/api/portraits/women/2.jpg",
    "lastMessage": "How long does delivery take to Bangsar?",
    "status": "resolved",
    "unread": False,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Hi, how long does delivery usually take to Bangsar area?",
        "time": "2025-04-09T12:15:00",
        "read": True
      },
    ]
  },
  {
    "id": 3,
    "customer": "Rajesh Kumar",
    "avatar": "https://randomuser.me/api/portraits/men/3.jpg",
    "lastMessage": "Is the Hot & Spicy Chicken very spicy?",
    "status": "pending",
    "unread": True,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "I want to try the Hot & Spicy Chicken but I have low spice tolerance. How spicy is it?",
        "time": "2025-04-10T09:45:00",
        "read": True
      }
    ]
  },
  {
    "id": 4,
    "customer": "Jennifer Lim",
    "avatar": "https://randomuser.me/api/portraits/women/4.jpg",
    "lastMessage": "Can I get a refund for the wrong order?",
    "status": "pending",
    "unread": False,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Can I get a refund for the wrong order?",
        "time": "2025-04-09T12:15:00",
        "read": True
      }
    ]
  },
  {
    "id": 5,
    "customer": "Li Jun",
    "avatar": "https://randomuser.me/api/portraits/women/7.jpg",
    "lastMessage": "My order was missing 2 items",
    "status": "pending",
    "unread": True,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Hello, I just received my order #ORD-385 but it was missing 2 Zinger Burgers",
        "time": "2025-04-10T14:30:00",
        "read": True
      },
      {
        "id": 2,
        "sender": "system",
        "text": "Thank you for reaching out. I apologize for the missing items in your order.",
        "time": "2025-04-10T14:32:00",
        "read": True,
        "aiGenerated": "autoReplyEnabled"
      },
      {
        "id": 3,
        "sender": "customer",
        "text": "This is very disappointing. I was hosting guests and had to make alternative arrangements",
        "time": "2025-04-10T14:35:00",
        "read": True
      }
    ]
  },
  {
    "id": 6,
    "customer": "Lee Wei",
    "avatar": "https://randomuser.me/api/portraits/men/6.jpg",
    "lastMessage": "My order was missing 2 items",
    "status": "pending",
    "unread": True,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Hello, I just received my order #ORD-385 but it was missing 2 Zinger Burgers",
        "time": "2025-04-10T14:30:00",
        "read": True
      },
      {
        "id": 2,
        "sender": "system",
        "text": "Thank you for reaching out. I apologize for the missing items in your order.",
        "time": "2025-04-10T14:32:00",
        "read": True,
        "aiGenerated": "autoReplyEnabled"
      },
      {
        "id": 3,
        "sender": "customer",
        "text": "This is very disappointing. I was hosting guests and had to make alternative arrangements",
        "time": "2025-04-10T14:35:00",
        "read": True
      }
    ]
  },
  {
    "id": 7,
    "customer": "Suresh",
    "avatar": "https://randomuser.me/api/portraits/men/8.jpg",
    "lastMessage": "My order was missing 2 items",
    "status": "pending",
    "unread": True,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Hello, I just received my order #ORD-385 but it was missing 2 Zinger Burgers",
        "time": "2025-04-10T14:30:00",
        "read": True
      },
      {
        "id": 2,
        "sender": "system",
        "text": "Thank you for reaching out. I apologize for the missing items in your order.",
        "time": "2025-04-10T14:32:00",
        "read": True,
        "aiGenerated": "autoReplyEnabled"
      },
      {
        "id": 3,
        "sender": "customer",
        "text": "This is very disappointing. I was hosting guests and had to make alternative arrangements",
        "time": "2025-04-10T14:35:00",
        "read": True
      }
    ]
  },
  {
    "id": 8,
    "customer": "Ah Kau",
    "avatar": "https://randomuser.me/api/portraits/men/9.jpg",
    "lastMessage": "My order was missing 2 items",
    "status": "pending",
    "unread": True,
    "messages": [
      {
        "id": 1,
        "sender": "customer",
        "text": "Hello, I just received my order #ORD-385 but it was missing 2 Zinger Burgers",
        "time": "2025-04-10T14:30:00",
        "read": True
      },
      {
        "id": 2,
        "sender": "system",
        "text": "Thank you for reaching out. I apologize for the missing items in your order.",
        "time": "2025-04-10T14:32:00",
        "read": True,
        "aiGenerated": "autoReplyEnabled"
      },
      {
        "id": 3,
        "sender": "customer",
        "text": "This is very disappointing. I was hosting guests and had to make alternative arrangements",
        "time": "2025-04-10T14:35:00",
        "read": True
      }
    ]
  },
]
    return chats

# Endpoint to send payload from the frontend
@router.post("/send-payload")
async def send_payload(payload: dict):
    print("Payload received")
    chat_id = payload.get("chatId")
    latest_customer_message = payload.get("latestCustomerMessage")
    message_history = payload.get("messageHistory")
    response_speed = payload["settings"]["speed"]
    ai_tone = payload["settings"]["tone"]

    now_utc = datetime.utcnow().isoformat() + "Z"  # Get current UTC time in ISO 8601 format

    return {"status": "success",
            "message": "Payload received successfully",
            "time": now_utc,
            "chatId": payload["chatId"]
            }