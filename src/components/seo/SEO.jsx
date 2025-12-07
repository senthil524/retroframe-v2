import { Helmet } from 'react-helmet-async';

const defaultSEO = {
  siteName: 'RetroFrame',
  siteUrl: 'https://retroframe.co',
  defaultTitle: 'RetroFrame - Premium Polaroid Prints Online India',
  defaultDescription: 'Order custom polaroid prints online in India. Premium retro photo printing service with vintage effects, 8 border colors & custom captions. 18 prints starting at Rs.270. Free shipping across India.',
  defaultImage: 'https://retroframe.co/og-image.jpg',
  twitterHandle: '@retroframe',
  themeColor: '#FF6B6B'
};

export default function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  structuredData,
  keywords
}) {
  // Get canonical URL - use provided url or fallback to current path
  const getCanonicalUrl = () => {
    if (url) {
      return `${defaultSEO.siteUrl}${url}`;
    }
    // Fallback to current pathname for dynamic canonical
    if (typeof window !== 'undefined') {
      return `${defaultSEO.siteUrl}${window.location.pathname}`;
    }
    return defaultSEO.siteUrl;
  };

  const seo = {
    title: title ? `${title} | ${defaultSEO.siteName}` : defaultSEO.defaultTitle,
    description: description || defaultSEO.defaultDescription,
    image: image || defaultSEO.defaultImage,
    url: getCanonicalUrl(),
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={defaultSEO.siteName} />
      <link rel="canonical" href={seo.url} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />

      {/* Theme */}
      <meta name="theme-color" content={defaultSEO.themeColor} />
      <meta name="msapplication-TileColor" content={defaultSEO.themeColor} />

      {/* Geo Tags for Local SEO (India) */}
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Pre-defined structured data generators
export const structuredData = {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RetroFrame",
    "url": "https://retroframe.co",
    "logo": "https://retroframe.co/logo.png",
    "description": "Premium polaroid and retro photo printing service in India",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://retroframe.co/contact"
    }
  },

  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Polaroid Prints",
    "description": "Custom polaroid prints with vintage effects, 8 border colors & custom captions. Premium retro photo printing service in India.",
    "image": "https://retroframe.co/og-image.jpg",
    "sku": "RETRO-POLAROID-18",
    "mpn": "RF-POL-001",
    "brand": {
      "@type": "Brand",
      "name": "RetroFrame"
    },
    "offers": {
      "@type": "Offer",
      "url": "https://retroframe.co/studio",
      "priceCurrency": "INR",
      "price": "270",
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "RetroFrame"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "INR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": "1",
            "maxValue": "2",
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": "3",
            "maxValue": "6",
            "unitCode": "DAY"
          }
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "IN"
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "IN",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 7,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/FreeReturn"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "20",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Kaleesh"
        },
        "reviewBody": "Absolutely blown away by the quality! These retro polaroid prints look so authentic and premium. The matte finish feels luxurious and the colors came out perfectly.",
        "datePublished": "2024-11-23"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Karthika"
        },
        "reviewBody": "Ordered 25 prints for my birthday party photo wall and they were the highlight! Everyone kept asking where I got them. Super fast delivery too.",
        "datePublished": "2024-11-07"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Agila"
        },
        "reviewBody": "The vintage effect transformed my photos into gorgeous art pieces. My memory wall looks straight out of Pinterest! Exceptional quality.",
        "datePublished": "2024-11-14"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Lavanya"
        },
        "reviewBody": "Gifted these to my parents for their anniversary with custom captions. They were so touched! The personal touch made it incredibly special.",
        "datePublished": "2024-11-30"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Ganesh"
        },
        "reviewBody": "As a photographer, I am very particular about print quality. RetroFrame exceeded my expectations! The 300 GSM paper is top-notch.",
        "datePublished": "2024-12-02"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Vani"
        },
        "reviewBody": "Created a beautiful travel memories collection with different border colors. The mint and lavender borders are so pretty! Love the customization.",
        "datePublished": "2024-12-03"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Muthu"
        },
        "reviewBody": "Best polaroid printing service in India! Ordered for my sister wedding and the prints arrived within 4 days. The noir effect looked stunning.",
        "datePublished": "2024-12-04"
      },
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Swathi"
        },
        "reviewBody": "Such a wonderful experience! The prints arrived beautifully packaged and the quality is amazing. Perfect for my room decor. Will definitely order again!",
        "datePublished": "2024-11-30"
      }
    ]
  },

  website: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "RetroFrame",
    "url": "https://retroframe.co",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://retroframe.co/order-tracking?order_number={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  },

  localBusiness: {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "RetroFrame",
    "image": "https://retroframe.co/og-image.jpg",
    "url": "https://retroframe.co",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN"
    },
    "areaServed": {
      "@type": "Country",
      "name": "India"
    }
  },

  faq: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is the minimum order for polaroid prints?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The minimum order is 18 polaroid prints, starting at Rs.270. Additional prints cost Rs.15 each."
        }
      },
      {
        "@type": "Question",
        "name": "How long does delivery take?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Delivery takes 3-6 business days across India. Shipping is free for all orders."
        }
      },
      {
        "@type": "Question",
        "name": "What customization options are available?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can choose from 8 border colors (white, black, cream, pink, blue, mint, lavender, peach), 5 vintage photo effects (original, vintage, noir, vivid, dramatic), and add custom captions to each print."
        }
      },
      {
        "@type": "Question",
        "name": "What size are the polaroid prints?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Our polaroid prints are standard polaroid size (3.5 x 4.25 inches) with the classic white border. The photo area is 3 x 3 inches."
        }
      },
      {
        "@type": "Question",
        "name": "Can I track my order?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! After placing your order, you'll receive an order number. Use it on our Order Tracking page to check your order status and delivery updates."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept all major payment methods including UPI, credit cards, debit cards, net banking, and popular wallets through our secure PayU payment gateway."
        }
      },
      {
        "@type": "Question",
        "name": "What is your return policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We offer a 7-day return policy for damaged or defective prints. Contact us within 7 days of delivery with photos of the issue, and we'll arrange a free replacement or refund."
        }
      },
      {
        "@type": "Question",
        "name": "Can I use photos from my phone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! You can upload photos directly from your phone, tablet, or computer. We support all common image formats (JPG, PNG, HEIC) and optimize them for the best print quality."
        }
      }
    ]
  },

  // Breadcrumb schema generator
  breadcrumb: (items) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `https://retroframe.co${item.url}`
    }))
  }),

  // Article/BlogPosting schema generator for blog posts
  article: ({ title, description, image, url, datePublished, dateModified, author = 'RetroFrame Team', readingTime }) => ({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "image": image || "https://retroframe.co/og-image.jpg",
    "url": `https://retroframe.co${url}`,
    "datePublished": datePublished,
    "dateModified": dateModified || datePublished,
    "author": {
      "@type": "Person",
      "name": author,
      "url": "https://retroframe.co"
    },
    "publisher": {
      "@type": "Organization",
      "name": "RetroFrame",
      "logo": {
        "@type": "ImageObject",
        "url": "https://retroframe.co/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://retroframe.co${url}`
    },
    ...(readingTime && { "timeRequired": `PT${readingTime}M` })
  }),

  // Collection page schema for blog listing
  collectionPage: ({ title, description, url }) => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": `https://retroframe.co${url}`,
    "isPartOf": {
      "@type": "WebSite",
      "name": "RetroFrame",
      "url": "https://retroframe.co"
    }
  })
};
