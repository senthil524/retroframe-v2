import { Helmet } from 'react-helmet-async';

const defaultSEO = {
  siteName: 'RetroFrame',
  siteUrl: 'https://retroframe.co',
  defaultTitle: 'RetroFrame - Premium Polaroid Prints Online India',
  defaultDescription: 'Order custom polaroid prints online in India. Premium retro photo printing service with vintage effects, 8 border colors & custom captions. 18 prints starting at Rs.270. Free shipping across India.',
  defaultImage: 'https://retroframe.co/hero-images/hero-8.jpg',
  twitterHandle: '@retroframe',
  themeColor: '#E67E6A'
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
    // Check if url is explicitly provided (including "/" for homepage)
    if (url !== undefined && url !== null) {
      // For homepage "/" return base URL, otherwise append the path
      if (url === '/') {
        return defaultSEO.siteUrl;
      }
      return `${defaultSEO.siteUrl}${url}`;
    }
    // Fallback to current pathname for dynamic canonical
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        return defaultSEO.siteUrl;
      }
      return `${defaultSEO.siteUrl}${window.location.pathname}`;
    }
    return defaultSEO.siteUrl;
  };

  const seo = {
    // Don't append siteName if title already contains it or includes 'RetroFrame'
    title: title
      ? (title.toLowerCase().includes('retroframe') ? title : `${title} | ${defaultSEO.siteName}`)
      : defaultSEO.defaultTitle,
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
    "@id": "https://retroframe.co/#organization",
    "name": "RetroFrame",
    "alternateName": ["Retro Frame", "RetroFrame India", "RetroFrame Prints"],
    "url": "https://retroframe.co",
    "logo": {
      "@type": "ImageObject",
      "url": "https://retroframe.co/logo.png",
      "width": 512,
      "height": 512,
      "caption": "RetroFrame - Premium Polaroid Prints"
    },
    "image": "https://retroframe.co/hero-images/hero-8.jpg",
    "description": "Premium polaroid and retro photo printing service in India. Transform your digital photos into beautiful vintage-style polaroid prints with custom captions, 8 border colors, and 5 photo effects.",
    "slogan": "Transform Your Memories Into Timeless Prints",
    "foundingDate": "2024",
    "areaServed": {
      "@type": "Country",
      "name": "India"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IN",
      "addressRegion": "Tamil Nadu"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "hello@retroframe.co",
        "url": "https://retroframe.co/contact",
        "availableLanguage": ["English", "Tamil", "Hindi"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "url": "https://retroframe.co/Studio"
      }
    ],
    "sameAs": [
      "https://www.instagram.com/getretroframe",
      "https://www.facebook.com/profile.php?id=61584005676606"
    ],
    "knowsAbout": [
      "Polaroid Prints",
      "Retro Photo Printing",
      "Custom Photo Prints",
      "Vintage Photography",
      "Photo Gifts"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Polaroid Print Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Custom Polaroid Prints",
            "description": "18 polaroid prints with custom effects and borders"
          }
        }
      ]
    }
  },

  product: {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Retro Polaroid Prints",
    "alternateName": [
      "Polaroid Photo Prints",
      "Custom Polaroid Prints",
      "Vintage Photo Prints",
      "Retro Photo Prints",
      "Instant Photo Prints",
      "Polaroid Style Prints",
      "Mini Photo Prints",
      "Square Photo Prints"
    ],
    "description": "Custom polaroid prints with vintage effects, 8 border colors & custom captions. Premium retro photo printing service in India. 18 prints starting at ₹270 with free shipping.",
    "image": [
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-8.jpg",
        "name": "Baby Milestone Polaroid Prints",
        "description": "Custom baby milestone polaroid prints - perfect for preserving precious moments"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-7.jpg",
        "name": "Friends Trip Polaroid Prints",
        "description": "Friends trip polaroid prints flat lay - capture travel memories in retro style"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-3.jpg",
        "name": "Polaroid Wall Decor",
        "description": "Polaroid wall decor with fairy lights and clips - trendy room decoration"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-4.jpg",
        "name": "Polaroid Prints Unboxing",
        "description": "Unboxing polaroid prints from delivery box - premium packaging experience"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-1.jpg",
        "name": "Custom Polaroid Prints",
        "description": "Hands holding polaroid prints fanned out - custom vintage photo prints"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-2.jpg",
        "name": "Polaroid Prints Gift",
        "description": "Polaroid prints as gift in kraft envelope - personalized gift idea"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-5.jpg",
        "name": "Workspace Polaroid Decor",
        "description": "Workspace desk decorated with polaroid prints - home office decoration"
      },
      {
        "@type": "ImageObject",
        "url": "https://retroframe.co/hero-images/hero-6.jpg",
        "name": "Couple Polaroid Memories",
        "description": "Couple holding polaroid prints of memories - anniversary gift ideas"
      }
    ],
    "sku": "RETRO-POLAROID-18",
    "mpn": "RF-POL-001",
    "gtin13": "0000000000000",
    "url": "https://retroframe.co/Studio",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://retroframe.co"
    },
    "brand": {
      "@type": "Brand",
      "name": "RetroFrame"
    },
    "category": "Photo Prints > Polaroid Prints",
    "material": "270 GSM Premium Matte Photo Paper",
    "size": "3.5 x 4 inches",
    "color": "White, Black, Cream, Pink, Blue, Mint, Lavender, Peach",
    "offers": {
      "@type": "Offer",
      "url": "https://retroframe.co/Studio",
      "priceCurrency": "INR",
      "price": 270,
      "priceValidUntil": "2026-12-31",
      "availability": "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "RetroFrame",
        "url": "https://retroframe.co"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": 0,
          "currency": "INR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 6,
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
      "ratingValue": 4.9,
      "reviewCount": 20,
      "bestRating": 5,
      "worstRating": 1
    },
    "review": [
      {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
          "ratingValue": 5,
          "bestRating": 5
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
    "@id": "https://retroframe.co/#website",
    "name": "RetroFrame",
    "alternateName": "RetroFrame - Premium Polaroid Prints India",
    "url": "https://retroframe.co",
    "description": "Order custom retro polaroid prints online in India. Premium vintage photo printing with 8 border colors, 5 effects & captions.",
    "publisher": {
      "@id": "https://retroframe.co/#organization"
    },
    "inLanguage": "en-IN",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://retroframe.co/order-tracking?order_number={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    ]
  },

  onlineStore: {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": "https://retroframe.co/#store",
    "name": "RetroFrame",
    "alternateName": "RetroFrame Online Store",
    "url": "https://retroframe.co",
    "description": "India's premium online store for custom retro polaroid prints. Order personalized vintage-style photo prints with doorstep delivery.",
    "image": [
      "https://retroframe.co/hero-images/hero-8.jpg",
      "https://retroframe.co/hero-images/hero-7.jpg",
      "https://retroframe.co/hero-images/hero-3.jpg",
      "https://retroframe.co/hero-images/hero-4.jpg"
    ],
    "logo": "https://retroframe.co/logo.png",
    "priceRange": "₹₹",
    "currenciesAccepted": "INR",
    "paymentAccepted": "UPI, Credit Card, Debit Card, Net Banking",
    "areaServed": {
      "@type": "Country",
      "name": "India",
      "identifier": "IN"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "India"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Polaroid Prints",
      "itemListElement": [
        {
          "@type": "OfferCatalog",
          "name": "Custom Polaroid Prints",
          "itemListElement": []
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": 4.9,
      "reviewCount": 20,
      "bestRating": 5
    },
    "parentOrganization": {
      "@id": "https://retroframe.co/#organization"
    }
  },

  // Image gallery schema for Google Images indexing
  imageGallery: {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Retro Polaroid Prints Gallery",
    "description": "Premium polaroid prints examples - baby photos, friendship memories, wall decor, unboxing experience",
    "url": "https://retroframe.co",
    "image": [
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-8.jpg",
        "name": "Baby milestone polaroid prints",
        "description": "Custom baby milestone polaroid prints held by Indian mother - perfect for preserving precious moments",
        "caption": "Baby Milestone Polaroid Prints"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-7.jpg",
        "name": "Friends trip polaroid prints",
        "description": "Indian friends trip polaroid prints flat lay aesthetic - capture travel memories",
        "caption": "Travel & Friends Polaroid Prints"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-3.jpg",
        "name": "Polaroid wall decor",
        "description": "Polaroid wall decor with fairy lights and clips - trendy room decoration ideas",
        "caption": "Polaroid Wall Decor Ideas"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-4.jpg",
        "name": "Unboxing polaroid prints",
        "description": "Unboxing polaroid prints from brown delivery box - premium packaging experience",
        "caption": "Polaroid Prints Unboxing"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-1.jpg",
        "name": "Hands holding polaroid prints",
        "description": "Indian hands holding polaroid prints fanned out - custom vintage photo prints",
        "caption": "Custom Polaroid Prints"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-2.jpg",
        "name": "Polaroid prints gift",
        "description": "Polaroid prints as gift in kraft paper envelope - perfect personalized gift idea",
        "caption": "Polaroid Prints Gift"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-5.jpg",
        "name": "Workspace desk polaroid decor",
        "description": "Workspace desk decorated with polaroid prints - home office decoration",
        "caption": "Desk Polaroid Decor"
      },
      {
        "@type": "ImageObject",
        "contentUrl": "https://retroframe.co/hero-images/hero-6.jpg",
        "name": "Couple polaroid memories",
        "description": "Indian couple holding polaroid prints of memories - anniversary gift ideas",
        "caption": "Couple Memories Polaroid"
      }
    ]
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
