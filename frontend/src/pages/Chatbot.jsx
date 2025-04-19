// Imports
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Loader2,
  Sparkles,
  Plus,
  Menu,
  Image,
  Search,
  File,
  Brain,
  Mic,
  MicOff,
  Store,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Languages
} from 'lucide-react';
import jsConvert from 'js-convert-case';
import { v4 as uuidV4 } from 'uuid';

const BACKEND_URL = "http://localhost:8000";

// Component
export default function Chatbot() {
  // State Management
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('chat');
  const [filePreview, setFilePreview] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [isNewChat, setIsNewChat] = useState(false); // Add this line
  const [currentChatId, setCurrentChatId] = useState(null);
  const [examplePrompts] = useState([
    "How do I grow my business?",
    "What are the best marketing strategies?",
    "Can you help me analyze my sales data?",
  ]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [merchantProfile, setMerchantProfile] = useState({
    merchantType: '',
    productType: '',
    businessSize: '',
    challenges: [],
    location: {
      region: '',
      marketType: '',
    },
    language: 'en'
  });

  // Refs
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Effects
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = merchantProfile.language === 'zh' ? 'zh-CN' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        recognitionInstance.stop();
        setIsRecording(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      recognitionInstance.onend = () => {
        if (isRecording) {
          recognitionInstance.start();
        }
      };

      setRecognition(recognitionInstance);
      return () => recognitionInstance.abort();
    }
  }, [merchantProfile.language]);

  useEffect(() => {
    const scrollToBottom = () => {
      const navbarHeight = document.querySelector('header')?.offsetHeight || 0;
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.scrollBy(0, -navbarHeight);
    };

    scrollToBottom();
  }, [currentChatMessages, loading]);

  // Get all chats from user
  useEffect(() => {
    fetch(BACKEND_URL + "/get_all_chats")
      .then(response => response.json())
      .then(responseData => {
        setChatList(responseData);
      })
      .catch(err => {
        console.log(err);
      });

    return () => { };
  }, [])

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (currentChatId) {
      // Fetch current chat data if currentChatId changes
    }
  }, [currentChatId]);

  useEffect(() => {

  }, [currentChatId])

  // Handlers
  // Removed duplicate loadChat function

  // Update your newChat function to set this state
  const newChat = () => {
    setIsNewChat(true);
    let firstMessage = {
      id: '1',
      text: 'Hello! I am your HEX assistant. I can help you with questions, writing, analysis, and more. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    }
    setCurrentChatMessages([firstMessage]);

    fetch(BACKEND_URL + "/new_chat", {
      method: "POST"
    })

    setActiveMode('chat');
    setFilePreview(null);
    setInput('');
    setCurrentChatId(null);
  };

  // Update your loadChat function to reset the new chat state
  const loadChat = (chatId) => {
    if (chatId == currentChatId)
      return

    setIsNewChat(false);
    setCurrentChatMessages([]);

    let getAllMessagesAPI = new URL(BACKEND_URL + "/get_all_messages");
    getAllMessagesAPI.searchParams.append("chat_id", chatId);

    fetch(getAllMessagesAPI.toString())
      .then(response => response.json())
      .then(responseData => {
        setCurrentChatMessages(prev => [ ...prev, ...responseData])
      });

    setCurrentChatId(chatId);
  };

  // Update your handleSubmit function to reset isNewChat when saving
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: uuidV4(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setCurrentChatMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: userMsg.text,
          chat_id: currentChatId || 'default',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const botMsg = {
        id: uuidV4(),
        text: responseData.response || "Sorry, I couldn't process your request.",
        sender: 'bot',
        timestamp: new Date(),
        url: responseData.url || null, // Add URL if provided
        image: responseData.image || null, // Add image if provided
      };

      setCurrentChatMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = {
        id: uuidV4(),
        text: 'An error occurred while fetching the response. Please try again.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setCurrentChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };
  // Define the formatDate function before using it in JSX
  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Convert Unix timestamps to Date objects
  // Note that Date accepts timestamp in millisecond instead of seconds
  const timestampToDate = (timestamp) => new Date(timestamp * 1000);


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview({
          name: file.name,
          type: file.type,
          size: file.size,
          preview: event.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMerchantProfileSave = () => {
    fetch(BACKEND_URL + "/update_merchant_info", {
      method: "PUT",
      body: JSON.stringify(
        jsConvert.snakeKeys(merchantProfile)
      )
    });
  }

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setInput('');
      recognition.start();
      setIsRecording(true);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const renderExamplePrompts = () => (
    <div className="text-center mt-10">
      <h2 className="text-xl font-semibold mb-4">What can I help with?</h2>
      <ul className="space-y-2">
        {examplePrompts.map((prompt, index) => (
          <li
            key={index}
            className="cursor-pointer text-blue-600 hover:underline"
            onClick={() => setInput(prompt)}
          >
            {prompt}
          </li>
        ))}
      </ul>
    </div>
  );

  const renderModeIndicator = () => {
    const modeConfig = {
      chat: { icon: null, color: 'gray' },
      'deep-think': { icon: <Brain className="w-4 h-4" />, color: 'purple' },
      search: { icon: <Search className="w-4 h-4" />, color: 'green' },
      image: { icon: <Image className="w-4 h-4" />, color: 'blue' }
    };

    const { icon, color } = modeConfig[activeMode] || modeConfig.chat;
    return (
      <span className={`flex items-center gap-1 text-${color}-600`}>
        {icon}
        {activeMode === 'deep-think' ? 'Deep Think' :
          activeMode === 'search' ? 'Search' :
            activeMode === 'image' ? 'Image' : 'Chat'}
      </span>
    );
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-gray-50 text-gray-900 flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed left-4 top-16 z-50 p-2 rounded-full bg-white border border-gray-200 shadow-sm ${sidebarOpen ? 'ml-64' : 'ml-0'
} transition-all duration-300`}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed w-64 bg-white border-r border-gray-200 flex flex-col h-[calc(100vh)] z-40 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
}`}
      >
        <div className="p-4">
          <button
            onClick={newChat}
            className="w-full flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-100 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>New chat</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {/* New chat tab - shown when isNewChat is true */}
          {isNewChat && (
            <button
              className={`w-full text-left p-3 rounded-lg mb-2 bg-gray-100 transition-colors`}
            >
              <div className="font-medium text-gray-900 truncate">New Chat</div>
              <div className="text-sm text-gray-500 truncate">Getting started...</div>
              <div className="text-xs text-gray-400 mt-1">Just now</div>
            </button>
          )}

          {chatList.length > 0 ? (
            <>
              {chatList.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-gray-100 transition-colors ${currentChatId === chat.id ? 'bg-gray-100' : ''
}`}
                >
                  <div className="font-medium text-gray-900 truncate">{chat.title}</div>
                  <div className="text-sm text-gray-500 truncate">{chat.preview}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate( timestampToDate(chat.timestamp) )}</div>
                </button>
              ))}
            </>
          ) : (
              !isNewChat && ( // Only show "No previous chats" if there's no new chat either
                <div className="p-2 text-sm text-gray-500 text-center">
                  No previous chats
                </div>
              )
            )}
        </div>
        {/* Merchant Profile Quick View if profile exists */}
        {merchantProfile.merchantType && (
          <div className="p-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Store className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Merchant Profile</span>
              <button
                onClick={() => setShowFilterPanel(true)}
                className="ml-auto text-xs text-blue-600"
              >
                Edit
              </button>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              {merchantProfile.merchantType && <p><span className="font-medium">Merchant Type:</span> {merchantProfile.merchantType}</p>}
              {merchantProfile.productType && <p><span className="font-medium">Products:</span> {merchantProfile.productType}</p>}
              {merchantProfile.businessSize && <p><span className="font-medium">Business Size:</span> {merchantProfile.businessSize}</p>}
              {merchantProfile.challenges.length > 0 && (
                <p>
                  <span className="font-medium">Challenges:</span> {merchantProfile.challenges.join(', ')}
                </p>
              )}
              {merchantProfile.location.marketType && <p><span className="font-medium">Community Type:</span> {merchantProfile.location.marketType}</p>}
              {merchantProfile.location.region && <p><span className="font-medium">Region:</span> {merchantProfile.location.region}</p>}
              {merchantProfile.language && <p><span className="font-medium">Language:</span> {merchantProfile.language === 'zh' ? 'Chinese' : 'English'}</p>}
            </div>
          </div>
        )}
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Your data is secure and private</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
}`}>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-3xl mx-auto w-full p-4">
            {currentChatMessages.length === 0 ? (
              renderExamplePrompts()
            ) : (
                currentChatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-6 last:mb-0 ${msg.sender === 'bot' ? 'pr-8' : 'pl-8'
}`}
                  >
                    <div
                      className={`flex gap-4 ${msg.sender === 'bot' ? 'flex-row' : 'flex-row-reverse'
}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'bot'
? 'bg-blue-100 text-blue-600'
: 'bg-purple-100 text-purple-600'
}`}
                      >
                        {msg.sender === 'bot' ? (
                          <img src="/grab.png" alt="HEX Assistant" className="w-6 h-6" />
                        ) : (
                            <span className="text-sm font-medium text-white">
                              {merchantProfile.name ? merchantProfile.name.charAt(0) : "U"}
                            </span>
                          )}
                      </div>
                      <div
                        className="max-w-[calc(100%-56px)]"
                      >
                        {msg.mode && msg.sender === 'user' && (
                          <div className="text-xs text-gray-500 mb-1">
                            {msg.mode === 'image' ? 'Image generation' :
                              msg.mode === 'deep-think' ? 'Deep thinking' :
                                msg.mode === 'search' ? 'Web search' : 'Chat'}
                          </div>
                        )}
                        {msg.file && (
                          <div className="mb-2 p-2 bg-gray-100 rounded-lg">
                            <div className="flex items-center gap-2">
                              <File className="w-4 h-4 text-gray-500" />
                              <span className="text-sm">{msg.file.name}</span>
                            </div>
                            {msg.file.type.startsWith('image/') && (
                              <img
                                src={msg.file.preview}
                                alt="Preview"
                                className="mt-2 max-w-full max-h-40 rounded"
                              />
                            )}
                          </div>
                        )}
                        {msg.imageUrl ? (
                          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                            <img
                              src={msg.imageUrl}
                              alt="Generated content"
                              className="w-full"
                            />
                            <div className="p-3 text-sm">
                              <p>{msg.text}</p>
                            </div>
                          </div>
                        ) : (
                            <div
                              className={`inline-block px-4 py-3 rounded-2xl ${msg.sender === 'bot'
? 'bg-white border border-gray-200'
: 'bg-blue-600 text-white'
}`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                          )}
                        <div className="text-xs text-gray-500 mt-1">
                          {timestampToDate(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            {loading && (
              <div className="mb-6 pr-8">
                <div className="flex gap-4 flex-row">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <img src="/grab.png" alt="HEX Assistant" className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-3 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-gray-700">
                      {activeMode === 'image' ? 'Generating image...' :
                        activeMode === 'deep-think' ? 'Deep thinking...' :
                          activeMode === 'search' ? 'Searching...' : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto w-full">
            {/* Mode Selector */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              
              <button
                onClick={() => setShowFilterPanel(true)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${merchantProfile.merchantType
                  ? 'bg-yellow-100 text-yellow-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
              >
                <ShoppingBag className="w-4 h-4" />
                {merchantProfile.merchantType ? 'Merchant' : 'Business Profile'}
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl border border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
            >
              {filePreview && (
                <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{filePreview.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilePreview(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </div>
              )}
              <div className="flex items-end p-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <button
                  type="button"
                  onClick={triggerFileInput}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg mr-1"
                >
                  <File className="w-5 h-5" />
                </button>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeMode === 'image' ? 'Describe the image you want to generate...' :
                      activeMode === 'deep-think' ? 'Ask me to think deeply about...' :
                        activeMode === 'search' ? 'What would you like to search for?' :
                          'Message HEX...'
                  }
                  rows="1"
                  className="flex-1 bg-transparent border-0 resize-none max-h-[200px] focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-2"
                />
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`p-2 rounded-lg mr-2 ${isRecording
? 'bg-red-100 text-red-600 animate-pulse'
: 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
}`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-lg ${input.trim()
? 'bg-blue-600 text-white hover:bg-blue-700'
: 'bg-gray-100 text-gray-400'
} transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 flex justify-between items-center">
                <span>Press Enter to send, Shift + Enter for new line</span>
                <span>{renderModeIndicator()}</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Merchant Profile Panel */}
    {showFilterPanel && (
      <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
              <Store className="w-6 h-6 text-yellow-600" />
              Business Profile Setup
            </h2>
            <button
              onClick={() => setShowFilterPanel(false)}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleMerchantProfileSave();
              setShowFilterPanel(false);
            }}>
              <div className="space-y-6">
                {/* Business Challenges Section */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <h3 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 8v-4l8 8-8 8v-4H2v-8h14z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Business Focus Areas
                    <span className="text-sm font-normal text-gray-500 ml-2">(Select up to 3)</span>
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      { id: 'sales', label: 'Sales growth', icon: 'trending-up' },
                      { id: 'retention', label: 'Customer retention', icon: 'users' },
                      { id: 'marketing', label: 'Marketing effectiveness', icon: 'megaphone' },
                      { id: 'inventory', label: 'Inventory management', icon: 'package' },
                      { id: 'productivity', label: 'Staff productivity', icon: 'briefcase' },
                      { id: 'costs', label: 'Cost reduction', icon: 'trending-down' },
                      { id: 'digital', label: 'Digital transformation', icon: 'smartphone' },
                      { id: 'delivery', label: 'Delivery optimization', icon: 'truck' },
                      { id: 'menu', label: 'Menu/pricing strategy', icon: 'tag' },
                      { id: 'competition', label: 'Competitive positioning', icon: 'target' }
                    ].map(challenge => (
                      <div 
                        key={challenge.id}
                        className={`flex items-center rounded-lg p-3 cursor-pointer transition-all border ${
                          merchantProfile.challenges.includes(challenge.label)
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          if (merchantProfile.challenges.includes(challenge.label)) {
                            setMerchantProfile(prev => ({
                              ...prev,
                              challenges: prev.challenges.filter(c => c !== challenge.label)
                            }));
                          } else {
                            if (merchantProfile.challenges.length < 3) {
                              setMerchantProfile(prev => ({
                                ...prev,
                                challenges: [...prev.challenges, challenge.label]
                              }));
                            }
                          }
                        }}
                      >
                        <div className={`w-5 h-5 mr-3 flex-shrink-0 rounded ${
                          merchantProfile.challenges.includes(challenge.label)
                            ? 'text-blue-600'
                            : 'text-gray-400'
                        }`}>
                          {/* Simple icon placeholder - replace with actual icons if desired */}
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {challenge.icon === 'trending-up' && <path d="M23 6l-9.5 9.5-5-5L1 18" />}
                            {challenge.icon === 'users' && <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>}
                            {challenge.icon === 'megaphone' && <path d="M3 11l18-5v12L3 13v-2z" />}
                            {challenge.icon === 'package' && <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />}
                            {challenge.icon === 'briefcase' && <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>}
                            {challenge.icon === 'trending-down' && <path d="M23 18l-9.5-9.5-5 5L1 6" />}
                            {challenge.icon === 'smartphone' && <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>}
                            {challenge.icon === 'truck' && <path d="M1 3h15v13H1z M16 8h4l3 3v5h-7 M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z M17 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />}
                            {challenge.icon === 'tag' && <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />}
                            {challenge.icon === 'target' && <circle cx="12" cy="12" r="10"></circle>}
                          </svg>
                        </div>
                        <span className="text-sm font-medium">{challenge.label}</span>
                        {merchantProfile.challenges.includes(challenge.label) && (
                          <div className="ml-auto bg-blue-100 text-blue-600 rounded-full p-1">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {merchantProfile.challenges.length === 3 && (
                    <div className="mt-3 text-sm text-yellow-600 bg-yellow-50 p-2 rounded flex items-center gap-2">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      </svg>
                      Maximum selection reached (3 focus areas)
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setShowFilterPanel(false)}
                  className="order-2 sm:order-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="order-1 sm:order-2 py-3 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-yellow-300 flex items-center justify-center gap-2"
                >
                  <span>Save Profile</span>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
    </div>

  );
}
