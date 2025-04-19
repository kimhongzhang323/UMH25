import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FiSend, FiSettings, FiMessageSquare, FiCheck, FiLoader, FiAlertCircle, FiX, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';

// --- Configuration ---
const API_BASE_URL = "http://127.0.0.1:8000/customer-service"; // Replace with your actual API base URL
const CHATS_API_URL = `${API_BASE_URL}/chats`;
const SEND_PAYLOAD_URL = `${API_BASE_URL}/send-payload`; // Replace with your actual AI endpoint

// --- Mock Data (Replace with API data or remove if fetching all data) ---
const commonResponseTemplates = {
  'Apology for missing items': 'We sincerely apologize for the missing items in your order. Could you please provide your order number so we can investigate and arrange a solution?',
  'Delivery time inquiry': 'Our standard delivery times are typically 30-45 minutes, but this can vary based on location, order volume, and traffic conditions. You can track your order in the Grab app for real-time updates.',
  'Menu recommendations': 'We have many popular items! Could you tell me what kind of cuisine or flavors you usually enjoy?',
  'Refund request': 'We understand you\'d like to request a refund. Please provide your order number and the reason for the request, and we will review it promptly.'
};

// Helper for unique IDs (Replace with a more robust method like UUID in production)
let messageIdCounter = Date.now();

