import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

const sections = [
  {
    icon: '📋', title: '1. Acceptance of Terms',
    content: [
      'By accessing Brado, you agree to these Terms of Service and all applicable laws.',
      'We may update these terms at any time. Continued use constitutes acceptance.',
      'Users must be at least 18 years old or have parental consent.',
    ],
  },
  {
    icon: '👤', title: '2. User Accounts',
    content: [
      'You are responsible for maintaining account confidentiality and all activities under your account.',
      'Provide accurate information during registration and keep it updated.',
      'One account per person. Multiple accounts may be suspended.',
      'We may terminate accounts that violate these terms or engage in fraud.',
    ],
  },
  {
    icon: '🛒', title: '3. Orders & Payments',
    content: [
      'Prices are in Indian Rupees (₹) and include applicable taxes unless stated otherwise.',
      'Prices and availability may change without notice.',
      'Orders are confirmed only after successful payment and confirmation notification.',
      'We may cancel orders due to pricing errors, stock issues, or suspected fraud.',
      'Refunds for cancellations are processed within 5–7 business days.',
    ],
  },
  {
    icon: '🚚', title: '4. Delivery Policy',
    content: [
      'Brado aims to deliver within 10–30 minutes, but times may vary.',
      'Provide an accurate delivery address. We are not liable for incorrect addresses.',
      'Delivery fees may apply based on order value, distance, and demand.',
    ],
  },
  {
    icon: '↩️', title: '5. Returns & Refunds',
    content: [
      'Report damaged, expired, or incorrect items within 24 hours of delivery.',
      'Perishable items must be reported within 2 hours for quality complaints.',
      'Refunds are credited within 3–5 business days after verification.',
    ],
  },
  {
    icon: '🚫', title: '6. Prohibited Activities',
    content: [
      'Using the platform for unlawful or fraudulent purposes.',
      'Attempting unauthorized access to accounts or systems.',
      'Using bots or scrapers to access the platform or collect data.',
      'Harassing delivery partners, support staff, or other users.',
    ],
  },
  {
    icon: '📜', title: '7. Intellectual Property',
    content: [
      'All content on Brado is our property or our licensors\' property.',
      'You may not copy, reproduce, or distribute content without consent.',
      'The Brado name and logo are registered trademarks.',
    ],
  },
  {
    icon: '⚖️', title: '8. Limitation of Liability',
    content: [
      'Brado is provided "as-is" without warranties of any kind.',
      'We are not liable for indirect or consequential damages.',
      'Disputes are subject to the jurisdiction of courts in Hyderabad, India.',
    ],
  },
];

const Terms = () => (
  <div className="min-h-screen px-4 py-8 md:py-12">
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10 md:mb-14">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-200 mb-4">
        <span className="text-3xl">📜</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Terms of Service</h1>
      <p className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
        Please read these terms carefully before using the Brado platform. By using our services, you agree to be bound by the following terms.
      </p>
      <p className="text-gray-400 text-xs mt-3">Effective date: May 2026</p>
    </motion.div>

    <div className="max-w-3xl mx-auto space-y-6">
      {sections.map((section, index) => (
        <motion.div key={section.title} custom={index} initial="hidden" animate="visible" variants={fadeIn} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center gap-3">
            <span className="text-2xl">{section.icon}</span>
            <h2 className="text-lg md:text-xl font-bold text-gray-800">{section.title}</h2>
          </div>
          <ul className="px-6 py-5 space-y-3">
            {section.content.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>

    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="text-center mt-12 mb-8">
      <p className="text-gray-500 text-sm mb-4">Questions about our terms? Reach out to our team.</p>
      <Link to="/support" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 hover:scale-105 transition-all duration-300 text-sm">
        Contact Support →
      </Link>
    </motion.div>
  </div>
);

export default Terms;
