import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';

export default function Refund() {
  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Refund & Cancellation Policy"
        description="Learn about RetroFrame's refund and cancellation policy for polaroid print orders. Understand our return process and eligibility criteria."
        url="/refund"
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
            Refund & Cancellation Policy
          </h1>
          <p className="text-brand-secondary mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                1. Order Cancellation
              </h2>
              <p className="text-brand-secondary">
                <strong>Before Processing:</strong> You can cancel your order free of charge within 2 hours of placing it, before we start processing your prints.
              </p>
              <p className="text-brand-secondary mt-4">
                <strong>After Processing:</strong> Once your order has entered the printing phase, cancellation is not possible as your prints are being custom-made.
              </p>
              <p className="text-brand-secondary mt-4">
                To cancel an order, please contact us immediately at support@retroframe.com with your order number.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                2. Return Policy
              </h2>
              <p className="text-brand-secondary">
                We accept returns under the following conditions:
              </p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li><strong>Damaged Products:</strong> Items damaged during shipping</li>
                <li><strong>Printing Errors:</strong> Incorrect colors, cuts, or quality issues on our part</li>
                <li><strong>Wrong Items:</strong> If you received the wrong prints</li>
              </ul>
              <p className="text-brand-secondary mt-4">
                <strong>Note:</strong> We cannot accept returns for customer errors, such as uploading incorrect photos or choosing wrong customizations.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                3. Return Process
              </h2>
              <p className="text-brand-secondary">To initiate a return:</p>
              <ol className="list-decimal pl-6 text-brand-secondary space-y-2">
                <li>Contact us within 7 days of receiving your order</li>
                <li>Provide your order number and photos of the issue</li>
                <li>Wait for our team to review and approve your return request</li>
                <li>Ship the items back to us (we'll provide instructions)</li>
              </ol>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                4. Refund Process
              </h2>
              <p className="text-brand-secondary">
                Once we receive and inspect your returned items:
              </p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Approved refunds are processed within 5-7 business days</li>
                <li>Refunds are issued to the original payment method</li>
                <li>Shipping costs are non-refundable unless the error was on our part</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                5. Replacement Policy
              </h2>
              <p className="text-brand-secondary">
                For damaged or defective items, we offer free replacements. We'll re-print and ship your order at no additional cost once the issue is confirmed.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                6. Non-Refundable Items
              </h2>
              <p className="text-brand-secondary">The following are not eligible for refund:</p>
              <ul className="list-disc pl-6 text-brand-secondary space-y-2">
                <li>Customized prints with customer-selected photos (unless damaged/defective)</li>
                <li>Orders cancelled after printing has started</li>
                <li>Items damaged due to improper handling by the customer</li>
              </ul>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                7. Shipping Costs
              </h2>
              <p className="text-brand-secondary">
                <strong>Returns due to our error:</strong> We cover all return shipping costs<br />
                <strong>Returns due to customer preference:</strong> Customer bears the return shipping cost
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                8. Quality Guarantee
              </h2>
              <p className="text-brand-secondary">
                We stand behind the quality of our prints. If you're not satisfied with the print quality due to our production process, we'll work with you to make it right - either through a replacement or refund.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-normal text-brand-dark mt-8 mb-4"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                9. Contact for Returns
              </h2>
              <p className="text-brand-secondary">
                For all cancellation, return, and refund inquiries:
              </p>
              <p className="text-brand-secondary mt-2">
                Email: support@retroframe.com<br />
                Phone: +91 98765 43210<br />
                Response Time: Within 24 hours
              </p>
            </section>

            <section className="bg-brand-warm/50 p-6 rounded-xl mt-8">
              <h2
                className="text-xl font-normal text-brand-dark mb-3"
                style={{ fontFamily: 'var(--font-serif)' }}
              >
                Pro Tip
              </h2>
              <p className="text-brand-secondary">
                Before placing your order, double-check your photos, customizations, and delivery address. This helps avoid unnecessary returns and ensures you get exactly what you want!
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
