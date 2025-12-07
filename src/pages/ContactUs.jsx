import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '@/components/seo/SEO';
import Logo from '@/components/ui/Logo';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-brand-warm">
      <SEO
        title="Contact Us"
        description="Get in touch with RetroFrame. Have questions about your polaroid prints order? We're here to help. Contact us via email or phone."
        url="/contact"
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
          className="bg-white rounded-2xl shadow-lg p-6 md:p-10"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-brand-dark mb-2" style={{ fontFamily: 'var(--font-serif)' }}>Get in Touch</h1>
          <p className="text-brand-secondary mb-6 md:mb-8">
            Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-coral" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark text-sm mb-0.5">Email</h3>
                  <p className="text-brand-secondary text-sm">support@retroframe.in</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-brand-coral" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark text-sm mb-0.5">Phone</h3>
                  <p className="text-brand-secondary text-sm">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-brand-warm-light rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-brand-coral" />
                </div>
                <div>
                  <h3 className="font-semibold text-brand-dark text-sm mb-0.5">Address</h3>
                  <p className="text-brand-secondary text-sm">Chennai, Tamil Nadu, India</p>
                </div>
              </div>
              
              <div className="bg-brand-warm-light rounded-xl p-4 mt-4">
                <p className="text-xs text-brand-secondary">
                  <span className="font-semibold text-brand-dark">Response Time:</span> We typically respond within 24 hours on business days.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you?"
                  required
                  className="mt-1 h-32"
                />
              </div>

              <Button
                type="submit"
                className="w-full rounded-full py-6 text-white font-semibold"
                style={{ backgroundColor: 'var(--color-coral)' }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}