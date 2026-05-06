import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

const Privacy = () => {
  const sections = [
    {
      icon: '🔒',
      title: 'Information We Collect',
      content: [
        'Personal details such as your name, email address, phone number, and delivery address when you create an account or place an order.',
        'Payment information including card details processed securely through our PCI-compliant payment partners. We never store your full card number on our servers.',
        'Usage data such as browsing history, search queries, and product interactions to improve your shopping experience.',
        'Device information including IP address, browser type, operating system, and device identifiers for security and analytics purposes.',
      ],
    },
    {
      icon: '🛡️',
      title: 'How We Use Your Information',
      content: [
        'To process and deliver your orders accurately and on time.',
        'To communicate order updates, delivery status, and important account notifications.',
        'To personalize your shopping experience with relevant product recommendations.',
        'To improve our platform, services, and customer support through analytics.',
        'To prevent fraud, detect security threats, and ensure the safety of all users.',
      ],
    },
    {
      icon: '🤝',
      title: 'Information Sharing',
      content: [
        'We share your delivery details with our logistics partners solely for order fulfillment.',
        'Payment data is processed by certified third-party payment gateways (e.g., Razorpay, Stripe).',
        'We may share anonymized, aggregated data with analytics partners to improve services.',
        'We will never sell your personal data to third parties for marketing purposes.',
        'We may disclose information if required by law or to protect the rights and safety of our users.',
      ],
    },
    {
      icon: '🍪',
      title: 'Cookies & Tracking',
      content: [
        'We use essential cookies to keep you logged in and remember your cart items.',
        'Analytics cookies help us understand how users interact with our platform.',
        'You can manage cookie preferences through your browser settings at any time.',
        'Third-party services like Google Analytics may set their own cookies subject to their privacy policies.',
      ],
    },
    {
      icon: '🔐',
      title: 'Data Security',
      content: [
        'All data transmissions are encrypted using industry-standard TLS/SSL protocols.',
        'We implement robust access controls, ensuring only authorized personnel can access sensitive data.',
        'Regular security audits and vulnerability assessments are conducted to maintain data integrity.',
        'In the unlikely event of a data breach, affected users will be notified within 72 hours as required by law.',
      ],
    },
    {
      icon: '⚙️',
      title: 'Your Rights & Choices',
      content: [
        'You can access, update, or delete your personal information from your account settings at any time.',
        'You may request a complete copy of your personal data by contacting our support team.',
        'You can opt out of promotional emails using the unsubscribe link in any marketing email.',
        'You have the right to restrict or object to certain data processing activities.',
        'To exercise any of these rights, contact us at privacy@brado.com.',
      ],
    },
  ];

  return (
    <div className="min-h-screen px-4 py-8 md:py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 md:mb-14"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200 mb-4">
          <span className="text-3xl">🔒</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Privacy Policy
        </h1>
        <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Your privacy matters to us. This policy explains how Brado collects, uses,
          and protects your personal information when you use our quick-commerce platform.
        </p>
        <p className="text-gray-400 text-xs mt-3">Last updated: May 2026</p>
      </motion.div>

      {/* Sections */}
      <div className="max-w-3xl mx-auto space-y-6">
        {sections.map((section, index) => (
          <motion.div
            key={section.title}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
              <span className="text-2xl">{section.icon}</span>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">
                {section.title}
              </h2>
            </div>
            <ul className="px-6 py-5 space-y-3">
              {section.content.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-center mt-12 mb-8"
      >
        <p className="text-gray-500 text-sm mb-4">
          Have questions about your privacy? We're here to help.
        </p>
        <Link
          to="/support"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-105 transition-all duration-300 text-sm"
        >
          Contact Support →
        </Link>
      </motion.div>
    </div>
  );
};

export default Privacy;
