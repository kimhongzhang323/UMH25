import React, { useState, useEffect, useCallback } from 'react';
import { FiSend, FiSettings, FiMessageSquare, FiCheck, FiLoader, FiAlertCircle } from 'react-icons/fi'; // Added FiLoader, FiAlertCircle

// Assuming mock data is in public/mockChats.json
const MOCK_CHATS_URL = 'http://127.0.0.1:8000/customer-service-chats';
const API_ENDPOINT = '/api/ai-auto-reply'; // Adjust if your backend runs elsewhere (e.g., http://localhost:3001/api/ai-auto-reply)

const CustomerServicePage = () => {
  // State for chat settings
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [aiResponseSpeed, setAiResponseSpeed] = useState('medium');
  const [aiTone, setAiTone] = useState('professional');

  // State for current chat
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSending, setIsSending] = useState(false); // For merchant message sending
  const [isAiTyping, setIsAiTyping] = useState({}); // Track AI typing per chat { chatId: boolean }

  // State for chat data
  const [chats, setChats] = useState([]);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // --- Data Fetching ---
  useEffect(() => {
    setIsLoadingChats(true);
    setFetchError(null);
    fetch(MOCK_CHATS_URL, {
      method: "GET"
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok (${response.status})`);
        }
        return response.json();
      })
      .then(data => {
        setChats(data || []); // Ensure data is an array
        if (data && data.length > 0) {
          setActiveChatId(data[0].id); // Select first chat by default
          // Optionally mark as read here if needed
        }
        setIsLoadingChats(false);
      })
      .catch(error => {
        setFetchError(error.message || "Failed to load chat data.");
        setIsLoadingChats(false);
      });
  }, []); // Empty dependency array means run once on mount

  // --- Memoized Getter for Active Chat Data ---
  const getActiveChat = useCallback(() => {
    return chats.find(chat => chat.id === activeChatId);
  }, [chats, activeChatId]);

  const triggerAIResponse = useCallback(async (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    // Only trigger if auto-reply is ON for THIS chat/globally (adjust logic if needed)
    if (!chat || !autoReplyEnabled) return;

    const lastCustomerMessage = chat.messages?.filter(m => m.sender === 'customer').pop();
    // Avoid triggering if the last message wasn't from the customer OR if AI is already typing
    if (!lastCustomerMessage || isAiTyping[chatId]) return;

    setIsAiTyping(prev => ({ ...prev, [chatId]: true })); // Show AI typing for this chat

    const payload = {
      chatId: chatId,
      latestCustomerMessage: lastCustomerMessage.text,
      messageHistory: chat.messages.slice(-5),
      settings: { tone: aiTone, speed: aiResponseSpeed }
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error! status: ${response.status}`);
      }
      const result = await response.json();

      setChats(prevChats => prevChats.map(c => {
        if (c.id === result.chatId && result.aiResponse) {
          const newAiMessage = {
            id: c.messages.length + 1 + Math.random(), // Simple unique ID
            sender: result.aiResponse.sender || 'system',
            text: result.aiResponse.text,
            time: result.aiResponse.time || new Date().toISOString(),
            read: c.id === activeChatId, // Mark read only if currently active
            aiGenerated: true
          };
          return {
            ...c,
            messages: [...c.messages, newAiMessage],
            lastMessage: newAiMessage.text, // Update preview
            unread: c.id !== activeChatId // Mark unread only if not active
          };
        }
        return c;
      }));
    } catch (error) {
      console.error("Error triggering AI response:", error);
      // Optional: Show an error indicator in the chat UI
    } finally {
      setIsAiTyping(prev => ({ ...prev, [chatId]: false })); // Hide AI typing
    }
  }, [chats, autoReplyEnabled, aiTone, aiResponseSpeed, isAiTyping, activeChatId]); // Dependencies

  //  Original was simulateAIResponse
  // const simulateAIResponse = (chatId) => {
  //   setIsTyping(true);

  //   // Determine response based on last customer message
  //   const chat = chats.find(c => c.id === chatId);
  //   const lastCustomerMessage = chat.messages.filter(m => m.sender === 'customer').pop();

  //   let responseText = '';

  //   if (lastCustomerMessage.text.toLowerCase().includes('missing') ||
  //       lastCustomerMessage.text.toLowerCase().includes('wrong')) {
  //     responseText = 'We sincerely apologize for the inconvenience. Please provide your order number and we will arrange for replacement items or a refund.';
  //   } else if (lastCustomerMessage.text.toLowerCase().includes('spicy')) {
  //     responseText = 'Our Hot & Spicy Chicken has a medium spice level. If you prefer milder options, we recommend our Original Recipe Chicken. Would you like suggestions for milder menu items?';
  //   } else if (lastCustomerMessage.text.toLowerCase().includes('delivery')) {
  //     responseText = 'Delivery times vary by location and traffic conditions. Our average delivery time is 30-45 minutes. You can track your order in real-time once placed.';
  //   } else {
  //     responseText = 'Thank you for your message. How may we assist you further with your KFC experience today?';
  //   }

  //   // Adjust tone based on setting
  //   if (aiTone === 'friendly') {
  //     responseText = `Hi there! ${responseText.toLowerCase()}`;
  //   } else if (aiTone === 'formal') {
  //     responseText = `Dear valued customer, ${responseText}`;
  //   }

  //   setTimeout(() => {
  //     const updatedChats = chats.map(chat => {
  //       if (chat.id === chatId) {
  //         const newMessage = {
  //           id: chat.messages.length + 1,
  //           sender: 'system',
  //           text: responseText,
  //           time: new Date().toISOString(),
  //           read: false,
  //           aiGenerated: true
  //         };

  //         return {
  //           ...chat,
  //           lastMessage: responseText,
  //           messages: [...chat.messages, newMessage],
  //           unread: true
  //         };
  //       }
  //       return chat;
  //     });

  //     setChats(updatedChats);
  //     setIsTyping(false);
  //   }, aiResponseSpeed === 'fast' ? 1000 : aiResponseSpeed === 'medium' ? 2000 : 3000);
  // };
  // --- AI Response Trigger ---


  // --- Handle Sending Merchant Message ---
  const handleSendMessage = () => {
    if (!currentMessage.trim() || !activeChatId || isSending) return;

    setIsSending(true); // Disable button while sending

    const newMerchantMessage = {
      id: getActiveChat().messages.length + 1 + Math.random(), // Simple unique ID
      sender: 'merchant', // Or get actual merchant user ID/name
      text: currentMessage,
      time: new Date().toISOString(),
      read: true,
      aiGenerated: false
    };

    // Optimistically update UI first
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMerchantMessage],
          lastMessage: newMerchantMessage.text // Update preview
        };
      }
      return chat;
    });
    setChats(updatedChats);
    const messageToSend = currentMessage; // Store message before clearing
    setCurrentMessage(''); // Clear input immediately

    // Simulate sending to backend (replace with actual API call if needed)
    new Promise(resolve => setTimeout(resolve, 300)) // Fake network delay
      .then(() => {
        console.log("Merchant message 'sent':", messageToSend);
        // If successful, potentially trigger AI response now based on the flow
        if (autoReplyEnabled) {
          // Decide if AI should reply AFTER merchant sends
          // For now, let's assume AI replies to CUSTOMER messages,
          // so we don't call triggerAIResponse here.
          // If AI should suggest based on merchant text, call it here.
          // triggerAIResponse(activeChatId);
        }
      })
      .catch(err => {
        console.error("Failed to send message", err);
        // Revert optimistic update or show error
      })
      .finally(() => {
        setIsSending(false); // Re-enable button
      });
  };

  // --- Other Handlers ---
  const handleToggleAutoReply = () => setAutoReplyEnabled(!autoReplyEnabled);

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
    // Mark chat as read when selected
    setChats(prevChats => prevChats.map(c =>
      c.id === chatId ? { ...c, unread: false } : c
    ));
    // If auto-reply is on, check if AI needs to respond to the last customer message
    const selectedChat = chats.find(c => c.id === chatId);
    if (selectedChat && autoReplyEnabled && selectedChat.messages?.length > 0) {
      const lastMessage = selectedChat.messages[selectedChat.messages.length - 1];
      if (lastMessage.sender === 'customer' && !lastMessage.read) { // Example condition
        // triggerAIResponse(chatId); // Decide if AI should reply on select
      }
    }
  };

  const handleResolveChat = (chatId) => {
    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, status: 'resolved' };
      }
      return chat;
    }));
    // Optionally close chat or move to resolved list
  };


  // --- JSX Rendering ---
  if (isLoadingChats) {
    return <div className="flex justify-center items-center h-screen"><FiLoader className="animate-spin text-xl mr-2" />Loading chats...</div>;
  }

  if (fetchError) {
    return <div className="flex justify-center items-center h-screen text-red-500"><FiAlertCircle className="text-xl mr-2" />Error: {fetchError}</div>;
  }

  const currentActiveChat = getActiveChat(); // Get current chat data

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Customer Messages</h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {chats.filter(c => c.status === 'pending').length} pending
            </span>
            <button
              onClick={handleToggleAutoReply}
              className={`flex items-center text-sm px-3 py-1 rounded-full ${autoReplyEnabled ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                }`}
            >
              <FiMessageSquare className="mr-1" /> AI Reply {autoReplyEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-grow"> {/* Use flex-grow here */}
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${activeChatId === chat.id ? 'bg-blue-50' : ''
                } ${chat.unread ? 'font-semibold' : ''}`} // Use font-semibold for unread
            >
              <div className="flex items-center">
                <img src={chat.avatar} alt={chat.customer} className="w-10 h-10 rounded-full mr-3" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm truncate font-medium">{chat.customer}</h3>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {chat.messages?.length > 0 ? new Date(chat.messages[chat.messages.length - 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  <div className="flex items-center mt-1 justify-between">
                    <div className="flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${chat.status === 'resolved' ? 'bg-gray-400' : 'bg-green-500'
                        }`}></span>
                      <span className="text-xs text-gray-500 capitalize">{chat.status}</span>
                    </div>
                    {chat.unread && (
                      <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {currentActiveChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <img src={currentActiveChat.avatar} alt={currentActiveChat.customer} className="w-10 h-10 rounded-full mr-3" />
                <div>
                  <h3 className="font-medium">{currentActiveChat.customer}</h3>
                  <p className={`text-sm ${currentActiveChat.status === 'resolved' ? 'text-gray-500' : 'text-green-600'}`}>
                    {currentActiveChat.status === 'resolved' ? 'Resolved' : 'Pending'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {currentActiveChat.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolveChat(activeChatId)}
                    className="flex items-center text-sm bg-gray-100 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium"
                  >
                    <FiCheck className="mr-1" /> Mark Resolved
                  </button>
                )}
                <button onClick={() => alert('Settings Modal Placeholder')} className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg">
                  <FiSettings className="mr-1" /> Settings
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ scrollBehavior: 'smooth' }}> {/* Add smooth scroll */}
              <div className="space-y-4">
                {currentActiveChat.messages?.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-lg px-4 py-2 rounded-xl shadow-sm ${ // Adjusted max-width & rounded
                        message.sender === 'customer'
                          ? 'bg-white border border-gray-200 text-gray-800' // Customer bubble style
                          : message.aiGenerated
                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white' // AI bubble style
                            : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' // Merchant bubble style
                        }`}
                    >
                      {/* Optional: Show sender name only if needed (e.g., group chat) */}
                      {/* <span className="text-xs font-medium block mb-1"> ... sender name ...</span> */}
                      <p className="text-sm">{message.text}</p> {/* Adjusted text size */}
                      <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/20"> {/* Added subtle border */}
                        <span className={`text-xs opacity-80 ${message.sender === 'customer' ? 'text-gray-500' : 'text-white/80'}`}>
                          {new Date(message.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        {message.aiGenerated && (
                          <span className="text-xs opacity-80 text-purple-200 ml-2">AI</span> // Simpler AI indicator
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {isAiTyping[activeChatId] && ( // Check typing for the *active* chat
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm">
                      <div className="flex items-center">
                        <div className="typing-dots">
                          <div className="dot !bg-white/60"></div>
                          <div className="dot !bg-white/60"></div>
                          <div className="dot !bg-white/60"></div>
                        </div>
                        {/* <span className="ml-2 text-xs opacity-80">AI is typing...</span> */}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


            {/* Message Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white shadow-inner">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-gray-800"
                  disabled={isSending} // Disable input while sending
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !currentMessage.trim()} // Disable if sending or empty
                  className={`bg-blue-600 text-white p-2 rounded-lg m-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isSending ? <FiLoader className="animate-spin" /> : <FiSend />}
                </button>
              </div>
              {/* Optional: Display AI status below input */}
              <div className="mt-2 text-xs text-gray-500">
                {autoReplyEnabled ? 'AI Auto-Reply: ON' : 'AI Auto-Reply: OFF'} | Tone: {aiTone}
              </div>
            </div>
          </>
        ) : (
          // No Chat Selected View
          <div className="flex-1 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <FiMessageSquare className="mx-auto text-5xl mb-4" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="mt-1">Choose a chat from the sidebar to start messaging.</p>
            </div>
          </div>
        )}
      </div>

      {/* AI Settings Panel (Keep as placeholder or implement as modal) */}
      <div className="w-80 border-l border-gray-200 bg-white p-4 hidden xl:block"> {/* Hide on smaller screens */}
        <h3 className="font-medium text-lg mb-4">AI Assistant Settings</h3>
        {/* ... Settings content (toggle, speed, tone, common responses) ... */}
        {/* Make "Common Responses" buttons insert text into currentMessage state */}
      </div>

      {/* Style tag for typing animation */}
      <style jsx>{`
            .typing-dots { display: flex; align-items: center; height: 17px; }
            .typing-dots .dot { width: 6px; height: 6px; margin: 0 2px; background-color: #6b7280; border-radius: 50%; opacity: 0.4; animation: typing-dots-animation 1.4s infinite ease-in-out; }
            .typing-dots .dot:nth-child(1) { animation-delay: 0s; }
            .typing-dots .dot:nth-child(2) { animation-delay: 0.2s; }
            .typing-dots .dot:nth-child(3) { animation-delay: 0.4s; }
            @keyframes typing-dots-animation {
            0%, 60%, 100% { opacity: 0.4; transform: translateY(0); }
            30% { opacity: 1; transform: translateY(-3px); }
            }
        `}</style>
    </div>
  );
};

export default CustomerServicePage;