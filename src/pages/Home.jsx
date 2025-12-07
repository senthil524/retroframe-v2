import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Truck,
  Shield,
  Star,
  Package,
  Palette,
  PenTool,
  Check,
  Image,
  Sliders } from
'lucide-react';

import HeroPhotoStack from '@/components/home/HeroPhotoStack';
import CustomerReviews from '@/components/home/CustomerReviews';
import UserPhotosGallery from '@/components/home/UserPhotosGallery';
import FAQSection from '@/components/home/FAQSection';
import LatestBlogPosts from '@/components/home/LatestBlogPosts';
import SEO, { structuredData } from '@/components/seo/SEO';
import Logo from '@/components/ui/Logo';

// Combined structured data for homepage
const homeStructuredData = [
  structuredData.organization,
  structuredData.product,
  structuredData.website,
  structuredData.localBusiness,
  structuredData.faq
];

export default function Home() {

  return (
    <div className="min-h-screen bg-brand-warm" itemScope itemType="https://schema.org/Product">
      <SEO
        title="Premium Polaroid Prints Online India"
        description="Order custom polaroid prints online in India. Premium retro photo printing service with vintage effects, 8 border colors & custom captions. 18 prints starting at Rs.270. Free shipping across India."
        keywords="polaroid prints online, retro prints india, photo printing service, vintage photo prints, custom polaroid, instant photo prints, polaroid style prints, retro photo printing, memory prints india, photo wall prints"
        url="/"
        structuredData={homeStructuredData}
      />
      {/* Header */}
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

      {/* Hero Section */}
      <section className="py-8 md:py-12 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 md:space-y-8 order-2 lg:order-1">

              {/* Rating Badge */}
              <div className="inline-flex items-center gap-2 bg-white border border-brand-border px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-brand-dark shadow-sm">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <span className="font-semibold">4.9</span>
                <span className="text-brand-secondary">from 20+ reviews</span>
              </div>

              {/* Title - SEO optimized with schema */}
              <div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal mb-4 md:mb-6 leading-tight text-brand-dark"

                style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-0.02em' }}
                itemProp="name">Polaroid Prints Online Delivered to Your Door



                </h1>
                <p className="text-base md:text-xl lg:text-2xl text-brand-secondary leading-relaxed" itemProp="description">
                  Transform your digital photos into beautiful retro polaroid prints. Premium quality vintage photo printing service in India. Order custom retro prints online with fast delivery.
                </p>
              </div>

              {/* Pricing with schema */}
              <div className="flex items-center gap-3 md:gap-4 flex-wrap" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                <meta itemProp="priceCurrency" content="INR" />
                <meta itemProp="price" content="270" />
                <meta itemProp="availability" content="https://schema.org/InStock" />
                <div className="flex items-baseline gap-2">
                  <span className="text-xl md:text-2xl text-gray-400 line-through">₹399</span>
                  <span className="text-4xl md:text-5xl font-bold text-brand-dark" itemProp="price">₹270</span>
                  <span className="text-lg md:text-xl text-brand-secondary">for 18 prints</span>
                </div>
                <div className="hidden md:block w-px h-8 bg-brand-border" />
                <div className="text-sm md:text-base text-brand-secondary space-y-0.5">
                  <p className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-500" />
                    18 prints minimum
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-500" />
                    ₹15 per additional print
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-green-500" />
                    Free shipping • 3-6 days
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-3 md:space-y-4">
                <Link to={createPageUrl('Studio')}>
                  <Button
                    size="lg"
                    className="rounded-full text-base md:text-lg lg:text-xl px-6 md:px-10 py-5 md:py-8 shadow-2xl w-full md:w-auto text-white font-semibold"
                    style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}>

                    <Image className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                    Create Your Prints
                    <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3" />
                  </Button>
                </Link>
                <p className="text-brand-secondary text-xs md:text-sm text-center md:text-left">
                  Upload photos, customize & get delivered in 3-6 days
                </p>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3 md:gap-5 pt-2 md:pt-4 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 md:gap-2 text-brand-secondary">
                  <Star className="w-4 h-4 md:w-5 md:h-5 text-brand-coral" />
                  <span className="font-medium text-xs md:text-sm">Premium Quality</span>
                </div>
              {/*  <div className="flex items-center gap-1.5 md:gap-2 text-brand-secondary">
                     <Truck className="w-4 h-4 md:w-5 md:h-5 text-brand-coral" />
                     <span className="font-medium text-xs md:text-sm">3-6 Days Delivery</span>
                   </div> */}
                <div className="flex items-center gap-1.5 md:gap-2 text-brand-secondary">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-brand-coral" />
                  <span className="font-medium text-xs md:text-sm">Secure Payment</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Animated Photo Stack */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center justify-center order-1 lg:order-2 mb-8 lg:mb-0">

              <HeroPhotoStack />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 md:py-12 px-4 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-4 md:gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-warm-light rounded-full flex items-center justify-center mb-2 md:mb-4">
                <Palette className="w-5 h-5 md:w-7 md:h-7 text-brand-coral" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-brand-dark mb-1 md:mb-2">8 Border Colors</h3>
              <p className="text-xs md:text-base text-brand-secondary hidden sm:block">White, Black, Pink & more</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-warm-light rounded-full flex items-center justify-center mb-2 md:mb-4">
                <Sliders className="w-5 h-5 md:w-7 md:h-7 text-brand-coral" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-brand-dark mb-1 md:mb-2">5 Photo Effects</h3>
              <p className="text-xs md:text-base text-brand-secondary hidden sm:block">Vintage, Noir, Vivid & more</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-10 h-10 md:w-14 md:h-14 bg-brand-warm-light rounded-full flex items-center justify-center mb-2 md:mb-4">
                <PenTool className="w-5 h-5 md:w-7 md:h-7 text-brand-coral" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-brand-dark mb-1 md:mb-2">Custom Captions</h3>
              <p className="text-xs md:text-base text-brand-secondary hidden sm:block">Add personal messages</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-normal text-brand-dark mb-3 md:mb-4" style={{ fontFamily: 'var(--font-serif)' }}>
              How to Order Retro Prints Online
            </h2>
            <p className="text-base md:text-xl text-brand-secondary">Simple 3-step process to get your polaroid prints</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-bold mx-auto mb-4 md:mb-6 shadow-lg"
                style={{ backgroundColor: 'var(--color-coral)' }}>
                1
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-brand-dark mb-2 md:mb-3">Upload Photos</h3>
              <p className="text-sm md:text-base lg:text-lg text-brand-secondary">
                Select your favorite photos from your device. Minimum 18 prints required.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-bold mx-auto mb-4 md:mb-6 shadow-lg"
                style={{ backgroundColor: 'var(--color-coral)' }}>
                2
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-brand-dark mb-2 md:mb-3">Customize Style</h3>
              <p className="text-sm md:text-base lg:text-lg text-brand-secondary">
                Choose border colors, apply vintage effects, and add custom captions.
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-white rounded-full flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-bold mx-auto mb-4 md:mb-6 shadow-lg"
                style={{ backgroundColor: 'var(--color-coral)' }}>
                3
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-brand-dark mb-2 md:mb-3">Get Delivered</h3>
              <p className="text-sm md:text-base lg:text-lg text-brand-secondary">
                Your retro prints arrive in 3-6 days, ready to display or gift.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* User Photos Gallery */}
      <UserPhotosGallery />

      {/* FAQ Section */}
      <FAQSection />

      {/* Latest Blog Posts */}
      <LatestBlogPosts />

      {/* Final CTA */}
      <section className="py-12 md:py-16 lg:py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div
            className="rounded-2xl md:rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 text-white text-center"
            style={{ background: 'linear-gradient(135deg, var(--color-coral) 0%, var(--color-coral-dark) 100%)' }}>

            <Package className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-4 md:mb-6 opacity-90" />
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-normal mb-4 md:mb-6" style={{ fontFamily: 'var(--font-serif)' }}>
              Ready to Print Your Memories?
            </h2>
            <p className="text-base md:text-xl mb-6 md:mb-8 opacity-90 max-w-2xl mx-auto">
              Order your custom polaroid prints online today. Premium retro photo printing delivered across India.
            </p>
            <Link to={createPageUrl('Studio')}>
              <Button
                size="lg"
                className="bg-white hover:bg-gray-50 rounded-full text-base md:text-lg lg:text-xl px-8 md:px-12 py-5 md:py-8 shadow-xl w-full md:w-auto font-semibold transition-all"
                style={{ color: 'var(--color-coral)' }}>

                <Image className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
                Start Creating Now
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 md:ml-3" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>);

}