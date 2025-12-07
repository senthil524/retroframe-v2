import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import Logo from '@/components/ui/Logo';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Privacy Policy"
        description="RetroFrame's privacy policy explains how we collect, use, and protect your personal information when you use our polaroid printing service."
        url="/privacy"
      />

      {/* Site Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo />
            <Link to={createPageUrl('Studio')}>
              <Button
                size="sm"
                className="text-xs md:text-sm text-white rounded-full px-4 md:px-6"
                style={{ backgroundColor: 'var(--color-coral)' }}>
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Create Prints
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h1
            className="text-4xl font-normal text-brand-dark mb-6"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-brand-secondary mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                1. Information We Collect
              </h2>
              <p className="text-brand-secondary">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and delivery address</li>
                <li><strong>Photos:</strong> Images you upload for printing</li>
                <li><strong>Order Information:</strong> Details of your purchases and preferences</li>
                <li><strong>Technical Information:</strong> Browser type, device information, and usage data</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                2. How We Use Your Information
              </h2>
              <p className="text-brand-secondary">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your orders and our services</li>
                <li>Improve our website and services</li>
                <li>Send you promotional communications (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                3. Photo Privacy
              </h2>
              <p className="text-brand-secondary">
                Your photos are private and secure. We use your images solely for the purpose of printing and delivering your order. We do not share, sell, or use your photos for any other purpose without your explicit consent.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                4. Data Storage & Security
              </h2>
              <p className="text-brand-secondary">
                We implement appropriate security measures to protect your personal information. Your photos are securely stored in encrypted cloud storage and are automatically deleted after your order is fulfilled.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                5. Information Sharing
              </h2>
              <p className="text-brand-secondary">We may share your information with:</p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li><strong>Service Providers:</strong> Third-party companies that help us process orders and deliver products</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              </ul>
              <p className="text-brand-secondary mt-4">
                We never sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                6. Your Rights
              </h2>
              <p className="text-brand-secondary">You have the right to:</p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                7. Cookies
              </h2>
              <p className="text-brand-secondary">
                We use cookies and similar technologies to enhance your experience, analyze usage, and remember your preferences. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                8. Children's Privacy
              </h2>
              <p className="text-brand-secondary">
                Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                9. Changes to This Policy
              </h2>
              <p className="text-brand-secondary">
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                10. Contact Us
              </h2>
              <p className="text-brand-secondary">
                If you have questions about this privacy policy, please contact us at:
              </p>
              <p className="text-brand-secondary mt-2">
                Email: support@retroframe.com<br />
                Phone: +91 98765 43210
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
