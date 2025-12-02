import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: 'What size are the retro polaroid prints?',
    answer: 'Our classic retro prints are 3.4" x 4" card size with a 3" x 3" photo area. This vintage format is perfect for photo walls, scrapbooks, and gifting.'
  },
  {
    question: 'What is the minimum order quantity?',
    answer: 'The minimum order is 18 prints for ₹270 (discounted from ₹399). Additional prints are just ₹15 each. This helps us maintain quality while offering great value.'
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 3-6 business days across India. All orders include FREE shipping! We carefully package each order to ensure your prints arrive in perfect condition.'
  },
  {
    question: 'What paper quality do you use?',
    answer: 'We use premium 300 GSM matte cardstock that closely resembles authentic Polaroid prints. The thick, durable paper gives your photos a genuine retro feel and ensures they last for years.'
  },
  {
    question: 'Can I add captions to my prints?',
    answer: 'Yes! You can add custom text captions below each photo, just like writing on real Polaroids. The caption appears in a beautiful handwritten-style font for that authentic vintage look.'
  },
  {
    question: 'What photo effects are available?',
    answer: 'We offer 5 photo effects: Original (no filter), Vintage (warm sepia tones), Noir (classic black & white), Vivid (enhanced colors), and Dramatic (high contrast). Preview each effect before ordering.'
  },
  {
    question: 'What border colors can I choose?',
    answer: 'Choose from 8 beautiful border colors: Classic White, Bold Black, Warm Cream, Soft Pink, Sky Blue, Fresh Mint, Lavender, and Peach. Mix and match different colors in the same order!'
  },
  {
    question: 'Is my photo data secure?',
    answer: 'Absolutely. Your photos are securely uploaded and stored only for the duration of processing. We never share your photos with third parties and delete them after your order is fulfilled.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 px-4 bg-brand-warm">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-brand-coral" />
            <span className="text-sm md:text-base font-semibold text-brand-coral uppercase tracking-wide">
              FAQ
            </span>
          </div>
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-normal text-brand-dark mb-3"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Frequently Asked Questions
          </h2>
          <p className="text-sm md:text-base text-brand-secondary">
            Everything you need to know about our retro print service
          </p>
        </motion.div>

        {/* FAQ List */}
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 md:px-6 py-4 md:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-brand-dark text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-brand-coral flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 md:px-6 pb-4 md:pb-5">
                      <p className="text-sm md:text-base text-brand-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}