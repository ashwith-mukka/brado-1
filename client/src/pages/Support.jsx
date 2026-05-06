import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const faqs = [
  { q: 'How do I track my order?', a: 'Once your order is confirmed, you can track it in real-time from the "My Orders" section. You will also receive SMS and email notifications at each delivery stage.' },
  { q: 'What if I receive a damaged or wrong item?', a: 'Report the issue within 24 hours (2 hours for perishables) through the app or by contacting support. We will arrange a replacement or full refund after verification.' },
  { q: 'How do I cancel an order?', a: 'You can cancel an order before it is dispatched from the "My Orders" section. Once dispatched, cancellation may not be possible but you can refuse delivery.' },
  { q: 'What payment methods are accepted?', a: 'We accept UPI, credit/debit cards, net banking, and popular wallets. Cash on delivery is available for select areas and order values.' },
  { q: 'How do I change my delivery address?', a: 'You can update your delivery address from your profile settings. For an active order, contact support immediately to request an address change before dispatch.' },
  { q: 'Is there a minimum order value?', a: 'Yes, the minimum order value may vary by location. Any applicable minimum will be clearly displayed at checkout.' },
  { q: 'How do refunds work?', a: 'Approved refunds are processed within 3–5 business days and credited to the original payment method or your Brado wallet, depending on the refund type.' },
];

const contactCards = [
  { icon: '💬', title: 'Live Chat', desc: 'Chat with our AI assistant for instant help.', detail: 'Click to start chatting →', color: 'from-green-400 to-emerald-600', shadow: 'shadow-green-200', action: 'chat' },
  { icon: '📧', title: 'Email Us', desc: 'Send us a detailed query anytime.', detail: 'support@brado.com', color: 'from-blue-400 to-indigo-600', shadow: 'shadow-blue-200', action: 'email' },
  { icon: '📞', title: 'Call Us', desc: 'Speak directly with our support team.', detail: '+91 1800-XXX-XXXX', color: 'from-purple-400 to-violet-600', shadow: 'shadow-purple-200', action: 'call' },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const handleCardClick = (action) => {
    if (action === 'chat') {
      // Find and click the live chat button to open it
      const chatBtn = document.querySelector('.live-chat-btn');
      if (chatBtn) {
        chatBtn.click();
      }
    } else if (action === 'email') {
      window.location.href = 'mailto:support@brado.com';
    } else if (action === 'call') {
      window.location.href = 'tel:+911800XXXXXXX';
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-14">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-600 shadow-lg shadow-purple-200 mb-4">
          <span className="text-3xl">🎧</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Help & Support</h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          We're here to help! Browse our FAQs or reach out to our support team through any of the channels below.
        </p>
      </motion.div>

      {/* Contact Cards */}
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {contactCards.map((card, index) => (
          <motion.div
            key={card.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            onClick={() => handleCardClick(card.action)}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 p-6 text-center group hover:-translate-y-1 cursor-pointer"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} ${card.shadow} shadow-lg mb-3 group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-xl">{card.icon}</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-1">{card.title}</h3>
            <p className="text-gray-500 text-xs mb-2">{card.desc}</p>
            <p className={`text-sm font-semibold ${card.action === 'chat' ? 'text-green-600' : 'text-gray-700'}`}>{card.detail}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl font-extrabold text-gray-900 mb-6 text-center"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              custom={index + 3}
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-800 text-sm md:text-base pr-4">{faq.q}</span>
                <motion.span
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-400 flex-shrink-0 text-lg"
                >
                  ▾
                </motion.span>
              </button>
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-4 border-t border-gray-50 pt-3">
                      <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Note */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-center mt-12 mb-8">
        <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <span className="text-lg">💡</span>
          <p className="text-gray-500 text-xs md:text-sm">
            Our average response time is <span className="font-bold text-gray-700">under 5 minutes</span> during business hours.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Support;
