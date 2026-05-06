import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';

// AI response engine — pattern-matched knowledge base for Brado support
const getAIResponse = (message) => {
  const msg = message.toLowerCase().trim();

  // Greetings
  if (/^(hi|hello|hey|good morning|good evening|good afternoon|hola|yo)/.test(msg)) {
    return "Hello! 👋 Welcome to Brado Support. I'm your AI assistant. How can I help you today? You can ask me about orders, delivery, payments, returns, or anything else!";
  }

  // Order tracking
  if (/track|where.*(order|package)|order status|my order|order update/.test(msg)) {
    return "📦 You can track your order in real-time from the **My Orders** section in your account. You'll also receive SMS and email notifications at each delivery stage. If you have a specific order ID, I can help you look into it!";
  }

  // Delivery
  if (/deliver|shipping|how long|when.*(arrive|come|get)|dispatch|estimated time/.test(msg)) {
    return "🚚 Brado delivers within **10–30 minutes** depending on your location and demand. Delivery times are estimates and may vary slightly. A delivery fee may apply based on order value and distance — this is always shown at checkout.";
  }

  // Cancel order
  if (/cancel|cancel order|stop order|don't want/.test(msg)) {
    return "❌ You can cancel an order **before it's dispatched** from the My Orders section. Once dispatched, cancellation isn't possible, but you can refuse the delivery. The refund will be processed within 3–5 business days.";
  }

  // Refund
  if (/refund|money back|get.*(money|payment) back|when.*refund/.test(msg)) {
    return "💰 Approved refunds are processed within **3–5 business days** and credited to your original payment method or Brado wallet. If it's been longer, please share your order ID and I'll escalate this for you.";
  }

  // Return / damaged / wrong item
  if (/return|damaged|broken|wrong item|incorrect|expired|bad quality|spoiled/.test(msg)) {
    return "↩️ If you received a damaged, expired, or wrong item, you can report it within **24 hours** of delivery (2 hours for perishables). Go to My Orders → select the order → Report Issue. We'll arrange a replacement or full refund after quick verification.";
  }

  // Payment methods
  if (/payment|pay|upi|card|credit|debit|net banking|wallet|cash on delivery|cod/.test(msg)) {
    return "💳 We accept **UPI, credit/debit cards, net banking**, and popular wallets. **Cash on Delivery (COD)** is available in select areas for eligible order values. All payments are processed securely through PCI-compliant gateways.";
  }

  // Minimum order
  if (/minimum order|min order|minimum.*value|least.*order/.test(msg)) {
    return "🛒 Yes, there is a minimum order value that may vary by your location. The applicable minimum will be clearly displayed at checkout. This helps us ensure efficient delivery service.";
  }

  // Account / profile
  if (/account|profile|change.*(name|email|phone|password)|update.*details|edit.*profile/.test(msg)) {
    return "👤 You can update your profile details from **Account Settings**. This includes your name, email, phone number, and delivery address. For security, password changes require email verification.";
  }

  // Address
  if (/address|change.*address|delivery.*location|update.*address|add.*address/.test(msg)) {
    return "📍 You can manage your delivery addresses from your **Profile Settings**. For an active order, contact us immediately to request an address change before dispatch — but this is only possible before the order is picked up.";
  }

  // Offers / discount / coupon / promo
  if (/offer|discount|coupon|promo|deal|sale|code|voucher/.test(msg)) {
    return "🎉 Check out our **Deals** section on the homepage for the latest offers! Promo codes can be applied at checkout. Keep an eye on your email and app notifications for exclusive discounts. Note: promotional codes cannot be combined unless stated otherwise.";
  }

  // Contact / human / speak to agent
  if (/human|real person|agent|speak.*someone|talk.*person|escalate|manager|supervisor/.test(msg)) {
    return "🧑‍💼 I understand you'd like to speak with a human agent. You can reach our team through:\n\n📧 **Email:** support@brado.com\n📞 **Phone:** +91 1800-XXX-XXXX\n\nOur support team is available 24/7 and typically responds within 5 minutes during business hours.";
  }

  // Privacy
  if (/privacy|data|personal information|my data/.test(msg)) {
    return "🔐 Your privacy is our priority. We collect only essential data needed to process orders and improve your experience. You can view our full Privacy Policy from the footer. To request data deletion or export, email us at privacy@brado.com.";
  }

  // App / technical issue / bug
  if (/bug|error|crash|not working|issue|problem|glitch|slow|loading|stuck/.test(msg)) {
    return "🔧 Sorry to hear you're experiencing issues! Here are some quick fixes:\n\n1. **Clear your browser cache** and reload\n2. **Check your internet connection**\n3. **Try logging out and back in**\n\nIf the problem persists, please describe the issue in detail and I'll escalate it to our technical team.";
  }

  // Thank you
  if (/thank|thanks|thx|appreciate|helpful|great help/.test(msg)) {
    return "😊 You're welcome! I'm glad I could help. Is there anything else you'd like to know? I'm here for you!";
  }

  // Bye
  if (/bye|goodbye|see you|take care|that's all|nothing else/.test(msg)) {
    return "👋 Goodbye! Thank you for choosing Brado. Have a wonderful day! Feel free to chat anytime you need help. 💚";
  }

  // What can you do
  if (/what can you|help me|what.*do|how.*help|capabilities/.test(msg)) {
    return "🤖 I can help you with:\n\n• 📦 **Order tracking** & status updates\n• 🚚 **Delivery** information\n• 💳 **Payment** queries\n• ↩️ **Returns & refunds**\n• 🎉 **Offers & promotions**\n• 👤 **Account** management\n• 🔧 **Technical** issues\n\nJust ask me anything!";
  }

  // Product / recommendation
  if (/product|recommend|suggest|best|popular|trending|new arrival/.test(msg)) {
    return "🛍️ Check out our **Products** page for the latest and most popular items! You can browse by category, search for specific products, or filter by price. We update our catalog regularly with fresh arrivals and trending items.";
  }

  // Default fallback
  const fallbacks = [
    "🤔 I'm not sure I understand that completely. Could you rephrase your question? I can help with orders, delivery, payments, returns, and more!",
    "💡 I'd love to help! Could you give me a bit more detail? I'm great with questions about orders, delivery, payments, refunds, and account management.",
    "🙏 I didn't quite catch that. Try asking about order tracking, delivery times, payment methods, or returns — I'm here to help!",
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
};

const LiveChat = () => {
  const { user } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! 👋 I'm Brado's AI assistant. How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Don't render if not logged in
  if (!user) return null;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay (800–1500ms)
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot',
        text: getAIResponse(trimmed),
        time: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, delay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="live-chat-btn"
            aria-label="Open live chat"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="live-chat-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="live-chat-window"
          >
            {/* Header */}
            <div className="live-chat-header">
              <div className="live-chat-header-info">
                <div className="live-chat-avatar">
                  <span>🤖</span>
                  <span className="live-chat-online-dot" />
                </div>
                <div>
                  <h3 className="live-chat-title">Brado AI Assistant</h3>
                  <p className="live-chat-status">Online • Typically replies instantly</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="live-chat-close"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>

            {/* Messages */}
            <div className="live-chat-messages">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`live-chat-msg ${msg.sender === 'user' ? 'live-chat-msg-user' : 'live-chat-msg-bot'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="live-chat-msg-avatar">🤖</div>
                  )}
                  <div className={`live-chat-bubble ${msg.sender === 'user' ? 'live-chat-bubble-user' : 'live-chat-bubble-bot'}`}>
                    <p className="live-chat-text" dangerouslySetInnerHTML={{
                      __html: msg.text
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\n/g, '<br/>')
                    }} />
                    <span className="live-chat-time">{formatTime(msg.time)}</span>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="live-chat-msg live-chat-msg-bot"
                >
                  <div className="live-chat-msg-avatar">🤖</div>
                  <div className="live-chat-bubble live-chat-bubble-bot">
                    <div className="live-chat-typing">
                      <span className="live-chat-typing-dot" />
                      <span className="live-chat-typing-dot" />
                      <span className="live-chat-typing-dot" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="live-chat-input-area">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="live-chat-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="live-chat-send"
                aria-label="Send message"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChat;
