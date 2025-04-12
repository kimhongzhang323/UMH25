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

// Component
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

  // State Management
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatHistory, setChatHistory] = useState(sampleChatHistory);
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
  }, [messages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (currentChatId) {
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId ? { 
            ...chat, 
            messages, 
            title: messages.find(m => m.sender === 'user')?.text.substring(0, 30) || chat.title,
            preview: messages.find(m => m.sender === 'bot')?.text.substring(0, 50) || 'New conversation',
            timestamp: new Date()
          } : chat
        )
      );
    }
  }, [messages, currentChatId]);

  // Handlers
  const loadChat = (chatId) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setMessages(chat.messages);
      setCurrentChatId(chatId);
    }
  };

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

  const saveChatToHistory = () => {
    if (messages.length <= 1) return;
    
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
      mode: activeMode,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      let responseText;
      
      // Generate response based on merchant profile if available
      if (merchantProfile.merchantType) {
        responseText = generatePersonalizedMerchantResponse(input, merchantProfile);
      } else {
        responseText = generateFakeResponse(input, activeMode);
      }
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        isImage: activeMode === 'image',
        imageUrl: activeMode === 'image' ? 
          `https://source.unsplash.com/random/800x400/?${encodeURIComponent(input)}` : null
      };

      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
      
      if (!currentChatId) {
        saveChatToHistory();
      } else {
        setChatHistory(prev => 
          prev.map(chat => 
            chat.id === currentChatId 
              ? {
                ...chat, 
                messages: [...chat.messages, userMsg, botMsg],
                title: userMsg.text.substring(0, 30) || chat.title,
                preview: botMsg.text.substring(0, 50) || 'New conversation',
                timestamp: new Date()
              } 
              : chat
          )
        );
      }
    }, 1500);
  };

  const generateFakeResponse = (userInput, mode) => {
    const responses = {
      chat: `I understand you said: "${userInput}". This is a standard response from your HEX assistant.`,
      'deep-think': `Deep analysis of "${userInput}":\n\n1. First point of consideration...\n2. Second perspective...\n3. Potential implications...\n\nThis is a more thorough response than standard chat mode.`,
      search: `Search results for "${userInput}":\n\n1. First relevant result (example.com)\n2. Second source (example.org)\n3. Additional information (example.net)`,
      image: `Here's the generated image based on: "${userInput}"`
    };
    return responses[mode] || responses.chat;
  };

  const generatePersonalizedMerchantResponse = (query, profile) => {
    const lowercaseQuery = query.toLowerCase();
    
    const getMaturityBasedAdvice = () => {
      const challengeCount = profile.challenges.length;
      if (challengeCount <= 1) return "emerging";
      if (challengeCount <= 2) return "growing";
      return "established";
    };

    const getChannelStrategy = () => {
      switch(profile.merchantType) {
        case 'physical': return 'local SEO, community events, and foot traffic optimization';
        case 'online': return 'social media marketing, email campaigns, and marketplace optimization';
        case 'b2b': return 'LinkedIn marketing, industry networking, and referral programs';
        case 'ecommerce': return 'multi-channel selling, social commerce, and retargeting campaigns';
        default: return 'digital marketing and customer engagement';
      }
    };

    const getScalingStrategy = () => {
      switch(profile.businessSize) {
        case 'small': return 'focus on building core customer base and optimizing operations';
        case 'medium': return 'invest in automation and expand market reach';
        case 'large': return 'optimize supply chain and explore new market segments';
        default: return 'sustainable growth and market expansion';
      }
    };

    const getLocationStrategy = () => {
      const { location } = profile;
      if (!location.marketType) return 'location-based marketing';

      switch(location.marketType) {
        case 'urban':
          return `dense urban market penetration, focusing on convenience and quick service${
            profile.merchantType === 'physical' ? ', leveraging high foot traffic areas' : 
            ', targeting mobile-first urban consumers'
          }`;
        case 'suburban':
          return `community-centric approach, focusing on family-oriented marketing${
            profile.merchantType === 'physical' ? ' and local shopping center presence' : 
            ' and suburban lifestyle alignment'
          }`;
        case 'rural':
          return `wider geographic coverage strategy, emphasizing reliability and community trust${
            profile.merchantType === 'physical' ? ', being a destination business' : 
            'focusing on delivery reliability and rural customer service'
          }`;
        default: return 'balanced market approach across different location types';
      }
    };

    // Marketing Strategy
    if (lowercaseQuery.includes('marketing') || lowercaseQuery.includes('promote')) {
      return `Based on your profile as a ${profile.businessSize} ${profile.merchantType} business in a ${
        profile.location.marketType || 'mixed'
      } market selling ${profile.productType}, here's your tailored marketing strategy:

1. **Location-Based Strategy**: 
   - Market Type: ${profile.location.marketType || 'Not specified'}
   - Approach: ${getLocationStrategy()}
   - Regional Focus: ${profile.location.region ? `Optimize for ${profile.location.region} market preferences` : 'General market approach'}

2. **Channel Focus**: 
   - Primary: ${getChannelStrategy()}
   - Business Stage: ${getMaturityBasedAdvice() === 'emerging' ? 'Focus on building brand awareness' : 
                     getMaturityBasedAdvice() === 'growing' ? 'Expand market reach' : 
                     'Strengthen market position'}

3. **Local Targeting**:
   - Demographics: ${profile.location.marketType === 'urban' ? 'Urban professionals and young consumers' :
                   profile.location.marketType === 'suburban' ? 'Families and community groups' :
                   profile.location.marketType === 'rural' ? 'Rural communities and regional customers' :
                   'Diverse customer segments'}
   - Competition: ${profile.location.marketType === 'urban' ? 'High competition environment' :
                  profile.location.marketType === 'suburban' ? 'Moderate competition' :
                  profile.location.marketType === 'rural' ? 'Limited direct competition' :
                  'Varied competitive landscape'}

4. **Growth Tactics**:
   - ${getScalingStrategy()}
   - Local Expansion: ${profile.location.marketType === 'urban' ? 'Dense market penetration' :
                      profile.location.marketType === 'suburban' ? 'Community hub establishment' :
                      profile.location.marketType === 'rural' ? 'Regional authority building' :
                      'Market-appropriate expansion'}`;
    }
    
    // Pricing Strategy
    if (lowercaseQuery.includes('pricing') || lowercaseQuery.includes('price')) {
      return `For your ${profile.businessSize} business selling ${profile.productType} as a ${profile.merchantType}, here's my pricing guidance:

1. **Competitive Analysis**: Your pricing should reflect your position in the ${profile.merchantType} market - ${profile.challenges.includes('premium positioning') ? 'emphasize quality to justify premium pricing' : 'consider a value-based approach that highlights affordability without compromising quality'}.

2. **Pricing Structure**: ${profile.businessSize === 'small' ? 'Start with simple, transparent pricing' : 'Consider tiered pricing options to capture different customer segments'}.

3. **Seasonal Strategy**: In ${profile.merchantType}, consider ${profile.merchantType === 'physical' || profile.merchantType === 'online' ? 'seasonal discounting during industry-standard sale periods' : 'special bundle pricing during peak seasons'}.

4. **Psychological Pricing**: Test price points that resonate with your specific customer base (e.g., $19.99 vs. $20).

Would you like a more detailed pricing strategy for a specific product line?`;
    }
    
    // Inventory Management
    if (lowercaseQuery.includes('inventory') || lowercaseQuery.includes('stock') || lowercaseQuery.includes('supply chain')) {
      return `For your ${profile.productType} inventory management as a ${profile.merchantType}, here are tailored recommendations:

1. **Stocking Strategy**: As a ${profile.businessSize} business, focus on ${profile.businessSize === 'small' ? 'a curated selection of high-turnover items' : 'maintaining diverse inventory with automated reordering systems'}.

2. **Seasonal Planning**: In ${profile.merchantType}, prepare for ${profile.merchantType === 'physical' ? 'seasonal collection transitions with 3-month lead times' : profile.merchantType === 'online' ? 'holiday rushes and seasonal ingredient availability' : 'industry-specific peak periods'}.

3. **Supplier Relationships**: ${profile.challenges.includes('supply chain issues') ? 'Diversify your supplier network to reduce single-source risks' : 'Strengthen relationships with key suppliers for better terms'}.

4. **Technology Integration**: Implement ${profile.businessSize === 'small' ? 'affordable inventory tracking software' : 'comprehensive inventory management systems integrated with your sales channels'}.

Would you like specific supplier recommendations for your ${profile.productType} products?`;
    }
    
    // Customer Retention
    if (lowercaseQuery.includes('customer') || lowercaseQuery.includes('client') || lowercaseQuery.includes('retention')) {
      return `For your ${profile.merchantType} business, here are personalized customer retention strategies:

1. **Loyalty Program**: Create a ${profile.businessSize === 'small' ? 'simple points-based system' : 'tiered loyalty program with exclusive benefits'} specifically designed for ${profile.productType} repeat purchases.

2. **Follow-up Communication**: Implement ${profile.businessSize === 'small' ? 'personalized thank-you emails' : 'automated but personalized communication workflows'} with care instructions specific to your ${profile.productType}.

3. **Feedback Collection**: Gather product-specific feedback to improve your ${profile.productType} offerings and show customers you value their input.

4. **Special Occasions**: Celebrate customer milestones with exclusive offers tailored to their previous ${profile.productType} purchases.

Would you like me to help design a specific customer retention campaign?`;
    }
    
    // Default response with enhanced personalization
    return `For your ${profile.merchantType} business selling ${profile.productType}, here's my tailored guidance:

1. **Business Stage Recommendations**:
   - Current Stage: ${getMaturityBasedAdvice()}
   - Focus Areas: ${profile.challenges.join(', ')}
   - Next Steps: ${getScalingStrategy()}

2. **Channel Optimization**:
   - Primary Channels: ${getChannelStrategy()}
   - Market Position: ${profile.businessSize} business advantage
   - Growth Path: ${getMaturityBasedAdvice() === 'emerging' ? 'Build foundation' :
                  getMaturityBasedAdvice() === 'growing' ? 'Scale operations' :
                  'Optimize and expand'}

3. **Resource Allocation**:
   - Priority: ${profile.challenges[0] || 'General business growth'}
   - Support Areas: ${profile.challenges.slice(1).join(', ') || 'Overall optimization'}
   - Scale: ${profile.businessSize} business focus

Would you like specific details about any of these areas?`;
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

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
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
        className={`fixed w-64 bg-white border-r border-gray-200 flex flex-col h-screen z-40 transition-all duration-300 ${
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
      <div className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
        sidebarOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-3xl mx-auto w-full p-4">
            {messages.length === 0 ? (
              renderExamplePrompts()
            ) : (
              messages.map((msg) => (
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
                        <span className="text-sm font-medium text-white">
                          {merchantProfile.name ? merchantProfile.name.charAt(0) : "U"}
                        </span>
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
              <button
                onClick={() => setShowFilterPanel(true)}
                className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${
                  merchantProfile.merchantType 
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
                    {/* Business Profile Section */}
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-gray-800 mb-3">Business Profile</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Type
                          </label>
                          <select
                            value={merchantProfile.merchantType}
                            onChange={(e) => setMerchantProfile(prev => ({
                              ...prev,
                              merchantType: e.target.value
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Business Type</option>
                            <option value="restaurant">Restaurant/Food Service</option>
                            <option value="retail">Retail Store</option>
                            <option value="service">Service Business</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="grocery">Grocery/Convenience</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Main Product Categories
                          </label>
                          <input
                            type="text"
                            value={merchantProfile.productType}
                            onChange={(e) => setMerchantProfile(prev => ({
                              ...prev,
                              productType: e.target.value
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="e.g. fast food, electronics, beauty products"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Business Size
                          </label>
                          <select
                            value={merchantProfile.businessSize}
                            onChange={(e) => setMerchantProfile(prev => ({
                              ...prev,
                              businessSize: e.target.value
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Size</option>
                            <option value="micro">Micro (1 employee)</option>
                            <option value="small">Small (2-10 employees)</option>
                            <option value="medium">Medium (11-50 employees)</option>
                            <option value="large">Large (51+ employees)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Location & Market Section */}
                    <div className="border-b pb-4">
                      <h3 className="font-medium text-gray-800 mb-3">Location & Market</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Market Type
                          </label>
                          <select
                            value={merchantProfile.location.marketType}
                            onChange={(e) => setMerchantProfile(prev => ({
                              ...prev,
                              location: { ...prev.location, marketType: e.target.value }
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Market Type</option>
                            <option value="urban">Urban City Center</option>
                            <option value="suburban">Suburban Area</option>
                            <option value="rural">Rural Area</option>
                            <option value="tourist">Tourist Area</option>
                            <option value="transport">Transport Hub</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Country/Region
                          </label>
                          <select
                            value={merchantProfile.location.region}
                            onChange={(e) => setMerchantProfile(prev => ({
                              ...prev,
                              location: { ...prev.location, region: e.target.value }
                            }))}
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="">Select Country</option>
                            <option value="SG">Singapore</option>
                            <option value="MY">Malaysia</option>
                            <option value="ID">Indonesia</option>
                            <option value="TH">Thailand</option>
                            <option value="VN">Vietnam</option>
                            <option value="PH">Philippines</option>
                            <option value="KH">Cambodia</option>
                            <option value="MM">Myanmar</option>
                            <option value="LA">Laos</option>
                          </select>
                        </div>
                      </div>
                    </div>

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