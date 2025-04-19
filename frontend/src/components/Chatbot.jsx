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

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Component
export default function Chatbot() {
  // State Management
  const [currentChatMessages, setCurrentChatMessages] = useState([
    {
      id: '1',
      text: 'Hello! I am your HEX assistant. I can help you with questions, writing, analysis, and more. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
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
  const [examplePrompts, setExamplePrompts] = useState([
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
    let ignore = false;
    fetch(BACKEND_URL + "/get_all_chats")
      .then(response => response.json())
      .then(responseData => {
        setChatList(responseData);
      })
      .catch(err => {
        console.log(err);
      });

    return () => { ignore = true };
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
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: uuidV4(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      mode: activeMode,
    };

    setCurrentChatMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Generate formData to be sent
    let payload = new FormData();
    payload.append("message", userMsg);
    payload.append("chat_id", currentChatId);

    if (fileInputRef.current.files[0]) {
      payload.append("file", fileInputRef.current.files[0]);
    }

    fetch(BACKEND_URL + "/send_chat", {
      method: "POST",
      body: payload
    })
      .then(response => response.json())
      .then(responseData => {
        const botMsg = responseData;

        setCurrentChatMessages(prev => [...prev, botMsg]);
        setLoading(false);

        if (!currentChatId) {
          saveUserChat();
          setIsNewChat(false); // Reset new chat state after saving
        }
      });
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

  const saveUserChat = () => {
    if (currentChatMessages.length <= 1) return;

    const newChat = {
      id: `chat-${uuidV4()}`,
      title: currentChatMessages.find(m => m.sender === 'user')?.text.substring(0, 30) || 'New Chat',
      preview: currentChatMessages.find(m => m.sender === 'bot')?.text.substring(0, 50) || 'New conversation',
      timestamp: new Date(),
    };

    setChatList(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

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

  const handleMerchantProfileSave = (e) => {
    fetch(BACKEND_URL + "/update_merchant_info", {
      method: PUT,
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
                        {msg.isImage ? (
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
                onClick={() => setActiveMode('chat')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeMode === 'chat'
? 'bg-blue-100 text-blue-600'
: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
}`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveMode('deep-think')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeMode === 'deep-think'
? 'bg-purple-100 text-purple-600'
: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
}`}
              >
                <Brain className="w-4 h-4" />
                Deep Think
              </button>
              <button
                onClick={() => setActiveMode('search')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeMode === 'search'
? 'bg-green-100 text-green-600'
: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
}`}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={() => setActiveMode('image')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${activeMode === 'image'
? 'bg-orange-100 text-orange-600'
: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
}`}
              >
                <Image className="w-4 h-4" />
                Text to Image
              </button>
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
        <div className="fixed right-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Store className="w-5 h-5 text-yellow-600" />
                Merchant Profile & Insights Configuration
              </h2>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              <form onSubmit={(e) => {
                e.preventDefault();
                setShowFilterPanel(false);
              }}>
                <div className="space-y-4">
                  {/* Business Challenges Section */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-800 mb-3">Business Focus Areas</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Sales growth',
                        'Customer retention',
                        'Marketing effectiveness',
                        'Inventory management',
                        'Staff productivity',
                        'Cost reduction',
                        'Digital transformation',
                        'Delivery optimization',
                        'Menu/pricing strategy',
                        'Competitive positioning'
                      ].map(challenge => (
                          <label key={challenge} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={merchantProfile.challenges.includes(challenge)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (merchantProfile.challenges.length < 3) {
                                    setMerchantProfile(prev => ({
                                      ...prev,
                                      challenges: [...prev.challenges, challenge]
                                    }));
                                  }
                                } else {
                                  setMerchantProfile(prev => ({
                                    ...prev,
                                    challenges: prev.challenges.filter(c => c !== challenge)
                                  }));
                                }
                              }}
                              className="mr-2"
                            />
                            {challenge}
                          </label>
                        ))}
                    </div>
                  </div>

                  {/* Communication Preferences */}
                  <div className="border-b pb-4">
                    <h3 className="font-medium text-gray-800 mb-3">Communication Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Primary Language
                        </label>
                        <select
                          value={merchantProfile.language}
                          onChange={(e) => setMerchantProfile(prev => ({
                            ...prev,
                            language: e.target.value
                          }))}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="en">English</option>
                          <option value="zh">Chinese (中文)</option>
                          <option value="ms">Malay (Bahasa Melayu)</option>
                          <option value="id">Indonesian (Bahasa Indonesia)</option>
                          <option value="th">Thai (ไทย)</option>
                          <option value="vi">Vietnamese (Tiếng Việt)</option>
                          <option value="tl">Filipino (Tagalog)</option>
                          <option value="km">Khmer (ភាសាខ្មែរ)</option>
                          <option value="lo">Lao (ພາສາລາວ)</option>
                          <option value="my">Burmese (မြန်မာဘာသာ)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Preferred Insight Format
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="insightFormat"
                              checked={merchantProfile.insightFormat === 'text'}
                              onChange={() => setMerchantProfile(prev => ({
                                ...prev,
                                insightFormat: 'text'
                              }))}
                              className="mr-2"
                            />
                            Text Summary
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="insightFormat"
                              checked={merchantProfile.insightFormat === 'visual'}
                              onChange={() => setMerchantProfile(prev => ({
                                ...prev,
                                insightFormat: 'visual'
                              }))}
                              className="mr-2"
                            />
                            Visual Charts
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="insightFormat"
                              checked={merchantProfile.insightFormat === 'both'}
                              onChange={() => setMerchantProfile(prev => ({
                                ...prev,
                                insightFormat: 'both'
                              }))}
                              className="mr-2"
                            />
                            Both Text and Visuals
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Data Integration */}
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Data Integration</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Connect Transaction Data
                        </label>
                        <button
                          type="button"
                          className="w-full p-2 border border-gray-300 rounded-md text-left flex justify-between items-center"
                        >
                          <span>Upload CSV or Connect API</span>
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Inventory System Integration
                        </label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                        >
                          <option value="">Select Inventory System</option>
                          <option value="grab">Grab Inventory Manager</option>
                          <option value="manual">Manual Entry</option>
                          <option value="other">Other System (Specify)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFilterPanel(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                    onSubmit={handleMerchantProfileSave}
                  >
                    Save Configuration
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