const CustomerServicePage = () => {
  // --- State ---
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);
  const [aiResponseSpeed, setAiResponseSpeed] = useState('medium');
  const [aiTone, setAiTone] = useState('professional');
  const [currentMessage, setCurrentMessage] = useState('');
  const [activeChatId, setActiveChatId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState({}); // Track typing state per chat ID
  const [chats, setChats] = useState([]); // Holds all chat data
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [isMobileSettingsOpen, setIsMobileSettingsOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Start expanded

  // --- Refs ---
  const messagesEndRef = useRef(null); // Ref for the marker div at the end of messages (optional usage)
  const chatContainerRef = useRef(null); // Ref for the scrollable messages container

  // --- Effects ---

  // Fetch initial chats on component mount
  useEffect(() => {
    setIsLoadingChats(true);
    setFetchError(null);
    fetch(CHATS_API_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response error (${response.status}) fetching chats.`);
        }
        return response.json();
      })
      .then(data => {
        // Ensure data is an array, add basic IDs if missing from backend
        const processedData = (data || []).map((chat, index) => ({
          ...chat,
          id: chat.id || `chat-${index}-${Date.now()}`, // Basic fallback ID
          messages: (chat.messages || []).map((msg, msgIndex) => ({
            ...msg,
            id: msg.id || `msg-${chat.id || index}-${msgIndex}-${Date.now()}` // Basic fallback ID
          }))
        }));
        setChats(processedData);
        // Automatically select the first chat if available
        if (processedData.length > 0) {
          setActiveChatId(processedData[0].id);
        }
        setIsLoadingChats(false);
      })
      .catch(error => {
        console.error("Error fetching chat data:", error);
        setFetchError(error.message || "Failed to load chat data. Please check the API connection.");
        setIsLoadingChats(false);
      });
  }, []); // Empty dependency array ensures this runs only once on mount

  // Scroll to bottom when messages change for the active chat
  useEffect(() => {
    if (chatContainerRef.current) {
      // Use setTimeout to ensure DOM has updated before scrolling
      const timerId = setTimeout(() => {
        if (chatContainerRef.current) {
          // Scroll the container to its full height
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
          // Alternative using messagesEndRef:
          // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
      return () => clearTimeout(timerId); // Cleanup timeout on unmount or dependency change
    }
  }, [chats, activeChatId]); // Re-run when chats array or activeChatId changes

  // --- Callbacks & Functions ---

  // Get the data for the currently active chat
  const getActiveChat = useCallback(() => {
    return chats.find(chat => chat.id === activeChatId);
  }, [chats, activeChatId]);

  // Add a new message to the local state for a specific chat
  const addMessageToChat = useCallback((chatId, message) => {
    setChats(prevChats => prevChats.map(c => {
      if (c.id === chatId) {
        const newMessageWithId = {
          ...message,
          // Ensure message has a unique ID (use backend ID if possible, otherwise generate)
          id: message.id || `msg-${chatId}-${messageIdCounter++}`
        };
        return {
          ...c,
          messages: [...(c.messages || []), newMessageWithId],
          // Update last message preview safely
          lastMessage: newMessageWithId.text.substring(0, 50) + (newMessageWithId.text.length > 50 ? '...' : ''),
          // Mark unread only if the update is for a non-active chat
          unread: c.id !== activeChatId ? true : c.unread // Keep existing unread if active
        };
      }
      return c;
    }));
  }, [activeChatId]); // Dependency: activeChatId needed for unread logic

  // Trigger AI response for a given chat
  const triggerAIResponse = useCallback(async (chatId) => {
    const chat = chats.find(c => c.id === chatId);
    // Don't trigger if chat not found, AI disabled, or AI already typing for this chat
    if (!chat || !autoReplyEnabled || isAiTyping[chatId]) return;

    // Find the last message sent by the customer
    const lastCustomerMessage = chat.messages?.filter(m => m.sender === 'customer').pop();
    if (!lastCustomerMessage) return; // No customer message to respond to

    setIsAiTyping(prev => ({ ...prev, [chatId]: true }));

    const payload = {
      chatId: chatId,
      latestCustomerMessage: lastCustomerMessage.text,
      messageHistory: chat.messages?.slice(-10) || [], // Send recent history
      settings: { tone: aiTone, speed: aiResponseSpeed } // Include settings
    };

    try {
      const response = await fetch(SEND_PAYLOAD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.text(); // Try to get error details
        throw new Error(`AI API error! status: ${response.status}, ${errorData}`);
      }

      const result = await response.json();

      if (result.status == "success" && result.message) { // Ensure message exists
        addMessageToChat(result.chatId, {
          sender: 'system', // Or 'ai' or 'merchant-ai'
          text: result.message,
          aiGenerated: true,
          time: new Date().toISOString() // Use current time if backend doesn't provide
        });
      } else {
        console.warn("AI response received but no text content found or status not success:", result);
        // Optionally add a system message indicating no AI response
        // addMessageToChat(chatId, {
        //   sender: 'system',
        //   text: 'AI did not generate a response.',
        //   time: new Date().toISOString(),
        //   isInfo: true // Custom flag
        // });
      }
    } catch (error) {
      console.error("Error triggering AI response:", error);
      // Show error in UI
      addMessageToChat(chatId, {
        sender: 'system',
        text: `⚠️ AI Error: ${error.message}`,
        aiGenerated: false, // Mark as system error, not AI response
        time: new Date().toISOString(),
        isError: true // Custom flag for styling?
      });
    } finally {
      // Ensure typing indicator is turned off for this chat
      setIsAiTyping(prev => ({ ...prev, [chatId]: false }));
    }
  }, [chats, autoReplyEnabled, aiTone, aiResponseSpeed, isAiTyping, addMessageToChat]); // Dependencies

  // Send a message from the merchant
  const handleSendMessage = () => {
    const activeChat = getActiveChat();
    if (!currentMessage.trim() || !activeChatId || !activeChat || isSending) return;

    setIsSending(true);

    const newMerchantMessage = {
      // ID will be added by addMessageToChat
      sender: 'merchant',
      text: currentMessage,
      time: new Date().toISOString(), // Use current time for sent message
      read: true, // Merchant messages are instantly "read" by them
      aiGenerated: false
    };

    const messageTextToSend = currentMessage; // Store before clearing
    setCurrentMessage(''); // Clear input immediately

    // Optimistically update UI
    addMessageToChat(activeChatId, newMerchantMessage);


    // --- Simulate/Actual Backend Send ---
    // Replace this promise with your actual API call to send the merchant's message
    new Promise((resolve) => {
      // --- Actual Backend Call (Example Structure) ---
      /*
      fetch(`${API_BASE_URL}/customer-service/chats/${activeChatId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', // Add Auth headers if needed },
          body: JSON.stringify({ text: messageTextToSend, sender: 'merchant' })
      })
      .then(response => {
          if (!response.ok) throw new Error(`Failed to send message: ${response.statusText}`);
          return response.json(); // Assuming backend returns confirmation or the saved message
      })
      .then(resolve) // Resolve on success
      .catch(reject); // Reject on failure
      */

      // --- Simulation ---
      console.log("Simulating sending merchant message to backend:", messageTextToSend);
      setTimeout(() => {
        console.log("Merchant message 'sent' successfully (simulated).");
        resolve(); // Simulate success
        // You might receive the saved message with a backend ID here
        // resolve({ id: 'backend-generated-id', ...newMerchantMessage });
      }, 300); // Simulate network delay
      // --- End Simulation ---
    })
      .then(() => {
        // After successfully sending the merchant message (or simulating it)
        // Decide *when* to trigger AI after a merchant message.
        // Option A: Trigger AI to *potentially* suggest a follow-up based on merchant's message
        // if (autoReplyEnabled) { triggerAIResponse(activeChatId); }

        // Option B (More common): AI only responds to customer messages.
        // No AI trigger needed here. The triggerAIResponse is mainly called
        // when a new customer message arrives (simulated or from websocket/polling).
        // In this app, it's triggered when selecting a potentially unread chat.

      })
      .catch(err => {
        console.error("Failed to send merchant message:", err);
        // TODO: Handle failure. Could revert the optimistic update,
        // show an error indicator on the message, or put text back in input.
        // Example: Put message back in input on failure (simple)
        // setCurrentMessage(messageTextToSend);
        // Example: Find the message and mark it as failed (more complex)
        // find and update message in chats state
      })
      .finally(() => {
        setIsSending(false); // Re-enable input field
      });
  };

  // Toggle AI auto-reply setting
  const handleToggleAutoReply = () => setAutoReplyEnabled(!autoReplyEnabled);

  // Handle selecting a chat from the sidebar
  const handleSelectChat = (chatId) => {
    // 1. Only proceed if selecting a DIFFERENT chat
    if (chatId === activeChatId) {
      setChats(prevChats =>
        prevChats.map(chat =>
          (chat.id === chatId && chat.unread) ? { ...chat, unread: false } : chat
        )
      );
      return;
    }

    // 2. Update the active chat ID state
    setActiveChatId(chatId);

    // 3. Update the chats state to mark the selected chat as read
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === chatId ? { ...chat, unread: false } : chat
      )
    );
    // Mark the newly selected chat as read
    setChats(prevChats => prevChats.map(c =>
      c.id === chatId ? { ...c, unread: false } : c
    ));

    // TODO: When to trigger AI?

    // Check if AI should respond to the *last customer message* in the *newly selected* chat
    // This might be useful if auto-reply was off or failed previously.
    // More typically, AI responses happen when a *new* customer message arrives.
    // The current implementation in useEffect already triggers AI for the first chat if applicable.
    // This click handler could also trigger it if needed, but let's rely on the effect for now
    // or integrate a websocket/polling mechanism to detect new customer messages.

    // Minimal logic here: if selecting a chat with a customer message and auto-reply is on,
    // and AI isn't already typing for *this* chat, consider triggering.
    // The useEffect (scroll) might already handle this if selecting makes new content appear,
    // but if the chat was just waiting for a response, this might be a place to trigger.
  };

  // Mark a chat as resolved (Placeholder - Needs backend integration)
  const handleResolveChat = (chatId) => {
    console.log(`Attempting to resolve chat ${chatId} (UI only)`);
    setChats(prevChats => prevChats.map(chat =>
      chat.id === chatId ? { ...chat, status: 'resolved' } : chat // Corrected: use 'chat' not 'c'
    ));
    // TODO: Add API call here to update chat status on the backend
  };

  // Use a common response template
  const handleCommonResponseClick = (text) => {
    setCurrentMessage(text); // Set, don't append for common responses
    setIsMobileSettingsOpen(false); // Close settings panel on mobile after selection
    // Need to ensure the input is focused after setting the value
    // Using setTimeout to allow state update to potentially re-render input
    setTimeout(() => {
      document.querySelector('input[type="text"]')?.focus();
    }, 0);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded)
  }

  // --- JSX Rendering ---

  // Loading State
  if (isLoadingChats) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-700">
        <FiLoader className="animate-spin text-2xl mr-3" /> Loading chats...
      </div>
    );
  }

  // Error State
  if (fetchError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-red-50 text-red-700 p-4">
        <FiAlertCircle className="text-4xl mb-3" />
        <h2 className="text-xl font-semibold mb-2">Error Loading Chats</h2>
        <p className="text-center max-w-md">{fetchError}</p>
        <button
          onClick={() => window.location.reload()} // Simple reload retry
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Main UI
  const currentActiveChatData = getActiveChat(); // Get the data for the active chat

  return (
    // Added 'lg:overflow-hidden' potentially useful if content pushes boundaries before xl
    <div className="flex h-[calc(100vh-65px)] bg-gray-50 text-gray-900 relative font-sans box-border overflow-hidden"> {/* Added overflow-hidden */}

      {/* --- Sidebar (Chat List) --- */}
      {/* MODIFIED: Added hidden, xl:flex, xl:flex-col, xl:flex-shrink-0, removed initial w-1/4 */}
      <div className={`
                relative flex flex-col h-[calc(100vh-65px)]
                bg-white border-r border-gray-200
                transition-all duration-300 ease-in-out /* Animate width change */
                flex-shrink-0 /* Prevent shrinking */
                ${isSidebarExpanded ? 'w-80' : 'w-0'} /* Conditional Width */
                `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 flex-shrink-0"> {/* Ensure header doesn't shrink */}

          <h2 className="text-xl font-semibold text-gray-800">
            {isSidebarExpanded ? "Customer Chats" : ""}
          </h2>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {isSidebarExpanded ? `${chats.filter(c => c.status !== 'resolved').length} active chats` : ""}
            </span>
            {/* Always render Toggle Button */}
            <button
              onClick={toggleSidebar}
              className={` hover:text-gray-800 hover:cursor-pointer ${isSidebarExpanded ? 'hover:bg-gray-100 rounded p-1 mb-5 text-gray-500' : 'mt-8.5 rounded text-black'}`}
              aria-label={isSidebarExpanded ? "Collapse chat list" : "Expand chat list"}
              title={isSidebarExpanded ? "Collapse chat list" : "Expand chat list"}
            >
              {/* Change icon based on state */}
              {isSidebarExpanded ? <FiChevronsLeft size={20} /> : <FiChevronsRight size={25} />}
            </button>
          </div>
        </div>

        {/* Chat List - Scrollable Area */}
        <div className="overflow-y-auto flex-grow"> {/* This div scrolls if content overflows */}
          {chats.length > 0 ? (
            chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => handleSelectChat(chat.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-100 ${activeChatId === chat.id ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
                  } ${chat.unread ? 'font-semibold' : ''}`}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && handleSelectChat(chat.id)}
              >
                <div className="flex items-center">
                  <img
                    src={chat.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.customer)}&background=random`} // Fallback avatar
                    alt={`${chat.customer}'s avatar`}
                    className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0"> {/* Prevents long names/messages from breaking layout */}
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm truncate font-medium text-gray-800">{chat.customer}</h3>
                      <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {chat.messages?.length > 0
                          ? new Date(chat.messages[chat.messages.length - 1].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-0.5">{chat.lastMessage || 'No messages yet'}</p>
                    <div className="flex items-center mt-1.5 justify-between">
                      <div className="flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${chat.status === 'resolved' ? 'bg-gray-400' : 'bg-green-500'}`}></span>
                        <span className="text-xs text-gray-500 capitalize">{chat.status || 'pending'}</span>
                      </div>
                      {chat.unread && (
                        <span className="bg-blue-500 text-white text-xs font-medium px-1.5 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No chats found.</div>
          )}
        </div>
      </div>

      {/* --- Main Chat Area --- */}
      {/* Added overflow-hidden here to prevent this column itself from overflowing */}
      <div className="flex-1 flex flex-col bg-gray-100 overflow-auto">
        {currentActiveChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between shadow-sm flex-shrink-0">
              <div className="flex items-center min-w-0">
                <img
                  src={currentActiveChatData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentActiveChatData.customer)}&background=random`}
                  alt={`${currentActiveChatData.customer}'s avatar`}
                  className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="font-medium text-gray-800 truncate">{currentActiveChatData.customer}</h3>
                  <p className={`text-sm capitalize ${currentActiveChatData.status === 'resolved' ? 'text-gray-500' : 'text-green-600'}`}>
                    {currentActiveChatData.status || 'pending'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 flex-shrink-0">
                {currentActiveChatData.status !== 'resolved' && (
                  <button
                    onClick={() => handleResolveChat(activeChatId)}
                    title="Mark this chat as resolved"
                    className="flex items-center text-sm bg-gray-100 hover:bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium transition-colors duration-150"
                  >
                    <FiCheck className="mr-1" size={16} /> Mark Resolved
                  </button>
                )}
                {/* Mobile Settings Trigger */}
                <button
                  onClick={() => setIsMobileSettingsOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-200 block xl:hidden"
                  aria-label="Open AI Settings"
                  title="Open AI Settings"
                >
                  <FiSettings size={20} />
                </button>
              </div>
            </div>

            {/* Messages Area - Scrollable */}
            {/* Removed max-h, flex-1 handles height, overflow-y-auto handles scrolling */}
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto basis-0 ">
              <div className="space-y-4">
                {currentActiveChatData.messages?.map(message => (
                  <div key={message.id} className={`flex ${message.sender === 'customer' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-xl shadow-sm ${message.sender === 'customer'
                        ? 'bg-white border border-gray-200 text-gray-800'
                        : message.aiGenerated
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white'
                          : 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white'
                        } ${message.isError ? 'bg-red-100 border border-red-300 text-red-800' : ''}` // Style for errors
                      }
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p> {/* Allow line breaks */}
                      <div className={`flex justify-between items-center mt-1.5 pt-1 border-t ${message.sender === 'customer' ? 'border-gray-200/50' : 'border-white/20'}`}>
                        <span className={`text-xs opacity-80 ${message.sender === 'customer' ? 'text-gray-500' : 'text-white/80'}`}>
                          {new Date(message.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                        </span>
                        {message.aiGenerated && (
                          <span className="text-xs font-medium opacity-90 text-purple-200 ml-2">AI</span>
                        )}
                        {message.isError && (
                          <FiAlertCircle className="text-red-600 ml-2" size={12} />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {/* AI Typing Indicator */}
                {isAiTyping[activeChatId] && (
                  <div className="flex justify-end">
                    <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-xl shadow-sm max-w-min"> {/* Fit content */}
                      <div className="flex items-center">
                        <span className="text-sm mr-2">AI is typing</span>
                        {/* Simple dots */}
                        <div className="typing-dots">
                          <div className="dot !bg-white/60"></div>
                          <div className="dot !bg-white/60"></div>
                          <div className="dot !bg-white/60"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* Invisible marker div for scrolling */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white shadow-inner flex-shrink-0">
              <div className="flex items-center bg-gray-100 rounded-lg px-2">
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isSending && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent px-3 py-2.5 focus:outline-none text-gray-800 placeholder-gray-500 text-sm"
                  disabled={isSending}
                  aria-label="Message input"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isSending || !currentMessage.trim()}
                  className={`bg-blue-600 text-white p-2 rounded-lg m-1 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150`}
                  aria-label={isSending ? 'Sending message' : 'Send message'}
                  title={isSending ? 'Sending...' : 'Send message'}
                >
                  {isSending ? <FiLoader className="animate-spin" size={18} /> : <FiSend size={18} />}
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                {autoReplyEnabled ? 'AI Auto-Reply: ON' : 'AI Auto-Reply: OFF'} | Tone: <span className="capitalize">{aiTone}</span>
              </div>
            </div>
          </>
        ) : (
          // No Chat Selected View
          <div className="flex-1 flex items-center justify-center bg-gray-100 text-center p-4">
            <div className="text-gray-500">
              <FiMessageSquare className="mx-auto text-5xl mb-4 opacity-70" />
              <h3 className="text-lg font-medium">Select a conversation</h3>
              <p className="mt-1 text-sm">Choose a chat from the sidebar to view messages and reply.</p>
            </div>
          </div>
        )}
      </div>

      {/* --- AI Settings Panel (Sidebar) --- */}
      {/* Added transitions and fixed positioning for mobile */}
      <div className={`
           w-80 bg-white p-4 border-l border-gray-200 shadow-lg flex-shrink-0 flex flex-col
           transition-transform duration-300 ease-in-out fixed top-0 right-0 h-full z-50 transform
           xl:static xl:h-auto xl:shadow-none xl:border-l xl:z-auto xl:transform-none
           ${isMobileSettingsOpen ? 'translate-x-0' : 'translate-x-full'} xl:translate-x-0
         `}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setIsMobileSettingsOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 xl:hidden p-1"
          aria-label="Close settings"
          title="Close settings"
        >
          <FiX size={24} />
        </button>

        <h3 className={`font-medium text-lg mb-4 pt-8 xl:pt-0 flex-shrink-0`}>AI Assistant Settings</h3>

        {/* Settings Content - Scrollable */}
        <div className="space-y-6 overflow-y-auto flex-grow pr-1"> {/* Added scroll for settings content */}
          {/* Enable Auto-Reply Toggle */}
          <div>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700 text-sm font-medium">Enable Auto-Reply</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={autoReplyEnabled}
                  onChange={handleToggleAutoReply}
                  aria-labelledby="auto-reply-label"
                />
                <div className={`block w-11 h-6 rounded-full transition-colors ${autoReplyEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${autoReplyEnabled ? 'transform translate-x-5' : ''}`}></div>
              </div>
            </label>
            <p id="auto-reply-label" className="text-xs text-gray-500 mt-1">AI will attempt to respond when applicable.</p>
          </div>

          {/* Response Speed */}
          <div>
            <label className="block text-gray-700 mb-1.5 text-sm font-medium">Response Speed</label>
            <div className="flex space-x-2">
              {['fast', 'medium', 'slow'].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setAiResponseSpeed(speed)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors duration-150 ${aiResponseSpeed === speed ? 'bg-purple-100 text-purple-800 font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  aria-pressed={aiResponseSpeed === speed}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {aiResponseSpeed === 'fast' ? 'Responds immediately (may be less thoughtful).' :
                aiResponseSpeed === 'medium' ? 'Takes a moment to craft responses.' :
                  'Takes longer for more detailed responses.'}
            </p>
          </div>

          {/* Response Tone */}
          <div>
            <label className="block text-gray-700 mb-1.5 text-sm font-medium">Response Tone</label>
            <div className="flex space-x-2">
              {['professional', 'friendly', 'formal'].map((tone) => (
                <button
                  key={tone}
                  onClick={() => setAiTone(tone)}
                  className={`px-3 py-1 rounded-full text-xs transition-colors duration-150 ${aiTone === tone ? 'bg-purple-100 text-purple-800 font-semibold' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  aria-pressed={aiTone === tone}
                >
                  {tone.charAt(0).toUpperCase() + tone.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {aiTone === 'professional' ? 'Balanced, business-appropriate responses.' :
                aiTone === 'friendly' ? 'Casual, conversational tone.' :
                  'Very polite and structured responses.'}
            </p>
          </div>

          {/* Common Responses */}
          <div>
            <label className="block text-gray-700 mb-1.5 text-sm font-medium">Common Responses</label>
            <div className="space-y-1.5">
              {Object.entries(commonResponseTemplates).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleCommonResponseClick(value)}
                  title={`Use: ${value}`}
                  className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors duration-100 focus:outline-none focus:ring-1 focus:ring-blue-300"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>
        </div> {/* End scrollable settings content */}
      </div>

      {/* Background Overlay for mobile settings */}
      {
        isMobileSettingsOpen && (
          <div
            onClick={() => setIsMobileSettingsOpen(false)}
            className="fixed inset-0 bg-black/30 z-40 xl:hidden"
            aria-hidden="true"
          ></div>
        )
      }

      {/* You might want a button to toggle the sidebar on smaller screens */}
      {/* Example (place in main chat header): */}
      {/* {!activeChatId && ( // Only show if no chat is active on mobile, preventing overlap
            <button
                onClick={() => {
                    // Logic to show the sidebar on small screens
                    // This requires additional state to control mobile sidebar visibility
                    // For now, the sidebar is just hidden below XL
                    alert("Toggling mobile sidebar requires extra state/logic");
                }}
                className="p-2 rounded-lg hover:bg-gray-200 block xl:hidden"
                aria-label="Show Chats"
                title="Show Chats"
            >
                <FiMessageSquare size={20} />
            </button>
        )} */}

    </div >
  );
};

export default CustomerServicePage;