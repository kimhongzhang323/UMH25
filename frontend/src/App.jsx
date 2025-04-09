import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Plus, Menu, Image, Search, File, Brain } from 'lucide-react';

export default function App() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hello! I am your MEX assistant. I can help you with questions, writing, analysis, and more. How can I assist you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState('chat'); // 'chat', 'deep-think', 'search', 'image'
  const [filePreview, setFilePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setFilePreview(null);
    setLoading(true);

    // Simulate different response types based on mode
    setTimeout(() => {
      let botMsg;
      switch(activeMode) {
        case 'image':
          botMsg = {
            id: (Date.now() + 1).toString(),
            text: `Here's the image you requested based on: "${input}"`,
            sender: 'bot',
            timestamp: new Date(),
            isImage: true,
            imageUrl: `https://source.unsplash.com/random/800x400/?${encodeURIComponent(input)}`
          };
          break;
        case 'deep-think':
          botMsg = {
            id: (Date.now() + 1).toString(),
            text: `After deep consideration about "${input}", here's my analysis:\n\n1. First point of analysis...\n2. Second perspective...\n3. Potential implications...\n\nThis is a more thorough response than standard chat mode.`,
            sender: 'bot',
            timestamp: new Date(),
          };
          break;
        case 'search':
          botMsg = {
            id: (Date.now() + 1).toString(),
            text: `Search results for "${input}":\n\n1. First relevant result...\n2. Second source...\n3. Additional information...`,
            sender: 'bot',
            timestamp: new Date(),
          };
          break;
        default:
          botMsg = {
            id: (Date.now() + 1).toString(),
            text: `Thank you for your message. I understand you said: "${input}"\n\nThis is a standard response.`,
            sender: 'bot',
            timestamp: new Date(),
          };
      }
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const newChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Hello! I am your MEX assistant. I can help you with questions, writing, analysis, and more. How can I assist you today?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setActiveMode('chat');
    setFilePreview(null);
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

  const renderModeIndicator = () => {
    switch(activeMode) {
      case 'image':
        return <span className="flex items-center gap-1 text-blue-600"><Image className="w-4 h-4" /> Image</span>;
      case 'deep-think':
        return <span className="flex items-center gap-1 text-purple-600"><Brain className="w-4 h-4" /> Deep Think</span>;
      case 'search':
        return <span className="flex items-center gap-1 text-green-600"><Search className="w-4 h-4" /> Search</span>;
      default:
        return <span className="flex items-center gap-1 text-gray-600">Chat</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
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
            {/* History items would go here */}
            <div className="p-2 text-sm text-gray-500 text-center">
              No previous chats
            </div>
          </div>
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              <p>Your data is secure and private</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">MEX Assistant</h1>
          <div className="w-8"></div> {/* Spacer for balance */}
        </header>

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
                      <img src="/grab.png" alt="AI Icon" />
                    ) : (
                      <span className="text-sm font-medium text-white">Kim</span>
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
                    <Sparkles className="w-5 h-5" />
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
              <button
                onClick={() => setActiveMode('chat')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  activeMode === 'chat' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveMode('deep-think')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  activeMode === 'deep-think' 
                    ? 'bg-purple-100 text-purple-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Brain className="w-4 h-4" />
                Deep Think
              </button>
              <button
                onClick={() => setActiveMode('search')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  activeMode === 'search' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Search className="w-4 h-4" />
                Search
              </button>
              <button
                onClick={() => setActiveMode('image')}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  activeMode === 'image' 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Image className="w-4 h-4" />
                Text to Image
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
                    'Message MEX...'
                  }
                  rows="1"
                  className="flex-1 bg-transparent border-0 resize-none max-h-[200px] focus:ring-0 focus:outline-none text-gray-900 placeholder-gray-400 p-2"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className={`p-2 rounded-lg ${
                    input.trim()
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400'
                  } transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-2`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100 flex justify-between items-center">
                <span>Press Enter to send, Shift + Enter for new line</span>
                <span>{renderModeIndicator()}</span>
              </div>
            </form>
            <div className="text-xs text-gray-500 text-center mt-2">
              MEX can make mistakes. Consider checking important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}