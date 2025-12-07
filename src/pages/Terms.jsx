import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F5] to-white">
      <SEO
        title="Terms & Conditions"
        description="Read RetroFrame's terms and conditions for using our polaroid printing service. Learn about our policies, user responsibilities, and service terms."
        url="/terms"
      />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to={createPageUrl('Home')}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 md:p-12"
        >
          <h1 className="text-4xl font-bold text-[#2B2B2B] mb-6">Terms & Conditions</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}</p>

          <div className="prose prose-slate max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using Retroframe's services, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">2. Service Description</h2>
              <p className="text-gray-600">
                Retroframe provides a platform for creating and ordering custom retro-style photo prints. We offer:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Online photo editing and customization tools</li>
                <li>High-quality printing services</li>
                <li>Delivery services across India</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">3. Pricing & Payment</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Each retro print costs ₹10</li>
                <li>Minimum order of 10 prints required</li>
                <li>Free shipping on orders above ₹250</li>
                <li>Shipping cost of ₹80 applies to orders below ₹250</li>
                <li>All prices are in Indian Rupees (INR)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">4. User Content</h2>
              <p className="text-gray-600">
                You retain all rights to the photos you upload. By using our service, you grant Retroframe a license to process and print your photos solely for fulfilling your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">5. Prohibited Uses</h2>
              <p className="text-gray-600">You may not use our service to:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Upload copyrighted material without authorization</li>
                <li>Print offensive, illegal, or inappropriate content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">6. Delivery</h2>
              <p className="text-gray-600">
                Orders are typically delivered within 5-7 business days. Delivery times may vary based on location and other factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600">
                Retroframe shall not be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">8. Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2B2B2B] mt-8 mb-4">9. Contact</h2>
              <p className="text-gray-600">
                For questions about these terms, please contact us at support@retroframe.com
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}