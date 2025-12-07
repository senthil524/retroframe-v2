import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';

export default function Terms() {
  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Terms & Conditions"
        description="Read RetroFrame's terms and conditions for using our polaroid printing service. Learn about our policies, user responsibilities, and service terms."
        url="/terms"
      />

      {/* Site Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-dark)' }}>
              RetroFrame
            </Link>
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
            Terms & Conditions
          </h1>
          <p className="text-brand-secondary mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                1. Acceptance of Terms
              </h2>
              <p className="text-brand-secondary">
                By accessing and using Retroframe's services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                2. Service Description
              </h2>
              <p className="text-brand-secondary">
                Retroframe provides a platform for creating and ordering custom retro-style photo prints. We offer:
              </p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Online photo editing and customization tools</li>
                <li>High-quality printing services</li>
                <li>Delivery services across India</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                3. Pricing & Payment
              </h2>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Each retro print costs ₹10</li>
                <li>Minimum order of 10 prints required</li>
                <li>Free shipping on orders above ₹250</li>
                <li>Shipping cost of ₹80 applies to orders below ₹250</li>
                <li>All prices are in Indian Rupees (INR)</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                4. User Content
              </h2>
              <p className="text-brand-secondary">
                You retain all rights to the photos you upload. By using our service, you grant Retroframe a license to process and print your photos solely for fulfilling your order.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                5. Prohibited Uses
              </h2>
              <p className="text-brand-secondary">You may not use our service to:</p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Upload copyrighted material without authorization</li>
                <li>Print offensive, illegal, or inappropriate content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                6. Delivery
              </h2>
              <p className="text-brand-secondary">
                Orders are typically delivered within 5-7 business days. Delivery times may vary based on location and other factors beyond our control.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                7. Limitation of Liability
              </h2>
              <p className="text-brand-secondary">
                Retroframe shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with our services.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                8. Changes to Terms
              </h2>
              <p className="text-brand-secondary">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                9. Contact
              </h2>
              <p className="text-brand-secondary">
                For questions about these terms, please contact us at support@retroframe.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
