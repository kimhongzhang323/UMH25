import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Plus, Menu, Image, Search, File, Brain, Mic, MicOff, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Chatbot() {
  // Sample chat history data
  const sampleChatHistory = [
    {
      id: 'chat1',
      title: 'Marketing Strategy',
      preview: 'Let me analyze our competitors...',
      timestamp: new Date(Date.now() - 86400000), // Yesterday
      messages: [
        {
          id: '1',
          text: 'Can you analyze our competitors in the food delivery market?',
          sender: 'user',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: '2',
          text: 'After analyzing competitors: 1. Competitor A has 40% market share 2. Competitor B focuses on premium restaurants 3. Competitor C has fastest delivery times',
          sender: 'bot',
          timestamp: new Date(Date.now() - 86300000),
          mode: 'deep-think'
        }
      ]
    },
    {
      id: 'chat2',
      title: 'Image Generation',
      preview: 'Restaurant menu design...',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      messages: [
        {
          id: '1',
          text: 'Generate an image of a modern restaurant menu',
          sender: 'user',
          timestamp: new Date(Date.now() - 3600000),
          mode: 'image'
        },
        {
          id: '2',
          text: 'Here\'s the generated image of a modern restaurant menu',
          sender: 'bot',
          timestamp: new Date(Date.now() - 3590000),
          isImage: true,
          imageUrl: 'https://source.unsplash.com/random/800x400/?restaurant,menu'
        }
      ]
    },
    {
      id: 'chat3',
      title: 'Market Research',
      preview: 'Latest food trends...',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      messages: [
        {
          id: '1',
          text: 'Search for latest food trends in Southeast Asia',
          sender: 'user',
          timestamp: new Date(Date.now() - 1800000),
          mode: 'search'
        },
        {
          id: '2',
          text: 'Search results for food trends:\n1. Plant-based meats growing 30% YoY\n2. Cloud kitchens expanding\n3. Ghost kitchens gaining popularity',
          sender: 'bot',
          timestamp: new Date(Date.now() - 1790000),
          mode: 'search'
        }
      ]
    }
  ];

  const [messages, setMessages] = useState([
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
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState(sampleChatHistory);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Initialize speech recognition (no echo)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
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
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  // Load a chat from history
  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

  // Create new chat
  const newChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I am your HEX assistant. I can help you with questions, writing, analysis, and more. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setActiveMode('chat');
    setFilePreview(null);
    setInput('');
    setCurrentChatId(null);
  };

  // Save current chat to history
  const saveChatToHistory = () => {
    if (messages.length <= 1) return; // Don't save empty chats
    
    const newChat = {
      id: `chat${Date.now()}`,
      title: messages.find(m => m.sender === 'user')?.text.substring(0, 30) || 'New Chat',
      preview: messages.find(m => m.sender === 'bot')?.text.substring(0, 50) || 'New conversation',
      timestamp: new Date(),
      messages: [...messages]
    };

    setChatHistory(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  // Prototype function for fake responses based on mode
  const generateFakeResponse = (userInput, mode) => {
    const responses = {
      chat: `I understand you said: "${userInput}". This is a standard response from your HEX assistant.`,
      'deep-think': `Deep analysis of "${userInput}":\n\n1. First point of consideration...\n2. Second perspective...\n3. Potential implications...\n\nThis is a more thorough response than standard chat mode.`,
      search: `Search results for "${userInput}":\n\n1. First relevant result (example.com)\n2. Second source (example.org)\n3. Additional information (example.net)`,
      image: `Here's the generated image based on: "${userInput}"`
    };
    return responses[mode] || responses.chat;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      mode: activeMode,
      file: filePreview
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setFilePreview(null);
    setLoading(true);

    // Simulate API call with different response types
    setTimeout(() => {
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: generateFakeResponse(input, activeMode),
        sender: 'bot',
        timestamp: new Date(),
        isImage: activeMode === 'image',
        imageUrl: activeMode === 'image' ? 
          `https://source.unsplash.com/random/800x400/?${encodeURIComponent(input)}` : null
      };

      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
      
      // Save to history if this is a new chat
      if (!currentChatId) {
        saveChatToHistory();
      } else {
        // Update existing chat in history
        setChatHistory(prev => 
          prev.map(chat => 
            chat.id === currentChatId 
              ? {...chat, messages: [...chat.messages, userMsg, botMsg]} 
              : chat
          )
        );
      }
    }, 1500);
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

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const toggleRecording = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      setInput(''); // Clear input when starting new recording
      recognition.start();
      setIsRecording(true);
    }
  };

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

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed left-4 top-16 z-50 p-2 rounded-full bg-white border border-gray-200 shadow-sm ${
          sidebarOpen ? 'ml-64' : 'ml-0'
        } transition-all duration-300`}
      >
        {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <div
        className={`w-64 bg-white border-r border-gray-200 flex flex-col h-screen absolute z-40 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
          {chatHistory.length > 0 ? (
            <>
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left p-3 rounded-lg mb-2 hover:bg-gray-100 transition-colors ${
                    currentChatId === chat.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <div className="font-medium text-gray-900 truncate">{chat.title}</div>
                  <div className="text-sm text-gray-500 truncate">{chat.preview}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(chat.timestamp)}</div>
                </button>
              ))}
            </>
          ) : (
            <div className="p-2 text-sm text-gray-500 text-center">
              No previous chats
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Your data is secure and private</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-3xl mx-auto w-full p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-6 last:mb-0 ${
                  msg.sender === 'bot' ? 'pr-8' : 'pl-8'
                }`}
              >
                <div
                  className={`flex gap-4 ${
                    msg.sender === 'bot' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.sender === 'bot'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-purple-100 text-purple-600'
                    }`}
                  >
                    {msg.sender === 'bot' ? (
                      <img src="/grab.png" alt="HEX Assistant" className="w-6 h-6" />
                    ) : (
                      <span className="text-sm font-medium">You</span>
                    )}
                  </div>
                  <div
                    className={`max-w-[calc(100%-56px)] ${
                      msg.sender === 'bot' ? 'text-left' : 'text-right'
                    }`}
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
                        className={`inline-block px-4 py-3 rounded-2xl ${
                          msg.sender === 'bot'
                            ? 'bg-white border border-gray-200'
                            : 'bg-blue-600 text-white'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto w-full">
            {/* Mode Selector */}
            <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
              {['chat', 'deep-think', 'search', 'image'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                    activeMode === mode 
                      ? `bg-${mode === 'deep-think' ? 'purple' : 
                         mode === 'search' ? 'green' : 
                         mode === 'image' ? 'blue' : 'gray'}-100 text-${mode === 'deep-think' ? 'purple' : 
                         mode === 'search' ? 'green' : 
                         mode === 'image' ? 'blue' : 'gray'}-600` 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'deep-think' ? <Brain className="w-4 h-4" /> : 
                   mode === 'search' ? <Search className="w-4 h-4" /> : 
                   mode === 'image' ? <Image className="w-4 h-4" /> : null}
                  {mode === 'deep-think' ? 'Deep Think' : 
                   mode === 'search' ? 'Search' : 
                   mode === 'image' ? 'Image' : 'Chat'}
                </button>
              ))}
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
                  className={`p-2 rounded-lg mr-2 ${
                    isRecording 
                      ? 'bg-red-100 text-red-600 animate-pulse' 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-lg ${
                    input.trim()
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
    </div>
  );
}