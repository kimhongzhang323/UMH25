import React, { useState, useEffect } from 'react';
import { FiSend, FiSettings, FiUser, FiMessageSquare, FiCheck, FiX } from 'react-icons/fi';

const CustomerServicePage = () => {
  // State for chat settings
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [aiResponseSpeed, setAiResponseSpeed] = useState('medium');
  const [aiTone, setAiTone] = useState('professional');

  // State for current chat
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  // Fake chat history data
  const [chats, setChats] = useState([
    {
      id: 1,
      customer: 'Ahmad bin Ali',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      lastMessage: 'My order was missing 2 items',
      status: 'pending',
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Hello, I just received my order #ORD-385 but it was missing 2 Zinger Burgers',
          time: '2025-04-10T14:30:00',
          read: true
        },
        {
          id: 2,
          sender: 'system',
          text: 'Thank you for reaching out. I apologize for the missing items in your order.',
          time: '2025-04-10T14:32:00',
          read: true,
          aiGenerated: autoReplyEnabled
        },
        {
          id: 3,
          sender: 'customer',
          text: 'This is very disappointing. I was hosting guests and had to make alternative arrangements',
          time: '2025-04-10T14:35:00',
          read: true
        }
      ]
    },
    {
      id: 2,
      customer: 'Siti Nurhaliza',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      lastMessage: 'How long does delivery take to Bangsar?',
      status: 'resolved',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'Hi, how long does delivery usually take to Bangsar area?',
          time: '2025-04-09T12:15:00',
          read: true
        },
        {
          id: 2,
          sender: 'system',
          text: 'Our standard delivery time to Bangsar is 30-45 minutes during regular hours.',
          time: '2025-04-09T12:16:00',
          read: true,
          aiGenerated: true
        },
        {
          id: 3,
          sender: 'customer',
          text: 'Thank you!',
          time: '2025-04-09T12:17:00',
          read: true
        }
      ]
    },
    {
      id: 3,
      customer: 'Rajesh Kumar',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      lastMessage: 'Is the Hot & Spicy Chicken very spicy?',
      status: 'pending',
      unread: true,
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'I want to try the Hot & Spicy Chicken but I have low spice tolerance. How spicy is it?',
          time: '2025-04-10T09:45:00',
          read: true
        }
      ]
    },
    {
      id: 4,
      customer: 'Jennifer Lim',
      avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      lastMessage: 'Can I get a refund for wrong order?',
      status: 'pending',
      unread: false,
      messages: [
        {
          id: 1,
          sender: 'customer',
          text: 'I received the wrong order today. Can I get a refund?',
          time: '2025-04-10T18:20:00',
          read: true
        },
        {
          id: 2,
          sender: 'merchant',
          text: 'We sincerely apologize for the mistake. Please provide your order number and we will process a refund immediately.',
          time: '2025-04-10T18:25:00',
          read: true,
          aiGenerated: false
        }
      ]
    }
  ]);

  // Set first chat as active by default
  useEffect(() => {
    if (chats.length > 0 && !activeChat) {
      setActiveChat(chats[0].id);
    }
  }, [chats, activeChat]);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !activeChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat) {
        const newMessage = {
          id: chat.messages.length + 1,
          sender: 'merchant',
          text: currentMessage,
          time: new Date().toISOString(),
          read: true,
          aiGenerated: false
        };

        return {
          ...chat,
          lastMessage: currentMessage,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    setChats(updatedChats);
    setCurrentMessage('');

    // Simulate AI auto-reply if enabled
    if (autoReplyEnabled) {
      simulateAIResponse(activeChat);
    }
  };

  // Simulate AI response
  const simulateAIResponse = (chatId) => {
    setIsTyping(true);

    // Determine response based on last customer message
    const chat = chats.find(c => c.id === chatId);
    const lastCustomerMessage = chat.messages.filter(m => m.sender === 'customer').pop();

    let responseText = '';

    if (lastCustomerMessage.text.toLowerCase().includes('missing') ||
      lastCustomerMessage.text.toLowerCase().includes('wrong')) {
      responseText = 'We sincerely apologize for the inconvenience. Please provide your order number and we will arrange for replacement items or a refund.';
    } else if (lastCustomerMessage.text.toLowerCase().includes('spicy')) {
      responseText = 'Our Hot & Spicy Chicken has a medium spice level. If you prefer milder options, we recommend our Original Recipe Chicken. Would you like suggestions for milder menu items?';
    } else if (lastCustomerMessage.text.toLowerCase().includes('delivery')) {
      responseText = 'Delivery times vary by location and traffic conditions. Our average delivery time is 30-45 minutes. You can track your order in real-time once placed.';
    } else {
      responseText = 'Thank you for your message. How may we assist you further with your KFC experience today?';
    }

    // Adjust tone based on setting
    if (aiTone === 'friendly') {
      responseText = `Hi there! ${responseText.toLowerCase()}`;
    } else if (aiTone === 'formal') {
      responseText = `Dear valued customer, ${responseText}`;
    }

    setTimeout(() => {
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          const newMessage = {
            id: chat.messages.length + 1,
            sender: 'system',
            text: responseText,
            time: new Date().toISOString(),
            read: false,
            aiGenerated: true
          };

          return {
            ...chat,
            lastMessage: responseText,
            messages: [...chat.messages, newMessage],
            unread: true
          };
        }
        return chat;
      });

      setChats(updatedChats);
      setIsTyping(false);
    }, aiResponseSpeed === 'fast' ? 1000 : aiResponseSpeed === 'medium' ? 2000 : 3000);
  };

  // Handle AI auto-reply toggle
  const handleToggleAutoReply = () => {
    setAutoReplyEnabled(!autoReplyEnabled);
  };

  // Mark chat as resolved
  const handleResolveChat = (chatId) => {
    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, status: 'resolved' };
      }
      return chat;
    });
    setChats(updatedChats);
  };

  // Get active chat data
  const getActiveChat = () => {
    return chats.find(chat => chat.id === activeChat);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Customer Messages</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {chats.filter(c => c.status === 'pending').length} pending conversations
            </span>
            <button
              onClick={() => handleToggleAutoReply()}
              className={`flex items-center text-sm px-3 py-1 rounded-full ${
autoReplyEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
}`}
            >
              AI Auto-Reply {autoReplyEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
activeChat === chat.id ? 'bg-blue-50' : ''
} ${chat.unread ? 'font-medium' : ''}`}
            >
              <div className="flex items-center">
                <img
                  src={chat.avatar}
                  alt={chat.customer}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm truncate">{chat.customer}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(chat.messages[chat.messages.length - 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  <div className="flex items-center mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
chat.status === 'resolved' ? 'bg-gray-300' : 'bg-green-500'
}`}></span>
                    <span className="text-xs text-gray-500">
                      {chat.status === 'resolved' ? 'Resolved' : 'Pending'}
                    </span>
                    {chat.unread && (
                      <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center">
                <img
                  src={getActiveChat().avatar}
                  alt={getActiveChat().customer}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium">{getActiveChat().customer}</h3>
                  <p className="text-sm text-gray-500">
                    {getActiveChat().status === 'resolved' ? (
                      <span className="text-green-600">Resolved</span>
                    ) : (
                        <span className="text-amber-600">Pending Response</span>
                      )}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleResolveChat(activeChat)}
                  className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
                >
                  <FiCheck className="mr-1" /> Mark Resolved
                </button>
                <button className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">
                  <FiSettings className="mr-1" /> Settings
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <div className="space-y-4">
                {getActiveChat().messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
message.sender === 'customer' ? 'justify-start' : 'justify-end'
}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
message.sender === 'customer'
? 'bg-white border border-gray-200'
: message.aiGenerated
? 'bg-purple-100 text-purple-900'
: 'bg-blue-100 text-blue-900'
}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.sender === 'customer'
                            ? getActiveChat().customer
                            : message.aiGenerated
                              ? 'KFC AI Assistant'
                              : 'You'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p>{message.text}</p>
                      {message.aiGenerated && (
                        <div className="mt-1 text-right">
                          <span className="text-xs text-purple-700">AI-generated</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
                      <div className="flex items-center">
                        <div className="typing-dots">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">AI Assistant is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FiSend />
                </button>
              </div>
              <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                <div>
                  {autoReplyEnabled ? (
                    <span className="text-purple-600 flex items-center">
                      <FiMessageSquare className="mr-1" /> AI Auto-Reply is active
                    </span>
                  ) : (
                      <span className="text-gray-500">Manual response mode</span>
                    )}
                </div>
                <button
                  onClick={() => {
                    // This would open a settings modal in a real implementation
                    alert('AI settings would open here');
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <FiSettings className="mr-1" /> Configure AI
                </button>
              </div>
            </div>
          </>
        ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FiMessageSquare className="mx-auto text-gray-300 text-5xl mb-4" />
                <h3 className="text-lg font-medium text-gray-700">No conversation selected</h3>
                <p className="text-gray-500 mt-1">Select a chat from the sidebar to view messages</p>
              </div>
            </div>
          )}
      </div>

      {/* AI Settings Panel (would be a modal in real implementation) */}
      <div className="w-80 border-l border-gray-200 bg-white p-4">
        <h3 className="font-medium text-lg mb-4">AI Assistant Settings</h3>

        <div className="space-y-6">
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Enable Auto-Reply</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={autoReplyEnabled}
                  onChange={handleToggleAutoReply}
                />
                <div className={`block w-14 h-8 rounded-full ${
autoReplyEnabled ? 'bg-purple-600' : 'bg-gray-300'
}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${
autoReplyEnabled ? 'transform translate-x-6' : ''
}`}></div>
              </div>
            </label>
            <p className="text-sm text-gray-500 mt-1">
              When enabled, the AI will automatically respond to customer messages
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Response Speed</label>
            <div className="flex space-x-2">
              {['fast', 'medium', 'slow'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAiResponseSpeed(speed)}
                  className={`px-3 py-1 rounded-full text-sm ${
aiResponseSpeed === speed
? 'bg-purple-100 text-purple-800'
: 'bg-gray-100 text-gray-800'
}`}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {aiResponseSpeed === 'fast'
                ? 'AI will respond immediately (may be less thoughtful)'
                : aiResponseSpeed === 'medium'
                  ? 'AI will take a moment to craft responses'
                  : 'AI will take longer for more detailed responses'}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Response Tone</label>
            <div className="flex space-x-2">
              {['professional', 'friendly', 'formal'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setAiTone(tone)}
                  className={`px-3 py-1 rounded-full text-sm ${
aiTone === tone
? 'bg-purple-100 text-purple-800'
: 'bg-gray-100 text-gray-800'
}`}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {aiTone === 'professional'
                ? 'Balanced, business-appropriate responses'
                : aiTone === 'friendly'
                  ? 'Casual, conversational tone'
                  : 'Very polite and structured responses'}
            </p>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Common Responses</label>
            <div className="space-y-2">
              {[
                'Apology for missing items',
                'Delivery time inquiry',
                'Menu recommendations',
                'Refund request'
              ].map((response) => (
                  <button
                    key={response}
                    className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm"
                  >
                    {response}
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
.typing-dots {
display: flex;
align-items: center;
height: 17px;
}
.typing-dots .dot {
width: 6px;
height: 6px;
margin: 0 2px;
background-color: #6b7280;
border-radius: 50%;
opacity: 0.4;
animation: typing-dots-animation 1.4s infinite ease-in-out;
}
.typing-dots .dot:nth-child(1) {
animation-delay: 0s;
}
.typing-dots .dot:nth-child(2) {
animation-delay: 0.2s;
}
.typing-dots .dot:nth-child(3) {
animation-delay: 0.4s;
}
@keyframes typing-dots-animation {
0%, 60%, 100% { opacity: 0.4; transform: translateY(0); }
30% { opacity: 1; transform: translateY(-3px); }
}
`}</style>
    </div>
  );
};

export default CustomerServicePage;
